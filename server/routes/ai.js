import express from 'express';
import { rateLimitMiddleware } from '../middleware/rateLimit.js';
import {
  generateResume,
  editSection,
  getKeywords,
  getChatMessages
} from '../controllers/aiController.js';

const router = express.Router();

// Generate initial resume
router.post('/generate',  generateResume);

// Edit specific section
router.post('/edit-section',  editSection);

// Get keyword suggestions
router.post('/keywords', rateLimitMiddleware, getKeywords);

// Get chat messages for a resume
router.get('/chat-messages/:resumeId', getChatMessages);

export default router; 