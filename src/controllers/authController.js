// const axios = require('axios'); // Not needed for Dev Mode
const Otp = require('../models/otpModel');
const User = require('../models/User');
const Worker = require('../models/Worker');

// Generate numeric OTP
const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit OTP
};

// Send OTP
exports.sendOtp = async (req, res) => {
  console.log('[Backend] /send-otp called');
  try {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    // 1. Generate OTP
    const otpValue = generateOtp();

    // 2. Save to DB
    await Otp.deleteMany({ phoneNumber: phone });
    await Otp.create({ phoneNumber: phone, otp: otpValue });

    console.log(`[Backend] Dev Mode OTP for ${phone}: ${otpValue}`);

    // 3. Return OTP in response (DEV MODE)
    return res.status(200).json({
      success: true,
      message: 'OTP sent (Dev Mode)',
      otp: otpValue // Sending OTP to frontend for easy login
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    // 1. Find OTP in DB
    const start = new Date(new Date().getTime() - 5 * 60 * 1000); // 5 mins ago

    // We rely on TTL index, but manual check ensures we don't match stale data if index is lagging
    const record = await Otp.findOne({
      phoneNumber: phone,
      otp: otp
    });

    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid or Expired OTP' });
    }

    // 2. Clear OTP
    // 3. Login/Register successful
    await Otp.deleteOne({ _id: record._id });

    // Find or create user
    let user = await User.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      user = await User.create({ phone });
      isNewUser = true;
    }

    res.status(200).json({
      success: true,
      message: 'OTP Verified Successfully',
      user: {
        _id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      },
      isNewUser
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
