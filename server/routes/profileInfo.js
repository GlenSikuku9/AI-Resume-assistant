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

// Create new profile information
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { personalInfo, education, experience, skills } = req.body;
    const userId = req.user.uid;

    // Validate required fields
    if (!personalInfo || !personalInfo.fullName || !personalInfo.email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    const profileInfo = {
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

    const docRef = await db.collection('profileInfo').add(profileInfo);
    
    res.status(201).json({
      id: docRef.id,
      message: 'Profile information created successfully',
      profileInfo: { ...profileInfo, id: docRef.id }
    });
  } catch (error) {
    console.error('Error creating profile information:', error);
    res.status(500).json({ error: 'Failed to create profile information' });
  }
});

// Get all profile information for a user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const snapshot = await db.collection('profileInfo')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const profileInfoList = [];
    snapshot.forEach(doc => {
      profileInfoList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(profileInfoList);
  } catch (error) {
    console.error('Error fetching profile information:', error);
    res.status(500).json({ error: 'Failed to fetch profile information' });
  }
});

// Get specific profile information by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const doc = await db.collection('profileInfo').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Profile information not found' });
    }

    const profileInfo = doc.data();
    
    // Ensure user can only access their own profile information
    if (profileInfo.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      id: doc.id,
      ...profileInfo
    });
  } catch (error) {
    console.error('Error fetching profile information:', error);
    res.status(500).json({ error: 'Failed to fetch profile information' });
  }
});

// Update profile information
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const { personalInfo, education, experience, skills } = req.body;

    // First check if the document exists and belongs to the user
    const doc = await db.collection('profileInfo').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Profile information not found' });
    }

    const existingProfileInfo = doc.data();
    if (existingProfileInfo.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Validate required fields
    if (!personalInfo || !personalInfo.fullName || !personalInfo.email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    const updatedProfileInfo = {
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

    await db.collection('profileInfo').doc(id).update(updatedProfileInfo);
    
    res.json({
      message: 'Profile information updated successfully',
      profileInfo: { id, ...updatedProfileInfo }
    });
  } catch (error) {
    console.error('Error updating profile information:', error);
    res.status(500).json({ error: 'Failed to update profile information' });
  }
});

// Delete profile information
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    // First check if the document exists and belongs to the user
    const doc = await db.collection('profileInfo').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Profile information not found' });
    }

    const profileInfo = doc.data();
    if (profileInfo.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.collection('profileInfo').doc(id).delete();
    
    res.json({ message: 'Profile information deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile information:', error);
    res.status(500).json({ error: 'Failed to delete profile information' });
  }
});

export default router; 