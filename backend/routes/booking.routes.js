import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
  getBookingStats
} from '../controllers/bookingController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Booking statistics (Owner/Admin only)
router.get('/stats/overview', authorizeRoles('LocalBusinessOwner', 'Admin'), getBookingStats);

// Get all bookings (filtered by role)
router.get('/', getBookings);

// Create booking (Tourist only)
router.post('/', authorizeRoles('Tourist'), createBooking);

// Get single booking
router.get('/:id', getBookingById);

// Update booking details (Tourist only, before confirmation)
router.put('/:id', authorizeRoles('Tourist'), updateBooking);

// Update booking status (Owner/Admin can confirm, Tourist can cancel)
router.put('/:id/status', updateBookingStatus);

// Delete booking (Tourist/Admin only)
router.delete('/:id', authorizeRoles('Tourist', 'Admin'), deleteBooking);

export default router;