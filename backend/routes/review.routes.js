import express from 'express';
import {
  createReview,
  getReviewsByTarget,
  getMyReviews,
  updateReview,
  deleteReview,
  checkUserReview
} from '../controllers/reviewController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/target/:targetId', getReviewsByTarget);

// Protected routes (require authentication)
router.use(protect);

// Tourist-only routes
router.post('/', authorizeRoles('Tourist'), createReview);
router.get('/my-reviews', authorizeRoles('Tourist'), getMyReviews);
router.get('/check/:targetId', checkUserReview);

// Review owner or admin routes
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;