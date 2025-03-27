import express from 'express';
import { authUser, registerUser, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', authUser);

// Get User Profile (Protected Route)
router.get('/profile', protect, getUserProfile);

// Update User Profile (Protected Route)
router.put('/profile', protect, updateUserProfile);

export default router;
