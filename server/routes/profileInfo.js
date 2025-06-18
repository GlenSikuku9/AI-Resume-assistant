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

// Create new job seeker information
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { personalInfo, education, experience, skills } = req.body;
    const userId = req.user.uid;

    // Validate required fields
    if (!personalInfo || !personalInfo.fullName || !personalInfo.email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    const jobSeekerInfo = {
      personalInfo: {
        fullName: personalInfo.fullName,
        email: personalInfo.email,
        phone: personalInfo.phone || '',
        location: personalInfo.location || '',
        linkedin: personalInfo.linkedin || '',
        portfolio: personalInfo.portfolio || '',
        summary: personalInfo.summary || ''
      },
      education: Array.isArray(education) ? education : [],
      experience: Array.isArray(experience) ? experience : [],
      skills: {
        technical: skills?.technical || '',
        soft: skills?.soft || '',
        languages: skills?.languages || '',
        certifications: skills?.certifications || ''
      },
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('JobSeekerInfo').add(jobSeekerInfo);
    
    res.status(201).json({
      id: docRef.id,
      message: 'Job seeker information created successfully',
      jobSeekerInfo: { ...jobSeekerInfo, id: docRef.id }
    });
  } catch (error) {
    console.error('Error creating job seeker information:', error);
    res.status(500).json({ error: 'Failed to create job seeker information' });
  }
});

// Get all job seeker information for a user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const snapshot = await db.collection('JobSeekerInfo')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const jobSeekerInfoList = [];
    snapshot.forEach(doc => {
      jobSeekerInfoList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(jobSeekerInfoList);
  } catch (error) {
    console.error('Error fetching job seeker information:', error);
    res.status(500).json({ error: 'Failed to fetch job seeker information' });
  }
});

// Get specific job seeker information by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const doc = await db.collection('JobSeekerInfo').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Job seeker information not found' });
    }

    const jobSeekerInfo = doc.data();
    
    // Ensure user can only access their own job seeker information
    if (jobSeekerInfo.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      id: doc.id,
      ...jobSeekerInfo
    });
  } catch (error) {
    console.error('Error fetching job seeker information:', error);
    res.status(500).json({ error: 'Failed to fetch job seeker information' });
  }
});

// Update job seeker information
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const { personalInfo, education, experience, skills } = req.body;

    // First check if the document exists and belongs to the user
    const doc = await db.collection('JobSeekerInfo').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Job seeker information not found' });
    }

    const existingJobSeekerInfo = doc.data();
    if (existingJobSeekerInfo.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Validate required fields
    if (!personalInfo || !personalInfo.fullName || !personalInfo.email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    const updatedJobSeekerInfo = {
      personalInfo: {
        fullName: personalInfo.fullName,
        email: personalInfo.email,
        phone: personalInfo.phone || '',
        location: personalInfo.location || '',
        linkedin: personalInfo.linkedin || '',
        portfolio: personalInfo.portfolio || '',
        summary: personalInfo.summary || ''
      },
      education: Array.isArray(education) ? education : [],
      experience: Array.isArray(experience) ? experience : [],
      skills: {
        technical: skills?.technical || '',
        soft: skills?.soft || '',
        languages: skills?.languages || '',
        certifications: skills?.certifications || ''
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('JobSeekerInfo').doc(id).update(updatedJobSeekerInfo);
    
    res.json({
      message: 'Job seeker information updated successfully',
      jobSeekerInfo: { id, ...updatedJobSeekerInfo }
    });
  } catch (error) {
    console.error('Error updating job seeker information:', error);
    res.status(500).json({ error: 'Failed to update job seeker information' });
  }
});

// Delete job seeker information
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    // First check if the document exists and belongs to the user
    const doc = await db.collection('JobSeekerInfo').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Job seeker information not found' });
    }

    const jobSeekerInfo = doc.data();
    if (jobSeekerInfo.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.collection('JobSeekerInfo').doc(id).delete();
    
    res.json({ message: 'Job seeker information deleted successfully' });
  } catch (error) {
    console.error('Error deleting job seeker information:', error);
    res.status(500).json({ error: 'Failed to delete job seeker information' });
  }
});

export default router; 