const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// All routes under /api/admin
router.get('/stats', adminController.getStats);
router.get('/workers', adminController.getAllWorkers);
router.patch('/workers/:id/status', adminController.updateWorkerStatus);
router.get('/users', adminController.getAllUsers);
router.get('/bookings', adminController.getAllBookings);
router.get('/reports', adminController.getAllReports);

router.get('/workers/:id', adminController.getWorkerById);
router.get('/bookings/:id', adminController.getBookingById);
router.patch('/reports/:id', adminController.updateReportStatus);

// Settings
router.get('/settings', adminController.getSettings);
router.patch('/settings', adminController.updateSettings);

// Profile
router.get('/profile', auth, adminController.getAdminProfile);

module.exports = router;
