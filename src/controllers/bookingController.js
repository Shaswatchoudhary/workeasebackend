const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const admin = require('../../firebase-admin');
const { calculateDistance } = require('../utils/distanceCalculator');

/**
 * Create a new booking
 * @route POST /api/booking
 */
const createBooking = async (req, res, next) => {
  try {
    const {
      workerId,
      category,
      serviceType,
      address,
      userLat,
      userLng
    } = req.body;

    // Validation
    if (!workerId || !category || !serviceType || !address || !userLat || !userLng) {
      res.status(400);
      throw new Error('Missing required fields: workerId, category, serviceType, address, userLat, userLng');
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      res.status(404);
      throw new Error('Worker not found');
    }

    // Calculate distance
    const distanceKm = calculateDistance(
      parseFloat(userLat),
      parseFloat(userLng),
      worker.location.lat,
      worker.location.lng
    );

    // Calculate price (simplified logic: base price + distance fee example)
    // In real app, this might come from frontend or complex logic
    const totalPrice = worker.pricePerHour; // Keeping it simple per requirements ("pricePerHour")

    const booking = await Booking.create({
      workerId: worker._id,
      workerName: worker.name,
      category,
      serviceType,
      pricePerHour: worker.pricePerHour,
      distanceKm,
      address,
      totalPrice,
      priceSummary: {
        base: worker.pricePerHour,
        distanceFee: 0,
        total: totalPrice
      },
      status: 'booked'
    });

    // Update worker stats
    await Worker.findByIdAndUpdate(workerId, {
      $inc: { totalBookings: 1 },
      isAvailable: false // Assume they become unavailable immediately
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get booking by ID
 * @route GET /api/booking/:bookingId
 */
const getBookingById = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate('workerId');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all bookings
 * @route GET /api/booking
 */
const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('workerId').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

const { notifyUser, notifyWorker } = require('../../notificationHelper');

/**
 * Update booking status
 * @route PATCH /api/booking/:bookingId/status
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'work_completed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let booking = await Booking.findById(bookingId);
    let userId = null;
    let workerId = null;

    if (!booking) {
      // If not in MongoDB, try to find in Firestore
      console.log(`[DEBUG] Booking ${bookingId} not found in MongoDB, checking Firestore...`);
      const db = admin.firestore();
      const firestoreBooking = await db.collection('bookings').doc(bookingId).get();
      
      if (!firestoreBooking.exists) {
        return res.status(404).json({ success: false, message: 'Booking not found in MongoDB or Firestore' });
      }

      const data = firestoreBooking.data();
      userId = data.userId;
      workerId = data.workerId;
      
      // Since it's not in MongoDB, we just process the notification and return success
      // (The Worker App already updated Firestore, so we just handle the side effects here)
      if (status === 'accepted') {
        await notifyUser(userId,
          'Booking Confirmed',
          'Your professional is on the way to your location!',
          { bookingId: bookingId, type: 'booking_accepted' }
        );
      }
      
      return res.status(200).json({
        success: true,
        message: `Notification for ${status} sent successfully (Firestore lookup)`
      });
    }

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();
    userId = booking.userId;
    workerId = booking.workerId;

    // ━━━━━━━━━━━━━━━━━━━━━
    // NOTIFICATION TRIGGERS
    // ━━━━━━━━━━━━━━━━━━━━━
    if (status === 'accepted' && oldStatus !== 'accepted') {
      await notifyUser(userId,
        'Booking Confirmed',
        'Your professional is on the way to your location!',
        { bookingId: booking._id.toString(), type: 'booking_accepted' }
      );
    } else if (status === 'work_completed' && oldStatus !== 'work_completed') {
      await notifyUser(booking.userId,
        'Work Completed',
        'Please confirm to close the job and rate the service.',
        { bookingId: booking._id.toString(), type: 'work_completed' }
      );
    } else if (status === 'completed' && oldStatus !== 'completed') {
      // Logic to update worker stats if completed
      const worker = await Worker.findById(booking.workerId);
      if (worker) {
        worker.completedOrders += 1;
        worker.totalEarnings = (worker.totalEarnings || 0) + booking.totalPrice;
        worker.earningsToday += booking.totalPrice;
        worker.earningsWeek += booking.totalPrice;
        worker.earningsMonth += booking.totalPrice;
        worker.isAvailable = true;
        await worker.save();
      }

      await notifyWorker(booking.workerId,
        'Job Closed',
        'The customer has confirmed the job is complete.',
        { bookingId: booking._id.toString(), type: 'job_closed' }
      );
    } else if (status === 'cancelled' && oldStatus !== 'cancelled') {
        // Make worker available again if job was accepted then cancelled
        await Worker.findByIdAndUpdate(booking.workerId, { isAvailable: true });
    }

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getBookings,
  updateBookingStatus
};
