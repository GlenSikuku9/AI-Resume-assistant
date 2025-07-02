import express from 'express';
import * as templateController from '../controllers/templateController.js';
import { verifyToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const upload = multer({ dest: path.resolve('./uploads') });

// Get all templates
router.get('/', templateController.getAllTemplates);

// Get template by ID
router.get('/:id', templateController.getTemplateById);

// Create resume from template
router.post('/create-resume', verifyToken, templateController.createResumeFromTemplate);

// Create a new template
router.post('/', verifyToken, isAdmin, templateController.createTemplate);

// Update a template
router.put('/:id', verifyToken, isAdmin, templateController.updateTemplate);

// Delete a template
router.delete('/:id', verifyToken, isAdmin, templateController.deleteTemplate);

// Add image upload endpoint
router.post('/upload-image', verifyToken, isAdmin, upload.single('image'), templateController.uploadTemplateImage);

export default router; 