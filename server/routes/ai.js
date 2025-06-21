import express from 'express';
import { rateLimitMiddleware } from '../middleware/rateLimit.js';
import {
  generateResume,
  editSection,
  getKeywords
} from '../controllers/aiController.js';

const router = express.Router();

// Generate initial resume
router.post('/generate',  generateResume);

// Edit specific section
router.post('/edit-section', rateLimitMiddleware, editSection);

// Get keyword suggestions
router.post('/keywords', rateLimitMiddleware, getKeywords);

export default router; 