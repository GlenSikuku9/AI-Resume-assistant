import { checkRateLimit } from '../utils/aiHelpers.js';

export const rateLimitMiddleware = (req, res, next) => {
  const userId = req.body.userId;
  
  if (!checkRateLimit(userId)) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  
  next();
}; 