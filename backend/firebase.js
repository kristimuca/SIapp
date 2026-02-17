const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      return admin.app();
    }

    // For production, use service account JSON
    // For development, use project ID only (requires Firebase emulator or proper credentials)
    const serviceAccount = process.env.FIREBASE_PRIVATE_KEY ? {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    } : null;

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // Fallback: Initialize with project ID only (for development)
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }

    console.log('Firebase Admin initialized successfully');
    return admin.app();
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    throw error;
  }
};

// Initialize Firebase
initializeFirebase();

// Export Firebase services
const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth,
};
