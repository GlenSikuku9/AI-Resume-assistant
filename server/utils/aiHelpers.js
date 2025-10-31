import { admin } from '../config/firebase.js';
import Together from 'together-ai';

// ===== In-Memory Cache (Simple & Fast) =====
const cache = new Map(); // key -> { data, expiry }
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes TTL

// ===== Rate Limiting =====
const userRateLimits = new Map(); // userId -> { count, lastReset }
const RATE_LIMIT_MAX = 15; // max 15 requests
const RATE_LIMIT_WINDOW = 1000 * 60 * 5; // per 5 minutes

export const generateCacheKey = (userId, action, params) => {
  return `${userId}_${action}_${JSON.stringify(params)}`;
};

// ===== Universal Sanitizer =====
// Removes <think>, <internal>, <debug> tags and their contents (multi-line safe)
const sanitizeAIResponse = (content) => {
  if (!content || typeof content !== 'string') return content;
  return content
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<internal>[\s\S]*?<\/internal>/gi, '')
    .replace(/<debug>[\s\S]*?<\/debug>/gi, '')
    .trim();
};

// ===== Cache Layer =====
export const cacheResponse = (key, data) => {
  const sanitizedData = typeof data === 'string' ? sanitizeAIResponse(data) : data;
  cache.set(key, { data: sanitizedData, expiry: Date.now() + CACHE_TTL });
};

export const getCachedResponse = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key); // auto-clean expired entries
    return null;
  }
  return entry.data;
};

// ===== Rate Limiting =====
export const checkRateLimit = (userId) => {
  const now = Date.now();
  const record = userRateLimits.get(userId);

  if (!record) {
    userRateLimits.set(userId, { count: 1, lastReset: now });
    return true;
  }

  // Reset window if expired
  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    userRateLimits.set(userId, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false; // Limit reached
  }

  record.count++;
  return true;
};

// ===== Together AI Integration =====
export const callTogetherAI = async (prompt, maxTokens, systemPrompt) => {
  const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

  const response = await together.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free', // ✅ Updated model
    max_tokens: maxTokens,
    stream: true
  });

  let result = '';
  for await (const token of response) {
    result += token.choices[0]?.delta?.content || '';
  }

  // 🧠 Sanitize output before returning
  return sanitizeAIResponse(result);
};
