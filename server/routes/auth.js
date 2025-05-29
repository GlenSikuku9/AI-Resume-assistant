const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/authController');

// Get user profile
router.get('/profile', verifyToken, getProfile);

// Update user profile
router.put('/profile', verifyToken, updateProfile);

module.exports = router; 