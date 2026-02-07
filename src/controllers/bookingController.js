const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
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

module.exports = {
  createBooking,
  getBookingById,
};
