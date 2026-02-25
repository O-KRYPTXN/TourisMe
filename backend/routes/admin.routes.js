import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSystemStats
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorizeRoles('Admin'));

// Dashboard analytics
router.get('/dashboard', getDashboardStats);
router.get('/stats', getSystemStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;