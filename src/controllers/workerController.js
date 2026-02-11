const Worker = require('../models/Worker');
const WorkerOtp = require('../models/WorkerOtp');
const { calculateDistance } = require('../utils/distanceCalculator');

// @desc    Send OTP to worker
// @route   POST /api/worker/send-otp
const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Please provide a phone number' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store/Update OTP
    await WorkerOtp.findOneAndUpdate(
      { phone },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    console.log(`[WorkerAuth] OTP for ${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP for worker
// @route   POST /api/worker/verify-otp
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
const registerWorker = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      address,
      lat,
      lng,
      aadhaar,
      pan,
      category,
      skills,
      experience,
      summary,
      bankDetails
    } = req.body;

    // 1. Strict Server-side Validation
    if (!fullName || fullName.length < 3 || !/^[a-zA-Z\s]+$/.test(fullName)) {
      return res.status(400).json({ success: false, message: 'Invalid full name' });
    }
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }
    if (!aadhaar || !/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({ success: false, message: 'Invalid Aadhaar number (12 digits required)' });
    }
    // PAN Validation: 5 letters, 4 digits, 1 letter
    if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase())) {
      return res.status(400).json({ success: false, message: 'Invalid PAN card format' });
    }
    if (!category || !skills || skills.length === 0) {
      return res.status(400).json({ success: false, message: 'Category and at least one skill required' });
    }
    if (experience === undefined || experience < 0 || experience > 50) {
      return res.status(400).json({ success: false, message: 'Invalid years of experience (0-50)' });
    }
    // Word count for summary (min 50 words)
    const wordCount = summary ? summary.trim().split(/\s+/).length : 0;
    if (wordCount < 50) {
      return res.status(400).json({ success: false, message: 'Professional summary must be at least 50 words' });
    }
    if (!bankDetails || bankDetails.holderName !== fullName) {
      return res.status(400).json({ success: false, message: 'Account holder name must match full name exactly' });
    }
    if (!bankDetails.accountNumber || bankDetails.accountNumber.length < 9) {
      return res.status(400).json({ success: false, message: 'Invalid bank account number' });
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifsc.toUpperCase())) {
      return res.status(400).json({ success: false, message: 'Invalid IFSC code' });
    }

    // 2. Duplicate Checks
    const existingPhone = await Worker.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }
    const existingAadhaar = await Worker.findOne({ aadhaar });
    if (existingAadhaar) {
      return res.status(400).json({ success: false, message: 'Aadhaar number already registered' });
    }
    const existingPan = await Worker.findOne({ pan: pan.toUpperCase() });
    if (existingPan) {
      return res.status(400).json({ success: false, message: 'PAN card already registered' });
    }

    // 3. Create Worker
    const worker = await Worker.create({
      fullName,
      phone,
      location: { address, lat, lng },
      aadhaar,
      pan: pan.toUpperCase(),
      category,
      skills,
      experience,
      summary,
      bankDetails,
      status: 'UNDER_REVIEW'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Under review.',
      data: worker
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get worker dashboard
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

const getCategories = (req, res) => {
  const categories = [
    'AC Repair',
    'Appliance Repair',
    'Carpenter',
    'Plumber',
    'Electrician',
    'Men\'s Self Care',
    'Women\'s Self Care'
  ];

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
};

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
      status: 'ACTIVE', // Only active workers for users
      isOnline: true,
    }).lean();

    const workersWithDistance = workers.map((worker) => {
      const distance = calculateDistance(
        userLat,
        userLng,
        worker.location?.lat || 0,
        worker.location?.lng || 0
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
    const workers = await Worker.find({ status: 'ACTIVE', isOnline: true })
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
