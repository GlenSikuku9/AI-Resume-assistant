import { admin } from '../config/firebase.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Add this to define __dirname in ES modules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Create a new template
export const createTemplate = async (req, res) => {
  try {
    const data = req.body;
    data.createdAt = new Date().toISOString();
    const docRef = await admin.firestore().collection('templates').add(data);
    const newDoc = await docRef.get();
    res.status(201).json({ id: docRef.id, ...newDoc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Error creating template', error: error.message });
  }
};

// Update an existing template
export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await admin.firestore().collection('templates').doc(id).update(data);
    const updatedDoc = await admin.firestore().collection('templates').doc(id).get();
    res.json({ id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Error updating template', error: error.message });
  }
};

// Delete a template
export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    await admin.firestore().collection('templates').doc(id).delete();
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting template', error: error.message });
  }
};

// Image upload for template
export const uploadTemplateImage = async (req, res) => {
  try {
    if (!req.file || !req.body.templateName) {
      return res.status(400).json({ error: 'Image file and templateName are required' });
    }
    // Save the file to client/public/Images as templatename.png
    const imagesDir = path.resolve(__dirname, '../../client/public/Images');
    console.log('Resolved imagesDir:', imagesDir);
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    const ext = path.extname(req.file.originalname) || '.png';
    const safeName = req.body.templateName.replace(/[^a-zA-Z0-9-_.]/g, '_');
    const destPath = path.join(imagesDir, `${safeName}${ext}`);
    console.log('Saving image to:', destPath);
    fs.renameSync(req.file.path, destPath);
    console.log('Image saved successfully');
    const publicPath = `/Images/${safeName}${ext}`;
    // Optionally, update Firestore here if templateId is provided
    res.json({ imagePath: publicPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 