const admin = require('./firebase-admin');

const sendNotification = async (fcmToken, title, body, data = {}) => {
  if (!fcmToken) {
    console.log('No FCM token, skipping notification');
    return;
  }
  
  try {
    const message = {
      token: fcmToken,
      notification: { title, body },
      data: { ...data },
      android: {
        priority: 'high',
        notification: {
          channelId: 'default',
          priority: 'high',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
            sound: 'default',
          },
        },
      },
    };
    
    const response = await admin.messaging().send(message);
    console.log('Notification sent:', response);
    return response;
  } catch (error) {
    console.error('Notification error:', error);
  }
};

const notifyUser = async (userId, title, body, data = {}) => {
  try {
    const db = admin.firestore();
    let firebaseUid = userId;

    // If userId looks like a MongoDB ObjectId (24 chars hex), look it up
    if (typeof userId === 'string' && userId.length === 24) {
      const User = require('./src/models/User');
      const user = await User.findById(userId);
      if (user && user.firebaseUid) {
        firebaseUid = user.firebaseUid;
      }
    }

    const userDoc = await db.collection('users').doc(firebaseUid).get();
    if (userDoc.exists && userDoc.data().fcmToken) {
      await sendNotification(userDoc.data().fcmToken, title, body, data);
    } else {
      console.log(`User ${firebaseUid} not found or has no FCM token in Firestore`);
    }
  } catch (error) {
    console.error('Error in notifyUser:', error);
  }
};

const notifyWorker = async (workerId, title, body, data = {}) => {
  try {
    const db = admin.firestore();
    let firebaseUid = workerId;

    // If workerId looks like a MongoDB ObjectId, look it up
    if (typeof workerId === 'string' && workerId.length === 24) {
      const Worker = require('./src/models/Worker');
      const worker = await Worker.findById(workerId);
      if (worker && worker.firebaseUid) {
        firebaseUid = worker.firebaseUid;
      }
    }

    const workerDoc = await db.collection('workers').doc(firebaseUid).get();
    if (workerDoc.exists && workerDoc.data().fcmToken) {
      await sendNotification(workerDoc.data().fcmToken, title, body, data);
    } else {
      console.log(`Worker ${firebaseUid} not found or has no FCM token in Firestore`);
    }
  } catch (error) {
    console.error('Error in notifyWorker:', error);
  }
};

module.exports = { sendNotification, notifyUser, notifyWorker };
