import {
  generateCacheKey,
  cacheResponse,
  getCachedResponse,
  callTogetherAI
} from '../utils/aiHelpers.js';
import { admin } from '../config/firebase.js';

const generateResume = async (req, res) => {
  try {
    const { userId, jobDescription, personalInfo, templateId } = req.body;

    // Fetch template content from Firestore
    const templateDoc = await admin.firestore().collection('templates').doc(templateId).get();
    if (!templateDoc.exists) {
      return res.status(404).json({ error: 'Template not found' });
    }
    const template = templateDoc.data();

    // Check cache
    const cacheKey = generateCacheKey(userId, 'generate', { jobDescription, personalInfo, templateId });
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Prepare system prompt for Together AI (generate resume)
    const generateSystemPrompt = `You are a helpful assistant that generates professional, ATS-compliant resumes. Return ONLY the resume as valid HTML, with proper formatting as per the provided template. Do NOT include any explanations, leading words, or extra text—just the HTML resume content. Always follow these key characteristics for ATS compliance: Optimize for relevant keywords from the job description, use strong action verbs and success metrics, prioritize quality experience over quantity, use a clean, simple format with standard section headings, avoid graphics, tables, or unusual formatting, and focus on good formatting and clarity.`;

    // Prepare prompt for Together AI
    const prompt = `Create a professional 1-2 page resume based on the following information.\n\nJob Description: ${jobDescription}\nPersonal Information: ${JSON.stringify(personalInfo)}\n\nFormat the resume using this template structure and styling:\nTemplate Name: ${template.name}\nDescription: ${template.description}\nSections (in order): ${template.defaultOrder.join(', ')}\nSection Details: ${JSON.stringify(template.sections)}\nStyling: ${JSON.stringify(template.styling)}\n\nEnsure the resume is ATS-compliant and tailored to the job description, using the template's layout and style.\n\nKey characteristics for ATS compliance:\n- Optimize for relevant keywords from the job description\n- Use strong action verbs and success metrics\n- Prioritize quality experience over quantity\n- Use a clean, simple format with standard section headings\n- Avoid graphics, tables, or unusual formatting\n- Focus on good formatting and clarity.`;

    const aiContent = await callTogetherAI(prompt, 5000, generateSystemPrompt);
    // Cache the response
    cacheResponse(cacheKey, aiContent);

    // Save the generated resume to Firestore
    const timestamp = new Date().toISOString();
    const resumeData = {
      userId,
      templateId,
      jobDescription,
      personalInfo,
      content: aiContent,
      versions: [
        {
          content: aiContent,
          timestamp,
          userId
        }
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    const resumeRef = await admin.firestore().collection('resumes').add(resumeData);

    res.json({ id: resumeRef.id, content: aiContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editSection = async (req, res) => {
  try {
    const { userId, resumeId, content, instruction } = req.body;

    // Fetch the resume to get templateId
    const resumeDoc = await admin.firestore().collection('resumes').doc(resumeId).get();
    if (!resumeDoc.exists) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    const resume = resumeDoc.data();
    const templateId = resume.templateId;
    if (!templateId) {
      return res.status(400).json({ error: 'No templateId found for this resume' });
    }
    // Fetch the template
    const templateDoc = await admin.firestore().collection('templates').doc(templateId).get();
    if (!templateDoc.exists) {
      return res.status(404).json({ error: 'Template not found' });
    }
    const template = templateDoc.data();

    // Check cache
    const cacheKey = generateCacheKey(userId, 'edit', { resumeId, content, instruction });
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Prepare system prompt for Together AI (edit section)
    const editSystemPrompt = `You are a helpful assistant that edits sections of professional resumes. Return ONLY the edited section as valid HTML, formatted according to the provided template. Do NOT include explanations, leading words, or extra text—just the HTML content for the section. Always follow these key characteristics for ATS compliance: Optimize for relevant keywords from the job description, use strong action verbs and success metrics, prioritize quality experience over quantity, use a clean, simple format with standard section headings, avoid graphics, tables, or unusual formatting, and focus on good formatting and clarity.`;

    // Prepare prompt for Together AI
    const prompt = `Edit the following resume section based on the instruction. Format the result using this template structure and styling:\nTemplate Name: ${template.name}\nDescription: ${template.description}\nSections (in order): ${template.defaultOrder.join(', ')}\nSection Details: ${JSON.stringify(template.sections)}\nStyling: ${JSON.stringify(template.styling)}\n\nCurrent Content: ${content}\nInstruction: ${instruction}\nKeep the formatting consistent and ensure content remains ATS-compliant.`;

    // Save user chat message
    const now = admin.firestore.FieldValue.serverTimestamp();
    const userChat = {
      userId,
      resumeId,
      role: 'user',
      content, // This is the referenced section or the whole resume
      referenced: content, // If you want to distinguish, you can set to null if content is the whole resume
      instruction,
      createdAt: now,
      updatedAt: now,
      timestamp: now,
    };
    await admin.firestore().collection('aiChats').add(userChat);

    // Call AI
    const data = await callTogetherAI(prompt, 5000, editSystemPrompt);

    // Save AI chat message
    const aiChat = {
      userId,
      resumeId,
      role: 'ai',
      content: data, // AI's HTML response
      referenced: content,
      instruction: null,
      createdAt: now,
      updatedAt: now,
      timestamp: now,
    };
    await admin.firestore().collection('aiChats').add(aiChat);

    // Cache the response
    cacheResponse(cacheKey, { content: data });

    res.json({ content: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getKeywords = async (req, res) => {
  try {
    const { userId, jobDescription, section } = req.body;

    // Check cache
    const cacheKey = generateCacheKey(userId, 'keywords', { jobDescription, section });
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Prepare prompt for Together AI
    const prompt = `Extract relevant keywords and phrases from the following job description for the ${section} section:
    ${jobDescription}
    Provide a list of ATS-friendly keywords and phrases.`;

    const data = await callTogetherAI(prompt, 512);
    
    // Cache the response
    cacheResponse(cacheKey, data);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const chatSnapshot = await admin.firestore()
      .collection('aiChats')
      .where('resumeId', '==', resumeId)
      .orderBy('timestamp', 'asc')
      .get();
    const messages = [];
    chatSnapshot.forEach(doc => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: error.message });
  }
};

export {
  generateResume,
  editSection,
  getKeywords,
  getChatMessages
}; 