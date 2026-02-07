const Worker = require('../models/Worker');
const { calculateDistance } = require('../utils/distanceCalculator');

/**
 * Get fixed list of categories
 * @route GET /api/workers/categories
 */
const getCategories = (req, res) => {
  const categories = [
    'Electrician',
    'Plumber',
    'Carpenter',
    'Self-care (Male)',
    'Self-care (Female)',
    'AC Repair',
    'Appliance Repair'
  ];

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
};

/**
 * Get workers by category with distance calculation and sorting
 * @route GET /api/workers?category=<category>&lat=<latitude>&lng=<longitude>
 */
const getWorkersByCategory = async (req, res, next) => {
  try {
    const { category, lat, lng } = req.query;

    if (!category || !lat || !lng) {
      res.status(400);
      throw new Error('Please provide category, lat, and lng');
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    // Find available workers
    const workers = await Worker.find({
      category,
      isAvailable: true,
    }).lean();

    // Calculate distance and filter/sort
    const workersWithDistance = workers.map((worker) => {
      const distance = calculateDistance(
        userLat,
        userLng,
        worker.location.lat,
        worker.location.lng
      );
      return { ...worker, distanceInKm: distance };
    });

    // Sort: Distance asc, Rating desc
    workersWithDistance.sort((a, b) => {
      if (Math.abs(a.distanceInKm - b.distanceInKm) > 0.5) { // 0.5km buffer for "nearby" priority
        return a.distanceInKm - b.distanceInKm;
      }
      return b.rating - a.rating;
    });

    res.status(200).json({
      success: true,
      count: workersWithDistance.length,
      data: workersWithDistance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get most booked workers for home screen
 * @route GET /api/workers/most-booked
 */
const getMostBookedWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find({ isAvailable: true })
      .sort({ totalBookings: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      count: workers.length,
      data: workers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkersByCategory,
  getMostBookedWorkers,
  getCategories
};
