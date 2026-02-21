import { Service, Restaurant, Rental, TourPackage } from '../models/service.model.js';

// @desc    Get all services (with filtering, search, and pagination)
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const { 
      serviceType, 
      ownerId, 
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    let query = {};

    // Filter by type (Restaurant, Rental, TourPackage)
    if (serviceType) query.serviceType = serviceType;
    
    // Filter by specific business owner
    if (ownerId) query.ownerId = ownerId;

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const services = await Service.find(query)
      .populate('ownerId', 'name companyName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(query);

    res.status(200).json({
      services,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalServices: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('ownerId', 'name companyName email phone');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (LocalBusinessOwner, Admin)
export const createService = async (req, res) => {
  try {
    const { serviceType, name, description, price } = req.body;

    // Validation
    if (!serviceType || !name || !price) {
      return res.status(400).json({ 
        message: 'Service type, name, and price are required' 
      });
    }

    // Validate serviceType
    if (!['Restaurant', 'Rental', 'TourPackage'].includes(serviceType)) {
      return res.status(400).json({ 
        message: 'Invalid service type. Must be Restaurant, Rental, or TourPackage' 
      });
    }

    // Extract uploaded images from Multer/Cloudinary
    const images = req.files ? req.files.map(file => file.path) : [];

    // Build the service data payload
    const serviceData = {
      ...req.body,
      ownerId: req.user._id, // Assign the logged-in user as the owner
      images
    };

    // Mongoose discriminators automatically create the correct type
    const newService = await Service.create(serviceData);

    res.status(201).json({ 
      message: 'Service created successfully', 
      service: newService 
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid service data', error: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Service Owner, Admin)
export const updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // SECURITY CHECK: Ensure the requester is the owner OR an Admin
    if (service.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      // Append new images to existing ones
      req.body.images = [...(service.images || []), ...newImages];
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('ownerId', 'name companyName');

    res.status(200).json({ 
      message: 'Service updated successfully', 
      service 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating service', error: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Service Owner, Admin)
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // SECURITY CHECK: Ensure the requester is the owner OR an Admin
    if (service.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    await service.deleteOne();
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};

// @desc    Get services by type (Restaurants, Rentals, Tour Packages)
// @route   GET /api/services/type/:serviceType
// @access  Public
export const getServicesByType = async (req, res) => {
  try {
    const { serviceType } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!['Restaurant', 'Rental', 'TourPackage'].includes(serviceType)) {
      return res.status(400).json({ message: 'Invalid service type' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const services = await Service.find({ serviceType })
      .populate('ownerId', 'name companyName')
      .sort('-averageRating')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments({ serviceType });

    res.status(200).json({
      services,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalServices: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services by type', error: error.message });
  }
};

// @desc    Get services by owner
// @route   GET /api/services/owner/my-services
// @access  Private (LocalBusinessOwner)
export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ ownerId: req.user._id })
      .sort('-createdAt');

    res.status(200).json({ services });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your services', error: error.message });
  }
};

// @desc    Get top-rated services
// @route   GET /api/services/top-rated
// @access  Public
export const getTopRatedServices = async (req, res) => {
  try {
    const { serviceType, limit = 10 } = req.query;
    let query = { averageRating: { $gt: 0 } };

    if (serviceType) query.serviceType = serviceType;

    const services = await Service.find(query)
      .populate('ownerId', 'name companyName')
      .sort('-averageRating')
      .limit(parseInt(limit));

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top-rated services', error: error.message });
  }
};