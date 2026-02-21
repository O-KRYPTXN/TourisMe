import express from 'express';
import {
  getAttractions,
  getAttractionById,
  createAttraction,
  updateAttraction,
  deleteAttraction,
  getAttractionsByCategory,
  getNearbyAttractions,
  getTopRatedAttractions,
  getCategories
} from '../controllers/attractionController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';   

const router = express.Router();

// Public routes
router.get('/', getAttractions);
router.get('/categories', getCategories);
router.get('/nearby', getNearbyAttractions);
router.get('/top-rated', getTopRatedAttractions);
router.get('/category/:category', getAttractionsByCategory);
router.get('/:id', getAttractionById);

// Protected routes (Admin only)
router.post('/', protect, authorizeRoles('Admin'), upload.array('images', 5),createAttraction); // 'images' must match the key in the frontend FormData
router.put('/:id', protect, authorizeRoles('Admin'), updateAttraction);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteAttraction);

export default router;