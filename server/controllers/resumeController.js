import { admin } from '../config/firebase.js';

const getTemplates = async (req, res) => {
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
};

const getUserResumes = async (req, res) => {
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
};

const createResume = async (req, res) => {
  try {
    console.log('Request user:', req.user);
    console.log('Request body:', req.body);
    
    const { 
      templateId, 
      jobDescription, 
      personalInfo, 
      education, 
      experience, 
      skills,
      content,
      versions 
    } = req.body;
    
    // Use the authenticated user's ID
    const userId = req.user?.uid;
    
    if (!userId) {
      console.error('No user ID found in request');
      return res.status(401).json({ error: 'User not authenticated properly' });
    }
    
    console.log('Creating resume for user:', userId);
    
    const resumeData = {
      userId,
      templateId: templateId || null,
      jobDescription: jobDescription || {},
      personalInfo: personalInfo || {},
      education: education || [],
      experience: experience || [],
      skills: skills || {},
      content: content || '',
      versions: versions || [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    console.log('Resume data to save:', resumeData);
    
    const resumeRef = await admin.firestore()
      .collection('resumes')
      .add(resumeData);
    
    console.log('Resume created with ID:', resumeRef.id);
    
    res.json({ id: resumeRef.id });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateResume = async (req, res) => {
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
};

const deleteResume = async (req, res) => {
  try {
    await admin.firestore()
      .collection('resumes')
      .doc(req.params.resumeId)
      .delete();
    
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResumeById = async (req, res) => {
  try {
    const doc = await admin.firestore().collection('resumes').doc(req.params.resumeId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getTemplates,
  getUserResumes,
  createResume,
  updateResume,
  deleteResume,
  getResumeById
}; 