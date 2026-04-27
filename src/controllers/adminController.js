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

// @desc    Get all registered users
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
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
