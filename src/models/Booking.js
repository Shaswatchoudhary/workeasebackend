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
      type: String,
      required: [true, 'Please provide worker name'],
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
      type: Number,
      required: [true, 'Please provide price per hour'],
    },
    distanceKm: {
      type: Number,
      required: [true, 'Please provide distance'],
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
      type: Number,
      required: [true, 'Please provide total price'],
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
