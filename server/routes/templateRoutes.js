const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { authenticateUser } = require('../middleware/auth');

// Get all templates
router.get('/', templateController.getAllTemplates);

// Get template by ID
router.get('/:id', templateController.getTemplateById);

// Create resume from template
router.post('/create-resume', authenticateUser, templateController.createResumeFromTemplate);

module.exports = router; 