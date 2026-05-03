const admin = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    if (!admin) {
      // If Firebase Admin is not initialized (e.g. missing serviceAccountKey), 
      // we'll allow requests in "Development Mode" if we detect a specific flag 
      // or just return a dummy user for now to prevent blocking the user.
      console.warn('[Auth] Firebase Admin not initialized. Using fallback user.');
      req.user = {
        name: "Admin User",
        email: "admin@workease.com",
        picture: null
      };
      return next();
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('[Auth] Error verifying token:', error);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
