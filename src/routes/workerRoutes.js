const express = require('express');
const router = express.Router();
const {
  getWorkersByCategory,
  getMostBookedWorkers,
  getCategories,
  sendOtp,
  verifyOtp,
  registerWorker,
  getDashboard
} = require('../controllers/workerController');

// Define specific routes BEFORE parameterized routes
router.get('/categories', getCategories);
router.get('/most-booked', getMostBookedWorkers);

// Worker Onboarding & Auth
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerWorker);
router.get('/dashboard/:workerId', getDashboard);

// User-side queries
router.get('/', getWorkersByCategory);

module.exports = router;
