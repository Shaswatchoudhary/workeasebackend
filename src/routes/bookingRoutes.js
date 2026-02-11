const express = require('express');
const router = express.Router();
const { createBooking, getBookingById, getBookings } = require('../controllers/bookingController');

// POST /api/booking
router.post('/', createBooking);

// GET /api/booking
router.get('/', getBookings);

// GET /api/booking/:bookingId
router.get('/:bookingId', getBookingById);

module.exports = router;
