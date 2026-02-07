const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide worker name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide worker category'],
      enum: {
        values: [
          'Electrician',
          'Plumber',
          'Carpenter',
          'Self-care (Male)',
          'Self-care (Female)',
          'AC Repair',
          'Appliance Repair'
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    serviceType: {
      type: String,
      required: [true, 'Please provide service type'],
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: [0, 'Years of experience cannot be negative'],
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Please provide price per hour'],
      min: [0, 'Price cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    totalBookings: {
      type: Number,
      default: 0,
      min: [0, 'Total bookings cannot be negative'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      // Only required if category is Self-care, but good to have optional for others
    },
    location: {
      type: {
        lat: {
          type: Number,
          required: [true, 'Please provide latitude'],
          min: [-90, 'Latitude must be between -90 and 90'],
          max: [90, 'Latitude must be between -90 and 90'],
        },
        lng: {
          type: Number,
          required: [true, 'Please provide longitude'],
          min: [-180, 'Longitude must be between -180 and 180'],
          max: [180, 'Longitude must be between -180 and 180'],
        },
      },
      required: [true, 'Please provide location'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
workerSchema.index({ category: 1, isAvailable: 1 });
workerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Worker', workerSchema);
