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

export const callTogetherAI = async (prompt, maxTokens, systemPrompt) => {
  const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

  const response = await together.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
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