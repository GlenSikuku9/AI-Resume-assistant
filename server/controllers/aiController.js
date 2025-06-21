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

    // Prepare prompt for Together AI
    const prompt = `Create a professional 1-2 page resume based on the following information.\n\nJob Description: ${jobDescription}\nPersonal Information: ${JSON.stringify(personalInfo)}\n\nFormat the resume using this template structure and styling:\nTemplate Name: ${template.name}\nDescription: ${template.description}\nSections (in order): ${template.defaultOrder.join(', ')}\nSection Details: ${JSON.stringify(template.sections)}\nStyling: ${JSON.stringify(template.styling)}\n\nEnsure the resume is ATS-compliant and tailored to the job description, using the template's layout and style.\n\nKey characteristics for ATS compliance:\n- Optimize for relevant keywords from the job description\n- Use strong action verbs and success metrics\n- Prioritize quality experience over quantity\n- Use a clean, simple format with standard section headings\n- Avoid graphics, tables, or unusual formatting\n- Focus on good formatting and clarity.`;

    const data = await callTogetherAI(prompt, 5000);
    
    // Cache the response
    cacheResponse(cacheKey, data);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editSection = async (req, res) => {
  try {
    const { userId, section, content, instruction } = req.body;

    // Check cache
    const cacheKey = generateCacheKey(userId, 'edit', { section, content, instruction });
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Prepare prompt for Together AI
    const prompt = `Edit the following resume section based on the instruction:
    Section: ${section}
    Current Content: ${content}
    Instruction: ${instruction}
    Keep the formatting consistent and ensure content remains ATS-compliant.`;

    const data = await callTogetherAI(prompt, 1024);
    
    // Cache the response
    cacheResponse(cacheKey, data);

    res.json(data);
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

export {
  generateResume,
  editSection,
  getKeywords
}; 