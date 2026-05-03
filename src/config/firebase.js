let admin = null;

try {
  let serviceAccount = null;

  // 1. Check if the secret is provided as an Environment Variable
  const envSecret = process.env['serviceAccountKey.json'] || process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (envSecret) {
    try {
      serviceAccount = JSON.parse(envSecret);
    } catch (e) {
      console.error('[Firebase] Failed to parse Environment Variable:', e.message);
    }
  }

  // 2. If no env var, fall back to local file
  if (!serviceAccount) {
    try {
      serviceAccount = require('../../serviceAccountKey.json');
    } catch (e) {}
  }

  if (serviceAccount || (require('firebase-admin').apps.length > 0)) {
    const adminSDK = require('firebase-admin');
    
    // CRITICAL FIX: Check if an app already exists before initializing
    if (!adminSDK.apps.length) {
      admin = adminSDK.initializeApp({
        credential: adminSDK.credential.cert(serviceAccount)
      });
      console.log('[Firebase] Admin SDK Initialized NEW instance');
    } else {
      admin = adminSDK.app();
      console.log('[Firebase] Admin SDK Reusing EXISTING instance');
    }
  } else {
    console.warn('[Firebase] Admin SDK Initialization skipped: No credentials found');
  }
} catch (error) {
  console.error('[Firebase] Critical Initialization Error:', error.message);
}

module.exports = admin;
