import { admin } from '../config/firebase.js';
import Together from 'together-ai';

export const generateCacheKey = (userId, action, params) => {
  return `${userId}_${action}_${JSON.stringify(params)}`;
};

export const cacheResponse = (key, data) => {
  // Implementation for caching response
};

export const getCachedResponse = (key) => {
  // Implementation for getting cached response
  return null;
};

export const callTogetherAI = async (prompt, maxTokens) => {
  // Use the Together AI SDK
  const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

  const response = await together.chat.completions.create({
    messages: [
      { role: 'system', content: `You are a helpful assistant that generates professional, ATS-compliant resumes. Return ONLY the resume as valid HTML, with proper formatting as per the template. Do NOT include any explanations, leading words, or extra text—just the HTML resume content. Always follow these key characteristics for ATS compliance: Optimize for relevant keywords from the job description, use strong action verbs and success metrics, prioritize quality experience over quantity, use a clean, simple format with standard section headings, avoid graphics, tables, or unusual formatting, and focus on good formatting and clarity.` },
      { role: 'user', content: prompt }
    ],
    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
    max_tokens: maxTokens,
    stream: true
  });

  let result = '';
  for await (const token of response) {
    result += token.choices[0]?.delta?.content || '';
  }
  return result;
};

export const checkRateLimit = (userId) => {
  // Implementation for checking rate limit
}; 