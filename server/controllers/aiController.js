const {
  generateCacheKey,
  cacheResponse,
  getCachedResponse,
  callTogetherAI
} = require('../utils/aiHelpers');

const generateResume = async (req, res) => {
  try {
    const { userId, jobDescription, personalInfo, templateId } = req.body;

    // Check cache
    const cacheKey = generateCacheKey(userId, 'generate', { jobDescription, personalInfo, templateId });
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Prepare prompt for Together AI
    const prompt = `Create a professional 2-page resume based on the following:
    Job Description: ${jobDescription}
    Personal Information: ${JSON.stringify(personalInfo)}
    Format the resume according to template ID: ${templateId}
    Ensure content is ATS-compliant and focuses on relevant skills and experiences.`;

    const data = await callTogetherAI(prompt, 2048);
    
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

module.exports = {
  generateResume,
  editSection,
  getKeywords
}; 