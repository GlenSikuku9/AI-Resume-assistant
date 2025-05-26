const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(decodedToken.uid)
      .get();
    
    if (!userDoc.data()?.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get API usage statistics
router.get('/api-usage', isAdmin, async (req, res) => {
  try {
    const usageSnapshot = await admin.firestore()
      .collection('api_usage')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();
    
    const usage = [];
    usageSnapshot.forEach(doc => {
      usage.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system performance metrics
router.get('/performance', isAdmin, async (req, res) => {
  try {
    const metricsSnapshot = await admin.firestore()
      .collection('system_metrics')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();
    
    const metrics = [];
    metricsSnapshot.forEach(doc => {
      metrics.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user statistics
router.get('/user-stats', isAdmin, async (req, res) => {
  try {
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .get();
    
    const resumesSnapshot = await admin.firestore()
      .collection('resumes')
      .get();
    
    const stats = {
      totalUsers: usersSnapshot.size,
      totalResumes: resumesSnapshot.size,
      averageResumesPerUser: resumesSnapshot.size / usersSnapshot.size
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update system settings
router.put('/settings', isAdmin, async (req, res) => {
  try {
    await admin.firestore()
      .collection('system_settings')
      .doc('config')
      .set(req.body, { merge: true });
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 