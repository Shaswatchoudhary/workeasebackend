const admin = require('firebase-admin');
const path = require('path');

try {
  const serviceAccount = require('../../serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('[Firebase] Admin SDK Initialized successfully');
} catch (error) {
  console.error('[Firebase] Admin SDK Initialization Error:', error.message);
}

module.exports = admin;
