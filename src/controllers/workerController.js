const Worker = require('../models/Worker');
const WorkerOtp = require('../models/WorkerOtp');
const { calculateDistance } = require('../utils/distanceCalculator');

// @desc    Send OTP to worker
// @route   POST /api/worker/send-otp
// @access  Public
const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Please provide a phone number' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Dev Mode: Store/Update OTP
    await WorkerOtp.findOneAndUpdate(
      { phone },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    console.log(`[WorkerAuth] OTP for ${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully (Check server logs)',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined // Return OTP in dev
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP for worker
// @route   POST /api/worker/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide phone and OTP' });
    }

    const otpRecord = await WorkerOtp.findOne({ phone, otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Delete OTP after verification
    await WorkerOtp.deleteOne({ _id: otpRecord._id });

    const worker = await Worker.findOne({ phone });
    const isNewWorker = !worker;

    res.status(200).json({
      success: true,
      newWorker: isNewWorker,
      workerId: worker ? worker._id : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register new worker
// @route   POST /api/worker/register
// @access  Public
const registerWorker = async (req, res, next) => {
  try {
    const workerData = req.body;

    // Check if worker already exists
    const existingWorker = await Worker.findOne({ phone: workerData.phone });
    if (existingWorker) {
      return res.status(400).json({ success: false, message: 'Worker already registered with this phone number' });
    }

    const worker = await Worker.create(workerData);

    res.status(201).json({
      success: true,
      data: worker
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get worker dashboard/profile
// @route   GET /api/worker/dashboard/:workerId
// @access  Private (Simulated for now via params)
const getDashboard = async (req, res, next) => {
  try {
    const { workerId } = req.params;
    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    res.status(200).json({
      success: true,
      data: worker
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get fixed list of categories
 * @route GET /api/workers/categories
 */
const getCategories = (req, res) => {
  const categories = [
    'Electrician',
    'Plumber',
    'Carpenter',
    'Men\'s Care',
    'Women\'s Care',
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

    const workers = await Worker.find({
      category,
      isOnline: true, // Use isOnline instead of isAvailable to match new schema
    }).lean();

    const workersWithDistance = workers.map((worker) => {
      // Handle missing location if any (old data)
      const workerLat = worker.location?.lat || 0;
      const workerLng = worker.location?.lng || 0;

      const distance = calculateDistance(
        userLat,
        userLng,
        workerLat,
        workerLng
      );
      return { ...worker, distanceInKm: distance };
    });

    workersWithDistance.sort((a, b) => {
      if (Math.abs(a.distanceInKm - b.distanceInKm) > 0.5) {
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

const getMostBookedWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find({ isOnline: true })
      .sort({ completedOrders: -1 })
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
  sendOtp,
  verifyOtp,
  registerWorker,
  getDashboard,
  getWorkersByCategory,
  getMostBookedWorkers,
  getCategories
};
