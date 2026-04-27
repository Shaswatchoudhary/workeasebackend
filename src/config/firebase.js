let admin = null;

try {
  // Use require for the JSON file to load it as an object
  const serviceAccount = require('../../serviceAccountKey.json');
  
  admin = require('firebase-admin');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('[Firebase] Admin SDK Initialized successfully');
} catch (error) {
  // Log a warning instead of an error to indicate it's skipped
  console.warn('[Firebase] Admin SDK Initialization skipped: serviceAccountKey.json not found');
}

module.exports = admin;
