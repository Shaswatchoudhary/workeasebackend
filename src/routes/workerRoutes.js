const express = require('express');
const router = express.Router();
const {
  getWorkersByCategory,
  getMostBookedWorkers,
  getCategories
} = require('../controllers/workerController');

// Define specific routes BEFORE parameterized routes
router.get('/categories', getCategories);
router.get('/most-booked', getMostBookedWorkers);
router.get('/', getWorkersByCategory);

module.exports = router;
