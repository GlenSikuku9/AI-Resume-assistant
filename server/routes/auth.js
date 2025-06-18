import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../controllers/authController.js';

const router = express.Router();

// Get user profile
router.get('/profile', verifyToken, getProfile);

// Update user profile
router.put('/profile', verifyToken, updateProfile);

export default router; 