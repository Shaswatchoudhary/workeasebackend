const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  workerName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    default: 'Booking Issue'
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open'
  },
  category: {
    type: String,
    default: 'General'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);
