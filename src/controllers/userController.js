const User = require('../models/User');

/**
 * Update User Profile
 * @route POST /api/users/update
 * @access Public (for now, eventually should use JWT)
 */
exports.updateProfile = async (req, res) => {
  try {
    const { userId, name, email, profileImage, firebaseUid } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, profileImage, firebaseUid },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('[UserController] Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get User Profile
 * @route GET /api/users/:id
 * @access Public
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

/**
 * Create a new issue report
 * @route POST /api/users/report
 */
exports.createReport = async (req, res) => {
  try {
    const Report = require('../models/Report');
    const { bookingId, userId, workerId, userName, workerName, subject, description, priority, category } = req.body;

    const report = await Report.create({
      bookingId,
      userId,
      workerId,
      userName,
      workerName,
      subject: subject || 'Booking Issue',
      description,
      priority: priority || 'medium',
      category: category || 'General'
    });

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('[UserController] Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating report',
      error: error.message
    });
  }
};
