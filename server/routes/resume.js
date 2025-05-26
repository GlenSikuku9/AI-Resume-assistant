const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Get all resume templates
router.get('/templates', async (req, res) => {
  try {
    const templatesSnapshot = await admin.firestore()
      .collection('templates')
      .get();
    
    const templates = [];
    templatesSnapshot.forEach(doc => {
      templates.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's resumes
router.get('/user/:userId', async (req, res) => {
  try {
    const resumesSnapshot = await admin.firestore()
      .collection('resumes')
      .where('userId', '==', req.params.userId)
      .get();
    
    const resumes = [];
    resumesSnapshot.forEach(doc => {
      resumes.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new resume
router.post('/', async (req, res) => {
  try {
    const { userId, templateId, jobDescription, personalInfo } = req.body;
    
    const resumeRef = await admin.firestore()
      .collection('resumes')
      .add({
        userId,
        templateId,
        jobDescription,
        personalInfo,
        content: '',
        versions: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    
    res.json({ id: resumeRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update resume content
router.put('/:resumeId', async (req, res) => {
  try {
    const { content, version } = req.body;
    
    await admin.firestore()
      .collection('resumes')
      .doc(req.params.resumeId)
      .update({
        content,
        versions: admin.firestore.FieldValue.arrayUnion(version),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    
    res.json({ message: 'Resume updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete resume
router.delete('/:resumeId', async (req, res) => {
  try {
    await admin.firestore()
      .collection('resumes')
      .doc(req.params.resumeId)
      .delete();
    
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 