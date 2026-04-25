const admin = require('firebase-admin');

/**
 * Firebase Admin Initialization
 * Prioritizes FIREBASE_SERVICE_ACCOUNT environment variable (for Render/Production)
 * Falls back to serviceAccountKey.json for local development
 */
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT env var:', err.message);
  }
} else {
  try {
    serviceAccount = require('./serviceAccountKey.json');
  } catch (err) {
    console.warn('Firebase service account key not found (serviceAccountKey.json). Push notifications will not work unless configured.');
  }
}

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin initialized successfully');
}

module.exports = admin;
