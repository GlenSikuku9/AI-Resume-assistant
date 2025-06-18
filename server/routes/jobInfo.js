import express from 'express';
import { admin, initializeFirebase } from '../config/firebase.js';

// Initialize Firebase before using it
initializeFirebase();

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

// Create new job description
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

    const jobDescription = {
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

    const docRef = await db.collection('JobDescription').add(jobDescription);
    
    res.status(201).json({
      id: docRef.id,
      message: 'Job description created successfully',
      jobDescription: { ...jobDescription, id: docRef.id }
    });
  } catch (error) {
    console.error('Error creating job description:', error);
    res.status(500).json({ error: 'Failed to create job description' });
  }
});

// Get all job descriptions for a user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const snapshot = await db.collection('JobDescription')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const jobDescriptionList = [];
    snapshot.forEach(doc => {
      jobDescriptionList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(jobDescriptionList);
  } catch (error) {
    console.error('Error fetching job descriptions:', error);
    res.status(500).json({ error: 'Failed to fetch job descriptions' });
  }
});

// Get specific job description by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const doc = await db.collection('JobDescription').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Job description not found' });
    }

    const jobDescription = doc.data();
    
    // Ensure user can only access their own job descriptions
    if (jobDescription.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      id: doc.id,
      ...jobDescription
    });
  } catch (error) {
    console.error('Error fetching job description:', error);
    res.status(500).json({ error: 'Failed to fetch job description' });
  }
});

// Update job description
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const { title, company, description, requirements, responsibilities, keySkills } = req.body;

    // First check if the document exists and belongs to the user
    const doc = await db.collection('JobDescription').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Job description not found' });
    }

    const existingJobDescription = doc.data();
    if (existingJobDescription.userId !== userId) {
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

    const updatedJobDescription = {
      title,
      company,
      description: description || '',
      requirements: requirementsArray,
      responsibilities: responsibilitiesArray,
      keySkills: keySkillsArray,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('JobDescription').doc(id).update(updatedJobDescription);
    
    res.json({
      message: 'Job description updated successfully',
      jobDescription: { id, ...updatedJobDescription }
    });
  } catch (error) {
    console.error('Error updating job description:', error);
    res.status(500).json({ error: 'Failed to update job description' });
  }
});

// Delete job description
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    // First check if the document exists and belongs to the user
    const doc = await db.collection('JobDescription').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Job description not found' });
    }

    const jobDescription = doc.data();
    if (jobDescription.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.collection('JobDescription').doc(id).delete();
    
    res.json({ message: 'Job description deleted successfully' });
  } catch (error) {
    console.error('Error deleting job description:', error);
    res.status(500).json({ error: 'Failed to delete job description' });
  }
});

export default router; 