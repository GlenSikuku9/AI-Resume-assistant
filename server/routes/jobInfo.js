import express from 'express';
import { admin } from '../config/firebase.js';

const router = express.Router();
const db = admin.firestore();

// Middleware to verify Firebase token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Create new job information
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { title, company, description, requirements, responsibilities, keySkills } = req.body;
    const userId = req.user.uid;

    // Validate required fields
    if (!title || !company) {
      return res.status(400).json({ error: 'Title and company are required' });
    }

    // Convert string inputs to arrays if needed
    const requirementsArray = Array.isArray(requirements) 
      ? requirements 
      : requirements.split('\n').filter(req => req.trim());
    
    const responsibilitiesArray = Array.isArray(responsibilities) 
      ? responsibilities 
      : responsibilities.split('\n').filter(resp => resp.trim());
    
    const keySkillsArray = Array.isArray(keySkills) 
      ? keySkills 
      : keySkills.split(',').map(skill => skill.trim()).filter(skill => skill);

    const jobInfo = {
      title,
      company,
      description: description || '',
      requirements: requirementsArray,
      responsibilities: responsibilitiesArray,
      keySkills: keySkillsArray,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('jobInfo').add(jobInfo);
    
    res.status(201).json({
      id: docRef.id,
      message: 'Job information created successfully',
      jobInfo: { ...jobInfo, id: docRef.id }
    });
  } catch (error) {
    console.error('Error creating job information:', error);
    res.status(500).json({ error: 'Failed to create job information' });
  }
});

// Get all job information for a user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const snapshot = await db.collection('jobInfo')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const jobInfoList = [];
    snapshot.forEach(doc => {
      jobInfoList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(jobInfoList);
  } catch (error) {
    console.error('Error fetching job information:', error);
    res.status(500).json({ error: 'Failed to fetch job information' });
  }
});

// Get specific job information by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const doc = await db.collection('jobInfo').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Job information not found' });
    }

    const jobInfo = doc.data();
    
    // Ensure user can only access their own job information
    if (jobInfo.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      id: doc.id,
      ...jobInfo
    });
  } catch (error) {
    console.error('Error fetching job information:', error);
    res.status(500).json({ error: 'Failed to fetch job information' });
  }
});

// Update job information
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const { title, company, description, requirements, responsibilities, keySkills } = req.body;

    // First check if the document exists and belongs to the user
    const doc = await db.collection('jobInfo').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Job information not found' });
    }

    const existingJobInfo = doc.data();
    if (existingJobInfo.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Validate required fields
    if (!title || !company) {
      return res.status(400).json({ error: 'Title and company are required' });
    }

    // Convert string inputs to arrays if needed
    const requirementsArray = Array.isArray(requirements) 
      ? requirements 
      : requirements.split('\n').filter(req => req.trim());
    
    const responsibilitiesArray = Array.isArray(responsibilities) 
      ? responsibilities 
      : responsibilities.split('\n').filter(resp => resp.trim());
    
    const keySkillsArray = Array.isArray(keySkills) 
      ? keySkills 
      : keySkills.split(',').map(skill => skill.trim()).filter(skill => skill);

    const updatedJobInfo = {
      title,
      company,
      description: description || '',
      requirements: requirementsArray,
      responsibilities: responsibilitiesArray,
      keySkills: keySkillsArray,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('jobInfo').doc(id).update(updatedJobInfo);
    
    res.json({
      message: 'Job information updated successfully',
      jobInfo: { id, ...updatedJobInfo }
    });
  } catch (error) {
    console.error('Error updating job information:', error);
    res.status(500).json({ error: 'Failed to update job information' });
  }
});

// Delete job information
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    // First check if the document exists and belongs to the user
    const doc = await db.collection('jobInfo').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Job information not found' });
    }

    const jobInfo = doc.data();
    if (jobInfo.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.collection('jobInfo').doc(id).delete();
    
    res.json({ message: 'Job information deleted successfully' });
  } catch (error) {
    console.error('Error deleting job information:', error);
    res.status(500).json({ error: 'Failed to delete job information' });
  }
});

export default router; 