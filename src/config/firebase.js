let admin = null;

try {
  let serviceAccount = null;

  // 1. Check if the secret is provided as an Environment Variable (for Render/Production)
  // Note: Render env var keys can have dots, but process.env['key'] is safer
  const envSecret = process.env['serviceAccountKey.json'] || process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (envSecret) {
    try {
      serviceAccount = JSON.parse(envSecret);
      console.log('[Firebase] Using service account from Environment Variable');
    } catch (e) {
      console.error('[Firebase] Failed to parse service account Environment Variable:', e.message);
    }
  }

  // 2. If no env var, fall back to the local file (for Local Development)
  if (!serviceAccount) {
    try {
      serviceAccount = require('../../serviceAccountKey.json');
      console.log('[Firebase] Using service account from local file');
    } catch (e) {
      // File not found is expected on production
    }
  }

  if (serviceAccount) {
    admin = require('firebase-admin');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('[Firebase] Admin SDK Initialized successfully');
  } else {
    console.warn('[Firebase] Admin SDK Initialization skipped: No service account found (env or file)');
  }
} catch (error) {
  console.error('[Firebase] Critical Initialization Error:', error.message);
}

module.exports = admin;
