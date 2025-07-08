import { admin } from '../config/firebase.js';

const getApiUsage = async (req, res) => {
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
};

const getPerformanceMetrics = async (req, res) => {
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
};

const getUserStats = async (req, res) => {
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
};

const updateSettings = async (req, res) => {
  try {
    await admin.firestore()
      .collection('system_settings')
      .doc('config')
      .set(req.body, { merge: true });
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminAnalytics = async (req, res) => {
  try {
    const mainDoc = await admin.firestore()
      .collection('Admin')
      .doc('main')
      .get();
    const data = mainDoc.exists ? mainDoc.data() : {};
    // Build templateUsageCount from top-level fields that are numbers and not known analytics fields
    const templateUsageCount = {};
    Object.entries(data).forEach(([key, value]) => {
      if (
        typeof value === 'number' &&
        !['totalApiCalls', 'totalPDFDownloads', 'totalResumesCreated', 'updatedAt'].includes(key)
      ) {
        templateUsageCount[key] = value;
      }
    });
    let mostUsedTemplate = null;
    let mostUsedTemplateCount = 0;
    Object.entries(templateUsageCount).forEach(([templateId, count]) => {
      if (count > mostUsedTemplateCount) {
        mostUsedTemplate = templateId;
        mostUsedTemplateCount = count;
      }
    });
    res.json({
      totalResumesCreated: data.totalResumesCreated || 0,
      totalApiCalls: data.totalApiCalls || 0,
      totalPDFDownloads: data.totalPDFDownloads || 0,
      templateUsageCount,
      mostUsedTemplate,
      userAnalytics: []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List all users (for admin dashboard)
const getAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .get();
    const users = [];
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user (from Auth and Firestore)
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // Delete from Firebase Auth
    await admin.auth().deleteUser(userId);
    // Delete from Firestore
    await admin.firestore().collection('users').doc(userId).delete();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTotalResumes = async (req, res) => {
  try {
    const resumesSnap = await admin.firestore().collection('resumes').get();
    const totalResumes = resumesSnap.size;
    res.json({ totalResumes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Increment PDF Downloads
export const incrementPDFDownloads = async (req, res) => {
  try {
    const docRef = admin.firestore().collection('Admin').doc('main');
    await docRef.set({
      totalPDFDownloads: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    res.json({ message: 'PDF download count incremented' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Increment Resumes Created
export const incrementResumesCreated = async (req, res) => {
  try {
    const docRef = admin.firestore().collection('Admin').doc('main');
    await docRef.set({
      totalResumesCreated: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    res.json({ message: 'Resumes created count incremented' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Increment API Calls (AI Chat Send)
export const incrementApiCalls = async (req, res) => {
  try {
    const docRef = admin.firestore().collection('Admin').doc('main');
    await docRef.set({
      totalApiCalls: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    res.json({ message: 'API call count incremented' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Increment Template Usage
export const incrementTemplateUsage = async (req, res) => {
  try {
    const { templateId } = req.body;
    if (!templateId) return res.status(400).json({ error: 'templateId is required' });
    const docRef = admin.firestore().collection('Admin').doc('main');
    await docRef.set({
      [`${templateId}`]: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    res.json({ message: 'Template usage incremented' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getApiUsage,
  getPerformanceMetrics,
  getUserStats,
  updateSettings,
  getAdminAnalytics,
  getAllUsers,
  deleteUser
}; 