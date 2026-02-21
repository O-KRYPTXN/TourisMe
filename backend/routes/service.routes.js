import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesByType,
  getMyServices,
  getTopRatedServices
} from '../controllers/serviceController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/top-rated', getTopRatedServices);
router.get('/type/:serviceType', getServicesByType);
router.get('/:id', getServiceById);

// Protected routes - Owner's services
router.get('/owner/my-services', protect, authorizeRoles('LocalBusinessOwner'), getMyServices);

// Protected routes - Create, Update, Delete
router.post(
  '/', 
  protect, 
  authorizeRoles('LocalBusinessOwner', 'Admin'), 
  upload.array('images', 5), 
  createService
);

router.put(
  '/:id', 
  protect, 
  authorizeRoles('LocalBusinessOwner', 'Admin'), 
  upload.array('images', 5), 
  updateService
);

router.delete(
  '/:id', 
  protect, 
  authorizeRoles('LocalBusinessOwner', 'Admin'), 
  deleteService
);

export default router;