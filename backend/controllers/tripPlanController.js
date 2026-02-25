import TripPlan from '../models/tripPlans.model.js';
import Attraction from '../models/attraction.model.js';
import { createNotification } from '../utils/notificationHelper.js';

// @desc    Create a new trip plan
// @route   POST /api/trips
// @access  Private (Tourist)
export const createTripPlan = async (req, res) => {
  try {
    const { title, startDate, endDate, budget, intensityLevel } = req.body;

    // Validation
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const trip = await TripPlan.create({
      touristId: req.user._id,
      title: title || 'My Luxor Adventure',
      startDate,
      endDate,
      budget,
      intensityLevel,
      itineraryItems: []
    });

    res.status(201).json({ 
      message: 'Trip plan created successfully', 
      trip 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating trip plan', 
      error: error.message 
    });
  }
};

// @desc    Get all trip plans for the logged-in user
// @route   GET /api/trips
// @access  Private (Tourist)
export const getUserTripPlans = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { touristId: req.user._id };

    if (status) {
      query.status = status;
    }

    const trips = await TripPlan.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching trip plans', 
      error: error.message 
    });
  }
};

// @desc    Get a single trip plan with populated attractions
// @route   GET /api/trips/:id
// @access  Private (Tourist)
export const getTripPlanById = async (req, res) => {
  try {
    const trip = await TripPlan.findById(req.params.id)
      .populate('itineraryItems.attractionId', 'name category images ticketPrice location openingHours averageRating');

    if (!trip) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    // Security: Only the owner can view it
    if (trip.touristId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this trip' });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching trip plan', 
      error: error.message 
    });
  }
};

// @desc    Update trip plan details
// @route   PUT /api/trips/:id
// @access  Private (Tourist)
export const updateTripPlan = async (req, res) => {
  try {
    let trip = await TripPlan.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    if (trip.touristId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Validate dates if updating
    if (req.body.startDate && req.body.endDate) {
      if (new Date(req.body.startDate) > new Date(req.body.endDate)) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }
    }

    trip = await TripPlan.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({ 
      message: 'Trip plan updated successfully', 
      trip 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating trip plan', 
      error: error.message 
    });
  }
};

// @desc    Add attraction to itinerary (FR-T4)
// @route   POST /api/trips/:id/items
// @access  Private (Tourist)
export const addItineraryItem = async (req, res) => {
  try {
    const { attractionId, dayNumber, scheduledTime, notes } = req.body;

    // Validate attraction exists
    const attraction = await Attraction.findById(attractionId);
    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }

    const trip = await TripPlan.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    if (trip.touristId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if attraction already in itinerary
    const alreadyAdded = trip.itineraryItems.some(
      item => item.attractionId.toString() === attractionId
    );

    if (alreadyAdded) {
      return res.status(400).json({ 
        message: 'Attraction already in itinerary' 
      });
    }

    // Add to itinerary
    trip.itineraryItems.push({
      attractionId,
      dayNumber,
      scheduledTime,
      notes
    });

    await trip.save();

    // Populate the newly added attraction
    await trip.populate('itineraryItems.attractionId', 'name category images ticketPrice location');

    res.status(200).json({ 
      message: 'Attraction added to itinerary', 
      trip 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error adding item to itinerary', 
      error: error.message 
    });
  }
};

// @desc    Update itinerary item
// @route   PUT /api/trips/:id/items/:itemId
// @access  Private (Tourist)
export const updateItineraryItem = async (req, res) => {
  try {
    const { dayNumber, scheduledTime, notes } = req.body;

    const trip = await TripPlan.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    if (trip.touristId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find and update the specific item
    const item = trip.itineraryItems.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Itinerary item not found' });
    }

    if (dayNumber !== undefined) item.dayNumber = dayNumber;
    if (scheduledTime !== undefined) item.scheduledTime = scheduledTime;
    if (notes !== undefined) item.notes = notes;

    await trip.save();

    res.status(200).json({ 
      message: 'Itinerary item updated', 
      trip 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating itinerary item', 
      error: error.message 
    });
  }
};

// @desc    Remove attraction from itinerary (FR-T4)
// @route   DELETE /api/trips/:id/items/:itemId
// @access  Private (Tourist)
export const removeItineraryItem = async (req, res) => {
  try {
    const trip = await TripPlan.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    if (trip.touristId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Remove the item
    trip.itineraryItems = trip.itineraryItems.filter(
      item => item._id.toString() !== req.params.itemId
    );

    await trip.save();

    res.status(200).json({ 
      message: 'Attraction removed from itinerary', 
      trip 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error removing item from itinerary', 
      error: error.message 
    });
  }
};

// @desc    Reorder itinerary items
// @route   PUT /api/trips/:id/reorder
// @access  Private (Tourist)
export const reorderItinerary = async (req, res) => {
  try {
    const { orderedItemIds } = req.body; // Array of item IDs in new order

    const trip = await TripPlan.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    if (trip.touristId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Reorder items based on provided array
    const reorderedItems = orderedItemIds.map(id => 
      trip.itineraryItems.find(item => item._id.toString() === id)
    ).filter(Boolean);

    trip.itineraryItems = reorderedItems;
    await trip.save();

    res.status(200).json({ 
      message: 'Itinerary reordered', 
      trip 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error reordering itinerary', 
      error: error.message 
    });
  }
};

// @desc    Export trip plan for offline use (FR-T8)
// @route   GET /api/trips/:id/export
// @access  Private (Tourist)
export const exportTripPlan = async (req, res) => {
  try {
    const trip = await TripPlan.findById(req.params.id)
      .populate('itineraryItems.attractionId', 'name description category ticketPrice openingHours images location averageRating');

    if (!trip) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    if (trip.touristId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Add cache headers for offline use
    res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error exporting trip plan', 
      error: error.message 
    });
  }
};

// @desc    Mark trip as confirmed
// @route   PUT /api/trips/:id/confirm
// @access  Private (Tourist)
export const confirmTripPlan = async (req, res) => {
  try {
    const trip = await TripPlan.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    if (trip.touristId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    trip.status = 'Confirmed';
    await trip.save();

    // Send reminder notification (optional)
    if (trip.startDate) {
      const daysUntilTrip = Math.ceil((new Date(trip.startDate) - new Date()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilTrip <= 7 && daysUntilTrip > 0) {
        await createNotification({
          userId: req.user._id,
          type: 'trip_reminder',
          title: 'Trip Starting Soon!',
          message: `Your trip "${trip.title}" starts in ${daysUntilTrip} days!`,
          relatedId: trip._id,
          actionUrl: `/trips/${trip._id}`,
          priority: 'high',
          sendEmailNotification: false
        });
      }
    }

    res.status(200).json({ 
      message: 'Trip plan confirmed', 
      trip 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error confirming trip plan', 
      error: error.message 
    });
  }
};

// @desc    Delete trip plan
// @route   DELETE /api/trips/:id
// @access  Private (Tourist)
export const deleteTripPlan = async (req, res) => {
  try {
    const trip = await TripPlan.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    if (trip.touristId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await trip.deleteOne();
    
    res.status(200).json({ message: 'Trip plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting trip plan', 
      error: error.message 
    });
  }
};

// @desc    Get trip statistics
// @route   GET /api/trips/stats
// @access  Private (Tourist)
export const getTripStats = async (req, res) => {
  try {
    const trips = await TripPlan.find({ touristId: req.user._id });

    const stats = {
      totalTrips: trips.length,
      draftTrips: trips.filter(t => t.status === 'Draft').length,
      confirmedTrips: trips.filter(t => t.status === 'Confirmed').length,
      completedTrips: trips.filter(t => t.status === 'Completed').length,
      totalAttractions: trips.reduce((sum, t) => sum + t.itineraryItems.length, 0),
      totalBudget: trips.reduce((sum, t) => sum + (t.budget || 0), 0)
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching trip statistics', 
      error: error.message 
    });
  }
};