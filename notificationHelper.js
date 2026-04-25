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
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists && userDoc.data().fcmToken) {
      await sendNotification(userDoc.data().fcmToken, title, body, data);
    } else {
      console.log(`User ${userId} not found or has no FCM token in Firestore`);
    }
  } catch (error) {
    console.error('Error in notifyUser:', error);
  }
};

const notifyWorker = async (workerId, title, body, data = {}) => {
  try {
    const db = admin.firestore();
    const workerDoc = await db.collection('workers').doc(workerId).get();
    if (workerDoc.exists && workerDoc.data().fcmToken) {
      await sendNotification(workerDoc.data().fcmToken, title, body, data);
    } else {
      console.log(`Worker ${workerId} not found or has no FCM token in Firestore`);
    }
  } catch (error) {
    console.error('Error in notifyWorker:', error);
  }
};

module.exports = { sendNotification, notifyUser, notifyWorker };
