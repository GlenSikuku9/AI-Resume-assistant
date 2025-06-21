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

const getJobSeekerAnalytics = async (req, res) => {
  try {
    const analyticsSnapshot = await admin.firestore()
      .collection('JobSeekerAnalytics')
      .get();

    let totalResumesCreated = 0;
    let totalApiCalls = 0;
    let totalPDFDownloads = 0;
    let totalAITokensUsed = 0;
    let templateUsageCount = {};
    let mostUsedTemplate = null;
    let mostUsedTemplateCount = 0;
    const userAnalytics = [];

    analyticsSnapshot.forEach(doc => {
      const data = doc.data();
      userAnalytics.push({ id: doc.id, ...data });
      totalResumesCreated += data.totalResumesCreated || 0;
      totalApiCalls += data.totalApiCalls || 0;
      totalPDFDownloads += data.totalPDFDownloads || 0;
      totalAITokensUsed += data.totalAITokensUsed || 0;
      if (data.templateUsageCount) {
        Object.entries(data.templateUsageCount).forEach(([templateId, count]) => {
          templateUsageCount[templateId] = (templateUsageCount[templateId] || 0) + count;
        });
      }
    });

    // Find most used template
    Object.entries(templateUsageCount).forEach(([templateId, count]) => {
      if (count > mostUsedTemplateCount) {
        mostUsedTemplate = templateId;
        mostUsedTemplateCount = count;
      }
    });

    res.json({
      totalResumesCreated,
      totalApiCalls,
      totalPDFDownloads,
      totalAITokensUsed,
      templateUsageCount,
      mostUsedTemplate,
      userAnalytics
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

export {
  getApiUsage,
  getPerformanceMetrics,
  getUserStats,
  updateSettings,
  getJobSeekerAnalytics,
  getAllUsers,
  deleteUser
}; 