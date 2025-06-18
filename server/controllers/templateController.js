import Template from '../models/Template.js';

// Get all active templates
export const getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.getActiveTemplates();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error: error.message });
  }
};

// Get template by ID
export const getTemplateById = async (req, res) => {
  try {
    const template = await Template.getTemplateById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
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