const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const User = require('../models/User');
const { calculateDistance } = require('../utils/distanceCalculator');

/**
 * Create a new booking
 * @route POST /api/booking
 */
const createBooking = async (req, res, next) => {
  try {
    console.log('[DEBUG] createBooking req.body:', JSON.stringify(req.body, null, 2));
    const {
      workerId,
      category,
      serviceType,
      userLat,
      userLng,
      userId,
      address
    } = req.body;

    // Use a default address if missing to avoid 400 error
    const finalAddress = address || 'Location provided via map';

    // Validation (Less strict to avoid blocking the user)
    const requiredFields = ['workerId', 'userId'];
    const missingFields = requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null || req.body[field] === '');
    
    if (missingFields.length > 0) {
      console.log('[DEBUG] Missing critical fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Find Worker (handle both MongoDB ID and Firebase UID)
    let worker;
    try {
      if (workerId.length === 24) {
        worker = await Worker.findById(workerId);
      }
      if (!worker) {
        worker = await Worker.findOne({ firebaseUid: workerId });
      }
    } catch (err) {
      worker = await Worker.findOne({ firebaseUid: workerId });
    }

    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    // Find User (handle both MongoDB ID and Firebase UID)
    let userDoc;
    try {
      if (userId.length === 24) {
        userDoc = await User.findById(userId);
      }
      if (!userDoc) {
        userDoc = await User.findOne({ firebaseUid: userId });
      }
    } catch (err) {
      userDoc = await User.findOne({ firebaseUid: userId });
    }

    if (!userDoc) {
      return res.status(404).json({ success: false, message: 'User not found. Please ensure your profile is synced.' });
    }

    // Calculate distance
    const distanceKm = calculateDistance(
      parseFloat(userLat),
      parseFloat(userLng),
      worker.location?.lat || 0,
      worker.location?.lng || 0
    );

    const totalPrice = worker.pricePerHour || 249; 

    const booking = await Booking.create({
      workerId: worker._id,
      userId: userDoc._id,
      workerName: worker.name,
      category: category || 'Service',
      serviceType: serviceType || 'Professional',
      pricePerHour: worker.pricePerHour || 249,
      distanceKm,
      address: finalAddress,
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

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    // ━━━━━━━━━━━━━━━━━━━━━
    // NOTIFICATION TRIGGERS
    // ━━━━━━━━━━━━━━━━━━━━━
    if (status === 'accepted' && oldStatus !== 'accepted') {
      await notifyUser(booking.userId,
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
