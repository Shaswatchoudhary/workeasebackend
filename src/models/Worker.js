const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  // Personal Information
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  aadhaar: { type: String, required: true },
  pan: { type: String, required: true },

  // Professional Details
  category: { type: String, required: true },
  skills: [{ type: String }],
  experience: { type: String, required: true },
  summary: { type: String, required: true },

  // Banking Details
  accountHolderName: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifsc: { type: String, required: true },
  upi: { type: String },

  // Status & Metadata
  isVerified: { type: Boolean, default: false },
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

module.exports = mongoose.model('Worker', workerSchema);
