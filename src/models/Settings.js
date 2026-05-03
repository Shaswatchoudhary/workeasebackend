const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  autoApproveWorkers: { type: Boolean, default: false },
  emailNotifications: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: false },
  sessionTimeout: { type: Number, default: 30 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
