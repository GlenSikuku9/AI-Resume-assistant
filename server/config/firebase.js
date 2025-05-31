const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
const initializeFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
};

module.exports = {
  admin,
  initializeFirebase
}; 