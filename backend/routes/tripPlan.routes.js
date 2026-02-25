import express from 'express';
import {
  createTripPlan,
  getUserTripPlans,
  getTripPlanById,
  updateTripPlan,
  addItineraryItem,
  updateItineraryItem,
  removeItineraryItem,
  reorderItinerary,
  exportTripPlan,
  confirmTripPlan,
  deleteTripPlan,
  getTripStats
} from '../controllers/tripPlanController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require Tourist authentication
router.use(protect);
router.use(authorizeRoles('Tourist'));

// Trip plan CRUD
router.get('/', getUserTripPlans);
router.post('/', createTripPlan);
router.get('/stats', getTripStats);
router.get('/:id', getTripPlanById);
router.put('/:id', updateTripPlan);
router.delete('/:id', deleteTripPlan);

// Trip actions
router.put('/:id/confirm', confirmTripPlan);
router.get('/:id/export', exportTripPlan);

// Itinerary management
router.post('/:id/items', addItineraryItem);
router.put('/:id/items/:itemId', updateItineraryItem);
router.delete('/:id/items/:itemId', removeItineraryItem);
router.put('/:id/reorder', reorderItinerary);

export default router;