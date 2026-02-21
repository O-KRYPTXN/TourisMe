import express from 'express';
import { registerTourist, registerOwner , login , logout, getProfile} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

// Tourist Routes
router.post('/signup/tourist', registerTourist);

// Business Owner Routes
router.post('/signup/owner', registerOwner);

// Login Route
router.post('/login', login);

// Protected routes (authentication required)
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);

export default router;
