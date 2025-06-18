import express from 'express';
import { admin } from '../config/firebase.js';
import {
  getTemplates,
  getUserResumes,
  createResume,
  updateResume,
  deleteResume
} from '../controllers/resumeController.js';

const router = express.Router();

// Middleware to verify Firebase token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    console.log('Verifying token...');
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verified, user:', decodedToken);
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all resume templates
router.get('/templates', getTemplates);

// Get user's resumes
router.get('/user/:userId', authenticateUser, getUserResumes);

// Create new resume
router.post('/', authenticateUser, createResume);

// Update resume content
router.put('/:resumeId', authenticateUser, updateResume);

// Delete resume
router.delete('/:resumeId', authenticateUser, deleteResume);

export default router; 