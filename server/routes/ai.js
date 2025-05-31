const express = require('express');
const router = express.Router();
const rateLimitMiddleware = require('../middleware/rateLimit');
const {
  generateResume,
  editSection,
  getKeywords
} = require('../controllers/aiController');

// Generate initial resume
router.post('/generate', rateLimitMiddleware, generateResume);

// Edit specific section
router.post('/edit-section', rateLimitMiddleware, editSection);

// Get keyword suggestions
router.post('/keywords', rateLimitMiddleware, getKeywords);

module.exports = router; 