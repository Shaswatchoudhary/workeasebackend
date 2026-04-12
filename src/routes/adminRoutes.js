const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// All routes under /api/admin
router.get('/stats', adminController.getStats);
router.get('/workers', adminController.getAllWorkers);
router.patch('/workers/:id/status', adminController.updateWorkerStatus);
router.get('/users', adminController.getAllUsers);
router.get('/bookings', adminController.getAllBookings);

module.exports = router;
