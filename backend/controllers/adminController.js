import { User, Tourist, LocalBusinessOwner } from '../models/user.model.js';
import { Service } from '../models/service.model.js';
import Booking from '../models/booking.model.js';
import TripPlan from '../models/tripPlans.model.js';
import Advertisement from '../models/ads.model.js';
import Attraction from '../models/attraction.model.js';
import Review from '../models/reviews.model.js';

// @desc    Get comprehensive admin dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Date filter for time-based analytics
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Run all queries concurrently for maximum speed
    const [
      userStats,
      revenueStats,
      topServices,
      topAttractions,
      adStats,
      bookingStats,
      recentActivity
    ] = await Promise.all([
      
      // 1. User Statistics by Role
      User.aggregate([
        { $group: { 
            _id: '$role', 
            count: { $sum: 1 } 
        }}
      ]),

      // 2. Revenue Statistics
      Booking.aggregate([
        { $match: { status: { $in: ['Confirmed', 'Completed'] }, ...dateFilter } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            totalBookings: { $sum: 1 },
            averageBookingValue: { $avg: '$totalPrice' }
          }
        }
      ]),

      // 3. Top Booked Services (with revenue)
      Booking.aggregate([
        { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
        { 
          $group: { 
            _id: '$serviceId', 
            totalBookings: { $sum: 1 },
            totalRevenue: { $sum: '$totalPrice' }
          }
        },
        { $sort: { totalBookings: -1 } },
        { $limit: 5 },
        { 
          $lookup: { 
            from: 'services',
            localField: '_id', 
            foreignField: '_id', 
            as: 'serviceDetails' 
          }
        },
        { $unwind: '$serviceDetails' },
        { 
          $project: { 
            name: '$serviceDetails.name', 
            type: '$serviceDetails.serviceType', 
            totalBookings: 1, 
            totalRevenue: 1,
            averageRating: '$serviceDetails.averageRating'
          }
        }
      ]),

      // 4. Most Planned Attractions
      TripPlan.aggregate([
        { $unwind: '$itineraryItems' },
        { $group: { 
            _id: '$itineraryItems.attractionId', 
            timesPlanned: { $sum: 1 } 
        }},
        { $sort: { timesPlanned: -1 } },
        { $limit: 5 },
        { 
          $lookup: { 
            from: 'attractions', 
            localField: '_id', 
            foreignField: '_id', 
            as: 'attractionDetails' 
          }
        },
        { $unwind: '$attractionDetails' },
        { 
          $project: { 
            name: '$attractionDetails.name', 
            category: '$attractionDetails.category',
            timesPlanned: 1,
            averageRating: '$attractionDetails.averageRating'
          }
        }
      ]),

      // 5. Advertisement Statistics
      Advertisement.aggregate([
        { 
          $group: { 
            _id: '$approvalStatus', 
            count: { $sum: 1 },
            totalImpressions: { $sum: '$impressionCount' },
            totalClicks: { $sum: '$clickCount' }
          } 
        }
      ]),

      // 6. Booking Statistics by Status
      Booking.aggregate([
        { 
          $group: { 
            _id: '$status', 
            count: { $sum: 1 },
            revenue: { $sum: '$totalPrice' }
          } 
        }
      ]),

      // 7. Recent Activity (last 10 actions)
      Promise.all([
        User.find(dateFilter).sort({ createdAt: -1 }).limit(5).select('name role createdAt'),
        Booking.find(dateFilter).sort({ createdAt: -1 }).limit(5)
          .populate('touristId', 'name')
          .populate('serviceId', 'name'),
        Review.find(dateFilter).sort({ createdAt: -1 }).limit(5)
          .populate('touristId', 'name')
      ])
    ]);

    // Calculate growth metrics (compare with previous period)
    const growthMetrics = await calculateGrowthMetrics(startDate, endDate);

    // Format response
    res.status(200).json({
      overview: {
        totalUsers: userStats.reduce((sum, stat) => sum + stat.count, 0),
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        totalBookings: revenueStats[0]?.totalBookings || 0,
        averageBookingValue: revenueStats[0]?.averageBookingValue || 0
      },
      usersByRole: userStats,
      revenue: revenueStats[0] || {},
      topServices,
      topAttractions,
      advertisements: adStats,
      bookings: bookingStats,
      recentActivity: {
        newUsers: recentActivity[0],
        recentBookings: recentActivity[1],
        recentReviews: recentActivity[2]
      },
      growth: growthMetrics
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error loading dashboard analytics', 
      error: error.message 
    });
  }
};

// Helper function to calculate growth metrics
const calculateGrowthMetrics = async (startDate, endDate) => {
  if (!startDate || !endDate) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = end - start;

  // Calculate previous period
  const prevStart = new Date(start.getTime() - duration);
  const prevEnd = start;

  const [currentPeriod, previousPeriod] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
    User.countDocuments({ createdAt: { $gte: prevStart, $lte: prevEnd } })
  ]);

  const growth = previousPeriod > 0 
    ? (((currentPeriod - previousPeriod) / previousPeriod) * 100).toFixed(2)
    : 0;

  return {
    currentPeriod,
    previousPeriod,
    growthPercentage: parseFloat(growth)
  };
};

// @desc    Get paginated list of all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-passwordHash')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalUsers: total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
};

// @desc    Get single user details
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's activity
    const [bookings, reviews, services, tripPlans] = await Promise.all([
      user.role === 'Tourist' ? Booking.find({ touristId: user._id }).limit(10) : [],
      user.role === 'Tourist' ? Review.find({ touristId: user._id }).limit(10) : [],
      user.role === 'LocalBusinessOwner' ? Service.find({ ownerId: user._id }) : [],
      user.role === 'Tourist' ? TripPlan.find({ touristId: user._id }).limit(5) : []
    ]);

    res.status(200).json({
      user,
      activity: {
        bookings,
        reviews,
        services,
        tripPlans
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user details', 
      error: error.message 
    });
  }
};

// @desc    Update user (e.g., change role, verify business)
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { role, isVerified } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (role) user.role = role;
    if (user.role === 'LocalBusinessOwner' && isVerified !== undefined) {
      user.isVerified = isVerified;
    }

    await user.save();

    res.status(200).json({ 
      message: 'User updated successfully', 
      user 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating user', 
      error: error.message 
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting other admins
    if (user.role === 'Admin') {
      return res.status(403).json({ 
        message: 'Cannot delete admin users' 
      });
    }

    await user.deleteOne();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting user', 
      error: error.message 
    });
  }
};

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getSystemStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAttractions,
      totalServices,
      totalBookings,
      totalReviews,
      totalAds
    ] = await Promise.all([
      User.countDocuments(),
      Attraction.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments(),
      Review.countDocuments(),
      Advertisement.countDocuments()
    ]);

    res.status(200).json({
      totalUsers,
      totalAttractions,
      totalServices,
      totalBookings,
      totalReviews,
      totalAds
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching system stats', 
      error: error.message 
    });
  }
};