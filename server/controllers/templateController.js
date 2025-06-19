import { admin } from '../config/firebase.js';

// Get all templates from Firestore
export const getAllTemplates = async (req, res) => {
  try {
    const templatesSnapshot = await admin.firestore().collection('templates').get();
    const templates = [];
    templatesSnapshot.forEach(doc => {
      templates.push({ id: doc.id, ...doc.data() });
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error: error.message });
  }
};

// Get template by ID from Firestore
export const getTemplateById = async (req, res) => {
  try {
    const doc = await admin.firestore().collection('templates').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching template', error: error.message });
  }
};

// Create initial resume based on template
export const createResumeFromTemplate = async (req, res) => {
  try {
    const { templateId, jobDescriptionId, userInfoId } = req.body;
    
    // Get template
    const template = await Template.getTemplateById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Create initial resume structure based on template's default sections
    const initialResume = {
      user: req.user._id,
      name: `Resume - ${template.name}`,
      templateId: template._id,
      versions: [{
        versionNumber: 1,
        content: {
          // Initialize sections based on template defaults
          sections: template.defaultSections.reduce((acc, section) => {
            acc[section] = null; // Will be populated by AI
            return acc;
          }, {})
        },
        createdAt: new Date(),
        description: 'Initial version created from template'
      }]
    };

    // Save resume and return
    const resume = await Resume.create(initialResume);
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error creating resume', error: error.message });
  }
}; 