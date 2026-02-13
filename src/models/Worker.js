const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  // Personal Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    minlength: [3, 'Full name must be at least 3 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Full name can only contain alphabets and spaces']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    },
    address: { type: String, required: [true, 'Address is required'] }
  },
  aadhaar: {
    type: String,
    required: [true, 'Aadhaar number is required'],
    unique: true,
    match: [/^\d{12}$/, 'Aadhaar must be exactly 12 digits']
  },
  pan: {
    type: String,
    required: [true, 'PAN card number is required'],
    unique: true,
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN card format']
  },

  // Professional Details
  category: { type: String, required: [true, 'Category is required'] },
  skills: [{ type: String }],
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: 0,
    max: 50
  },
  summary: {
    type: String,
    required: [true, 'Professional summary is required'],
    minlength: [50, 'Summary must be at least 50 characters'] // Though user asked for 50 words, we'll validate words in controller/frontend
  },

  // Banking Details
  bankDetails: {
    holderName: { type: String, required: true },
    bankName: { type: String, required: true },
    accountNumber: {
      type: String,
      required: true,
      minlength: [9, 'Account number must be at least 9 digits']
    },
    ifsc: {
      type: String,
      required: true,
      uppercase: true,
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format']
    },
    upi: { type: String }
  },

  // Status & Metadata
  status: {
    type: String,
    enum: ['UNDER_REVIEW', 'ACTIVE', 'INACTIVE'],
    default: 'UNDER_REVIEW'
  },
  isOnline: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  completedOrders: { type: Number, default: 0 },
  earningsToday: { type: Number, default: 0 },
  earningsWeek: { type: Number, default: 0 },
  earningsMonth: { type: Number, default: 0 },
  pendingEarnings: { type: Number, default: 0 },
  hoursOnline: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

workerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Worker', workerSchema);
