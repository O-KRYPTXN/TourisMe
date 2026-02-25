import Booking from '../models/booking.model.js';
import { Service } from '../models/service.model.js';
import { notificationTemplates , createNotification} from '../utils/notificationHelper.js';


// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Tourist only)
export const createBooking = async (req, res) => {
  try {
    const { serviceId, serviceDate, numberOfPeople, specialRequests } = req.body;

    // Validation
    if (!serviceId || !serviceDate) {
      return res.status(400).json({ 
        message: 'Service ID and service date are required' 
      });
    }

    // Verify the service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if service date is in the future
    const bookingDate = new Date(serviceDate);
    if (bookingDate < new Date()) {
      return res.status(400).json({ message: 'Cannot book a date in the past' });
    }

    // Calculate total price (base price * number of people)
    const people = numberOfPeople || 1;
    const totalPrice = service.price * people;

    // Create the booking
    const booking = await Booking.create({
      touristId: req.user._id,
      serviceId,
      serviceDate: bookingDate,
      totalPrice,
      numberOfPeople: people,
      specialRequests,
      status: 'Pending'
    });

    // Populate service details for response
    await booking.populate('serviceId', 'name serviceType price images');

     //  Notify business owner about new booking
    const owner = await User.findById(service.ownerId);
    
    await createNotification({
      userId: owner._id,
      type: 'booking_confirmed',
      title: 'New Booking Received',
      message: `You have a new booking for ${service.name}`,
      relatedId: booking._id,
      relatedModel: 'Booking',
      actionUrl: `/bookings/${booking._id}`,
      priority: 'high',
      sendEmailNotification: true,
      emailData: {
        to: owner.email,
        subject: 'New Booking Received - TourisMe Luxor',
        html: `
          <h1>New Booking!</h1>
          <p>Service: ${service.name}</p>
          <p>Date: ${new Date(booking.serviceDate).toLocaleDateString()}</p>
          <p>Revenue: $${booking.totalPrice}</p>
        `
      }
    });
    // end notification


    res.status(201).json({ 
      message: 'Booking created successfully', 
      booking 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking', error: error.message });
  }
};

// @desc    Get bookings based on user role
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, startDate, endDate } = req.query;
    let query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      query.serviceDate = {};
      if (startDate) query.serviceDate.$gte = new Date(startDate);
      if (endDate) query.serviceDate.$lte = new Date(endDate);
    }

    // Role-based filtering
    if (req.user.role === 'Tourist') {
      query.touristId = req.user._id;
    } 
    else if (req.user.role === 'LocalBusinessOwner') {
      // Find all services owned by this user
      const ownerServices = await Service.find({ ownerId: req.user._id }).select('_id');
      const serviceIds = ownerServices.map(service => service._id);
      
      if (serviceIds.length === 0) {
        return res.status(200).json({
          bookings: [],
          currentPage: parseInt(page),
          totalPages: 0,
          totalBookings: 0
        });
      }
      
      query.serviceId = { $in: serviceIds };
    }
    // Admins see everything (query remains as is)

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('serviceId', 'name serviceType images price')
      .populate('touristId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      bookings,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalBookings: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId')
      .populate('touristId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Security check: Ensure the user is authorized to view this booking
    if (req.user.role === 'Tourist' && booking.touristId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    if (req.user.role === 'LocalBusinessOwner') {
      const service = await Service.findById(booking.serviceId._id);
      if (!service || service.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this booking' });
      }
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

// @desc    Update booking status (Confirm / Cancel / Complete)
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Confirmed', 'Cancelled', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Confirmed, Cancelled, or Completed' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Tourist Restrictions: Can only CANCEL their own bookings
    if (req.user.role === 'Tourist') {
      if (booking.touristId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      if (status !== 'Cancelled') {
        return res.status(403).json({ message: 'Tourists can only cancel bookings' });
      }
      if (booking.status === 'Completed') {
        return res.status(400).json({ message: 'Cannot cancel a completed booking' });
      }
    }

    // Owner Restrictions: Can confirm/cancel/complete bookings for their services
    if (req.user.role === 'LocalBusinessOwner') {
      const service = await Service.findById(booking.serviceId);
      if (!service || service.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    // Apply update
    booking.status = status;
    await booking.save();

    await booking.populate('serviceId', 'name serviceType');
    await booking.populate('touristId', 'name email');


     //  Send notification based on status
    const tourist = await User.findById(booking.touristId);

    if (status === 'Confirmed') {
      await notificationTemplates.bookingConfirmed(booking, tourist);
    } else if (status === 'Cancelled') {
      await notificationTemplates.bookingCancelled(booking, tourist);
    } else if (status === 'Completed') {
      // Notify tourist that service is completed
      await createNotification({
        userId: tourist._id,
        type: 'booking_confirmed',
        title: 'Booking Completed',
        message: `Your booking for ${booking.serviceId.name} is now complete! Please leave a review.`,
        relatedId: booking._id,
        relatedModel: 'Booking',
        actionUrl: `/bookings/${booking._id}`,
        priority: 'medium'
      });
    }
      // end notifications

    res.status(200).json({ 
      message: `Booking ${status.toLowerCase()} successfully`, 
      booking 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating booking', error: error.message });
  }
};

// @desc    Update booking details (date, people, requests)
// @route   PUT /api/bookings/:id
// @access  Private (Tourist only, before confirmation)
export const updateBooking = async (req, res) => {
  try {
    const { serviceDate, numberOfPeople, specialRequests } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only tourist who created the booking can update
    if (booking.touristId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Cannot update confirmed or completed bookings
    if (['Confirmed', 'Completed'].includes(booking.status)) {
      return res.status(400).json({ 
        message: 'Cannot update a confirmed or completed booking. Please cancel and create a new one.' 
      });
    }

    // Update fields
    if (serviceDate) {
      const newDate = new Date(serviceDate);
      if (newDate < new Date()) {
        return res.status(400).json({ message: 'Cannot book a date in the past' });
      }
      booking.serviceDate = newDate;
    }

    if (numberOfPeople) {
      booking.numberOfPeople = numberOfPeople;
      // Recalculate total price
      const service = await Service.findById(booking.serviceId);
      booking.totalPrice = service.price * numberOfPeople;
    }

    if (specialRequests !== undefined) {
      booking.specialRequests = specialRequests;
    }

    await booking.save();
    await booking.populate('serviceId', 'name serviceType price');

    res.status(200).json({ 
      message: 'Booking updated successfully', 
      booking 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating booking', error: error.message });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private (Tourist who created it, or Admin)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only tourist who created or admin can delete
    if (req.user.role === 'Tourist' && booking.touristId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'LocalBusinessOwner') {
      return res.status(403).json({ message: 'Business owners cannot delete bookings. Use cancel instead.' });
    }

    await booking.deleteOne();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};

// @desc    Get booking statistics for business owner
// @route   GET /api/bookings/stats/overview
// @access  Private (LocalBusinessOwner, Admin)
export const getBookingStats = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'LocalBusinessOwner') {
      const ownerServices = await Service.find({ ownerId: req.user._id }).select('_id');
      const serviceIds = ownerServices.map(service => service._id);
      query.serviceId = { $in: serviceIds };
    }

    const stats = await Booking.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments(query);
    const totalRevenue = await Booking.aggregate([
      { $match: { ...query, status: { $in: ['Confirmed', 'Completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.status(200).json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      byStatus: stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking stats', error: error.message });
  }
};