import express from 'express';
import {
  getTemplates,
  getUserResumes,
  createResume,
  updateResume,
  deleteResume
} from '../controllers/resumeController.js';

const router = express.Router();

// Get all resume templates
router.get('/templates', getTemplates);

// Get user's resumes
router.get('/user/:userId', getUserResumes);

// Create new resume
router.post('/', createResume);

// Update resume content
router.put('/:resumeId', updateResume);

// Delete resume
router.delete('/:resumeId', deleteResume);

export default router; 