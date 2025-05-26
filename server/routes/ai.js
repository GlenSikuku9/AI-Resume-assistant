const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// Cache for storing frequent requests
const requestCache = new Map();

// Helper function to generate cache key
const generateCacheKey = (userId, type, content) => {
  return `${userId}-${type}-${JSON.stringify(content)}`;
};

// Helper function to check rate limits
const rateLimiter = new Map();
const RATE_LIMIT = 60; // requests per minute
const checkRateLimit = (userId) => {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];
  const recentRequests = userRequests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimiter.set(userId, recentRequests);
  return true;
};

// Generate initial resume
router.post('/generate', async (req, res) => {
  try {
    const { userId, jobDescription, personalInfo, templateId } = req.body;
    
    // Check rate limit
    if (!checkRateLimit(userId)) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    // Check cache
    const cacheKey = generateCacheKey(userId, 'generate', { jobDescription, personalInfo, templateId });
    if (requestCache.has(cacheKey)) {
      return res.json(requestCache.get(cacheKey));
    }

    // Prepare prompt for Together AI
    const prompt = `Create a professional 2-page resume based on the following:
    Job Description: ${jobDescription}
    Personal Information: ${JSON.stringify(personalInfo)}
    Format the resume according to template ID: ${templateId}
    Ensure content is ATS-compliant and focuses on relevant skills and experiences.`;

    // Call Together AI API
    const response = await fetch('https://api.together.xyz/inference', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'togethercomputer/llama-3.3-70b-instruct',
        prompt,
        max_tokens: 2048,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    // Cache the response
    requestCache.set(cacheKey, data);
    
    // Clear old cache entries after 1 hour
    setTimeout(() => requestCache.delete(cacheKey), 3600000);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit specific section
router.post('/edit-section', async (req, res) => {
  try {
    const { userId, section, content, instruction } = req.body;
    
    // Check rate limit
    if (!checkRateLimit(userId)) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    // Check cache
    const cacheKey = generateCacheKey(userId, 'edit', { section, content, instruction });
    if (requestCache.has(cacheKey)) {
      return res.json(requestCache.get(cacheKey));
    }

    // Prepare prompt for Together AI
    const prompt = `Edit the following resume section based on the instruction:
    Section: ${section}
    Current Content: ${content}
    Instruction: ${instruction}
    Keep the formatting consistent and ensure content remains ATS-compliant.`;

    // Call Together AI API
    const response = await fetch('https://api.together.xyz/inference', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'togethercomputer/llama-3.3-70b-instruct',
        prompt,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    // Cache the response
    requestCache.set(cacheKey, data);
    
    // Clear old cache entries after 1 hour
    setTimeout(() => requestCache.delete(cacheKey), 3600000);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get keyword suggestions
router.post('/keywords', async (req, res) => {
  try {
    const { userId, jobDescription, section } = req.body;
    
    // Check rate limit
    if (!checkRateLimit(userId)) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    // Check cache
    const cacheKey = generateCacheKey(userId, 'keywords', { jobDescription, section });
    if (requestCache.has(cacheKey)) {
      return res.json(requestCache.get(cacheKey));
    }

    // Prepare prompt for Together AI
    const prompt = `Extract relevant keywords and phrases from the following job description for the ${section} section:
    ${jobDescription}
    Provide a list of ATS-friendly keywords and phrases.`;

    // Call Together AI API
    const response = await fetch('https://api.together.xyz/inference', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'togethercomputer/llama-3.3-70b-instruct',
        prompt,
        max_tokens: 512,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    // Cache the response
    requestCache.set(cacheKey, data);
    
    // Clear old cache entries after 1 hour
    setTimeout(() => requestCache.delete(cacheKey), 3600000);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 