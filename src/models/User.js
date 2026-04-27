const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'User'
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    unique: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  profileImage: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
