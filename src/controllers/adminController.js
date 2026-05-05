const Worker = require('../models/Worker');
const User = require('../models/User');
const admin = require('../config/firebase');
const db = admin ? admin.firestore() : null;

// @desc    Get counts and overview statistics
// @route   GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const totalWorkers = await Worker.countDocuments();
    const pendingWorkers = await Worker.countDocuments({ status: 'UNDER_REVIEW' });
    const activeWorkers = await Worker.countDocuments({ status: 'ACTIVE' });
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalWorkers,
        pendingWorkers,
        activeWorkers,
        totalUsers,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all workers with full details
// @route   GET /api/admin/workers
exports.getAllWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: workers.length,
      data: workers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject a worker
// @route   PATCH /api/admin/workers/:id/status
exports.updateWorkerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['ACTIVE', 'REJECTED', 'UNDER_REVIEW', 'INACTIVE'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    // --- FIRESTORE SYNC ---
    if (db) {
      try {
        const firestoreData = {
          status: worker.status,
          isVerified: worker.status === 'ACTIVE',
          isActive: worker.status === 'ACTIVE',
          serviceType: worker.category,
          category: worker.category,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        if (worker.firebaseUid) {
          await db.collection('workers').doc(worker.firebaseUid).set(firestoreData, { merge: true });
          console.log(`[AdminSync] Firestore synced by UID for ${worker.fullName}`);
        } else if (worker.phone) {
          // Fallback: search by phone (normalized)
          const normalizedPhone = worker.phone.replace(/\D/g, '').slice(-10);
          const snap = await db.collection('workers').where('phone', '==', normalizedPhone).limit(1).get();
          if (!snap.empty) {
            await snap.docs[0].ref.set(firestoreData, { merge: true });
            console.log(`[AdminSync] Firestore synced by phone for ${worker.fullName}`);
          } else {
            // Try full phone string just in case
            const snap2 = await db.collection('workers').where('phone', '==', worker.phone).limit(1).get();
            if (!snap2.empty) {
              await snap2.docs[0].ref.set(firestoreData, { merge: true });
              console.log(`[AdminSync] Firestore synced by full phone for ${worker.fullName}`);
            } else {
              console.log(`[AdminSync] No Firestore record found for ${worker.fullName} (Phone: ${normalizedPhone})`);
            }
          }
        }
      } catch (fsError) {
        console.error('[AdminSync] Firestore sync failed:', fsError.message);
      }
    } else {
      console.warn('[AdminSync] Firestore sync skipped: Firebase Admin not initialized');
    }

    res.status(200).json({
      success: true,
      message: `Worker status updated to ${status}`,
      data: worker
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users with booking counts
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const Booking = require('../models/Booking');
    const users = await User.find().sort({ createdAt: -1 }).lean();

    // Attach real booking counts to each user
    const usersWithCounts = await Promise.all(users.map(async (user) => {
      const bookingCount = await Booking.countDocuments({ userId: user._id });
      return { ...user, bookingCount };
    }));

    res.status(200).json({
      success: true,
      count: usersWithCounts.length,
      data: usersWithCounts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (System Logs)
// @route   GET /api/admin/bookings
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await require('../models/Booking').find()
      .populate('workerId', 'fullName phone')
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports (System Issues)
// @route   GET /api/admin/reports
exports.getAllReports = async (req, res, next) => {
  try {
    const Report = require('../models/Report');
    const reports = await Report.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get single worker details
// @route   GET /api/admin/workers/:id
exports.getWorkerById = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    res.status(200).json({
      success: true,
      data: worker
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status (Resolve issue)
// @route   PATCH /api/admin/reports/:id
exports.updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const Report = require('../models/Report');

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status: status || 'resolved',
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get single booking details
// @route   GET /api/admin/bookings/:id
exports.getBookingById = async (req, res, next) => {
  try {
    const Booking = require('../models/Booking');
    const booking = await Booking.findById(req.params.id)
      .populate('workerId', 'fullName phone profileImage category')
      .populate('userId', 'name phone profileImage');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

const Settings = require('../models/Settings');

// --- SETTINGS MANAGEMENT ---
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    settings.updatedAt = Date.now();
    await settings.save();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// --- PROFILE MANAGEMENT ---
exports.getAdminProfile = async (req, res, next) => {
  try {
    // Return the dynamic profile data from the authenticated user
    const user = req.user || {};
    
    const profile = {
      fullName: user.name || "Administrator",
      role: "System Operations",
      email: user.email || "admin@workease.com",
      status: "Verified Admin",
      verified: true,
      avatar: user.picture || null,
      lastLogin: new Date().toISOString(),
      location: "Central Headquarters",
      professionalSummary: `Primary administrator for the WorkEase platform. Logged in via ${user.email || 'corporate account'}. Responsible for system integrity and operational oversight.`
    };
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};
// @desc    Send broadcast notification to all workers/users
// @route   POST /api/admin/broadcast
exports.sendBroadcast = async (req, res, next) => {
  try {
    const { title, message, target } = req.body;
    
    if (!db) {
      return res.status(500).json({ success: false, message: 'Firebase Admin not initialized' });
    }

    let tokens = [];

    // 1. Fetch tokens from Firestore 'users'
    if (target === 'all' || target === 'users') {
      const usersSnapshot = await db.collection('users').get();
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.fcmToken) tokens.push(data.fcmToken);
      });
    }

    // 2. Fetch tokens from Firestore 'workers'
    if (target === 'all' || target === 'workers') {
      const workersSnapshot = await db.collection('workers').get();
      workersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.fcmToken) tokens.push(data.fcmToken);
      });
    }

    // 3. Cleanup tokens (unique & valid)
    const uniqueTokens = [...new Set(tokens)].filter(t => t && t.length > 10);

    if (uniqueTokens.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'No active device tokens found to send to.',
        count: 0 
      });
    }

    // 4. Send Multicast via Firebase
    const multicastMessage = {
      notification: { title, body: message },
      data: { 
        type: 'broadcast',
        sender: 'Workies Admin',
        sentAt: new Date().toISOString()
      },
      tokens: uniqueTokens,
      android: {
        priority: 'high',
        notification: { channelId: 'default' }
      }
    };

    const response = await admin.messaging().sendEachForMulticast(multicastMessage);

    res.status(200).json({
      success: true,
      message: `Broadcast sent! Successfully delivered to ${response.successCount} devices.`,
      details: {
        total: uniqueTokens.length,
        success: response.successCount,
        failure: response.failureCount
      }
    });
  } catch (error) {
    console.error('[BroadcastError]', error);
    next(error);
  }
};
