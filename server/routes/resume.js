const express = require('express');
const router = express.Router();
const {
  getTemplates,
  getUserResumes,
  createResume,
  updateResume,
  deleteResume
} = require('../controllers/resumeController');

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

module.exports = router; 