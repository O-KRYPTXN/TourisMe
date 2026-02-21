import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  addFavorite,
  removeFavorite,
  getFavorites,
  deleteAccount
} from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.delete('/profile', deleteAccount);

// Password route
router.put('/password', changePassword);

// Favorites routes (Tourist only)
router.get('/favorites', authorizeRoles('Tourist'), getFavorites);
router.post('/favorites/:attractionId', authorizeRoles('Tourist'), addFavorite);
router.delete('/favorites/:attractionId', authorizeRoles('Tourist'), removeFavorite);


export default router;