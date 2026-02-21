import Attraction from '../models/attraction.model.js';

// @desc    Get all attractions (with filtering, pagination, and search)
// @route   GET /api/attractions
// @access  Public
export const getAttractions = async (req, res) => {
  try {
    const { 
      category, 
      maxPrice, 
      minPrice,
      lng, 
      lat, 
      maxDistance,
      search,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    let query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (maxPrice || minPrice) {
      query.ticketPrice = {};
      if (maxPrice) query.ticketPrice.$lte = Number(maxPrice);
      if (minPrice) query.ticketPrice.$gte = Number(minPrice);
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Location-based filter (near coordinates)
    if (lng && lat && maxDistance) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance) * 1000 // Convert km to meters
        }
      };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const attractions = await Attraction.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attraction.countDocuments(query);

    res.status(200).json({
      attractions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalAttractions: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attractions', error: error.message });
  }
};

// @desc    Get single attraction by ID
// @route   GET /api/attractions/:id
// @access  Public
export const getAttractionById = async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);
    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }
    res.status(200).json(attraction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attraction', error: error.message });
  }
};

// @desc    Create a new attraction
// @route   POST /api/attractions
// @access  Private/Admin
export const createAttraction = async (req, res) => {
  try {
    const { name, description, category, ticketPrice, openingHours, lng, lat } = req.body;

    // Validation
    if (!name || !lng || !lat) {
      return res.status(400).json({ message: 'Name, longitude, and latitude are required' });
    }

    // Get image URLs from Cloudinary uploads
    const images = req.files ? req.files.map(file => file.path) : [];

    const newAttraction = await Attraction.create({
      name,
      description,
      category,
      ticketPrice,
      openingHours,
      images,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    });

    res.status(201).json({ 
      message: 'Attraction created successfully', 
      attraction: newAttraction 
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Update an attraction
// @route   PUT /api/attractions/:id
// @access  Private/Admin
export const updateAttraction = async (req, res) => {
  try {
    // If location is being updated, format it for GeoJSON
    if (req.body.lng && req.body.lat) {
      req.body.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
      };
      // Remove lng and lat from body to avoid saving them as separate fields
      delete req.body.lng;
      delete req.body.lat;
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      // Append new images to existing ones or replace them
      const existingAttraction = await Attraction.findById(req.params.id);
      req.body.images = [...(existingAttraction?.images || []), ...newImages];
    }

    const attraction = await Attraction.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true, // Return the updated document
        runValidators: true // Ensure schema rules are followed
      }
    );

    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }

    res.status(200).json({ 
      message: 'Attraction updated successfully', 
      attraction 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating attraction', error: error.message });
  }
};

// @desc    Delete an attraction
// @route   DELETE /api/attractions/:id
// @access  Private/Admin
export const deleteAttraction = async (req, res) => {
  try {
    const attraction = await Attraction.findByIdAndDelete(req.params.id);
    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }

    res.status(200).json({ message: 'Attraction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting attraction', error: error.message });
  }
};

// @desc    Get attractions by category
// @route   GET /api/attractions/category/:category
// @access  Public
export const getAttractionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const attractions = await Attraction.find({ category })
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-averageRating');

    const total = await Attraction.countDocuments({ category });

    res.status(200).json({
      attractions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalAttractions: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attractions by category', error: error.message });
  }
};

// @desc    Get nearby attractions
// @route   GET /api/attractions/nearby
// @access  Public
export const getNearbyAttractions = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 10 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const attractions = await Attraction.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance) * 1000 // Convert km to meters
        }
      }
    }).limit(20);

    res.status(200).json(attractions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nearby attractions', error: error.message });
  }
};

// @desc    Get top-rated attractions
// @route   GET /api/attractions/top-rated
// @access  Public
export const getTopRatedAttractions = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const attractions = await Attraction.find({ averageRating: { $gt: 0 } })
      .sort('-averageRating')
      .limit(parseInt(limit));

    res.status(200).json(attractions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top-rated attractions', error: error.message });
  }
};

// @desc    Get all unique categories
// @route   GET /api/attractions/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Attraction.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};