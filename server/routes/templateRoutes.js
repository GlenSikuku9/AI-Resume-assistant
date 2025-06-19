import express from 'express';
import * as templateController from '../controllers/templateController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all templates
router.get('/', templateController.getAllTemplates);

// Get template by ID
router.get('/:id', templateController.getTemplateById);

// Create resume from template
router.post('/create-resume', verifyToken, templateController.createResumeFromTemplate);

export default router; 