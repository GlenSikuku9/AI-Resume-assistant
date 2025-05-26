const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    const userProfile = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .get();

    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      ...userProfile.data()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .set(req.body, { merge: true });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 