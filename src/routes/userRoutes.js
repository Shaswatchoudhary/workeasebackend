const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Profile management
router.post('/update', userController.updateProfile);
router.get('/:id', userController.getProfile);

module.exports = router;
