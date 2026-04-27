const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: [true, 'Please provide worker ID'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    workerName: {
      type: String
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
    },
    serviceType: {
      type: String,
      required: [true, 'Please provide service type'],
    },
    pricePerHour: {
      type: Number
    },
    distanceKm: {
      type: Number
    },
    bookingTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ['booked', 'accepted', 'work_completed', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'booked',
    },
    address: {
      type: String,
      required: [true, 'Please provide address'],
    },
    totalPrice: {
      type: Number
    },
    priceSummary: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookingSchema.index({ workerId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
