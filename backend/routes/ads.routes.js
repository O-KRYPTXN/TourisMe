import express from 'express';
import {
  createAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  updateAdStatus,
  deleteAdvertisement,
  trackImpression,
  trackClick,
  validatePromoCode,
  getMyAdStats
} from '../controllers/adsController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAdvertisements); // Public sees only approved ads
router.post('/validate-promo', validatePromoCode);
router.post('/:id/impression', trackImpression);
router.post('/:id/click', trackClick);

// Protected routes
router.use(protect);

// Owner routes
router.post(
  '/',
  authorizeRoles('LocalBusinessOwner'),
  upload.single('banner'), // Single banner image
  createAdvertisement
);

router.get(
  '/stats/my-ads',
  authorizeRoles('LocalBusinessOwner'),
  getMyAdStats
);

router.put(
  '/:id',
  authorizeRoles('LocalBusinessOwner'),
  upload.single('banner'),
  updateAdvertisement
);

// Admin routes
router.put(
  '/:id/status',
  authorizeRoles('Admin'),
  updateAdStatus
);

// Shared routes (owner/admin)
router.get('/:id', getAdvertisementById);
router.delete('/:id', deleteAdvertisement);

export default router;