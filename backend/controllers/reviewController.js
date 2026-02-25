import Review from '../models/reviews.model.js';
import Attraction from '../models/attraction.model.js';
import { Service } from '../models/service.model.js';
import { createNotification, notificationTemplates } from '../utils/notificationHelper.js';
import { sendEmail, emailTemplates } from '../utils/sendEmail.js';

// Helper function to recalculate and update the average rating (FR-R4)
const updateAverageRating = async (targetId, targetModel) => {
  try {
    const result = await Review.aggregate([
      { $match: { targetId: targetId } },
      { 
        $group: { 
          _id: '$targetId', 
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        } 
      }
    ]);

    const newAvg = result.length > 0 ? parseFloat(result[0].averageRating.toFixed(1)) : 0;

    if (targetModel === 'Attraction') {
      await Attraction.findByIdAndUpdate(targetId, { averageRating: newAvg });
    } else if (targetModel === 'Service') {
      await Service.findByIdAndUpdate(targetId, { averageRating: newAvg });
    }

    return { averageRating: newAvg, totalReviews: result[0]?.totalReviews || 0 };
  } catch (error) {
    console.error('Error recalculating average rating:', error);
    throw error;
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (Tourist only)
export const createReview = async (req, res) => {
  try {
    const { targetId, targetModel, rating, comment } = req.body;

    // Validation
    if (!targetId || !targetModel || !rating) {
      return res.status(400).json({ 
        message: 'Target ID, target model, and rating are required' 
      });
    }

    if (!['Attraction', 'Service'].includes(targetModel)) {
      return res.status(400).json({ 
        message: 'Invalid target model. Must be Attraction or Service.' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Verify target exists
    const Model = targetModel === 'Attraction' ? Attraction : Service;
    const target = await Model.findById(targetId);
    if (!target) {
      return res.status(404).json({ 
        message: `${targetModel} not found` 
      });
    }

    // Prevent duplicate reviews from the same user (FR-R3)
    const existingReview = await Review.findOne({ 
      touristId: req.user._id, 
      targetId 
    });
    
    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this item. You can update your existing review instead.' 
      });
    }

    // Create the review
    const review = await Review.create({
      touristId: req.user._id,
      targetId,
      targetModel,
      rating,
      comment
    });

    // Populate tourist info
    await review.populate('touristId', 'name');

    // Update the average rating of the parent item (FR-R4)
    const stats = await updateAverageRating(targetId, targetModel);

    // ✅ ADD THIS: Notify owner about new review
    if (targetModel === 'Service') {
      const service = await Service.findById(targetId).populate('ownerId');
      const owner = await User.findById(service.ownerId);
      
      await notificationTemplates.newReview(review, owner, service);
    }
    // Note: For attractions, you might not have an owner, so skip notification

    res.status(201).json({ 
      message: 'Review added successfully', 
      review,
      stats
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'You have already reviewed this item.' 
      });
    }
    res.status(400).json({ message: 'Error creating review', error: error.message });
  }
};

// @desc    Get all reviews for a specific Attraction or Service
// @route   GET /api/reviews/target/:targetId
// @access  Public
export const getReviewsByTarget = async (req, res) => {
  try {
    const { page = 1, limit = 10, rating, sort = '-createdAt' } = req.query;
    let query = { targetId: req.params.targetId };

    // Filter by rating if provided
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(query)
      .populate('touristId', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    // Get rating statistics
    const stats = await Review.aggregate([
      { $match: { targetId: mongoose.Types.ObjectId(req.params.targetId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratings: {
            $push: '$rating'
          }
        }
      },
      {
        $project: {
          averageRating: 1,
          totalReviews: 1,
          ratingDistribution: {
            5: { $size: { $filter: { input: '$ratings', cond: { $eq: ['$$this', 5] } } } },
            4: { $size: { $filter: { input: '$ratings', cond: { $eq: ['$$this', 4] } } } },
            3: { $size: { $filter: { input: '$ratings', cond: { $eq: ['$$this', 3] } } } },
            2: { $size: { $filter: { input: '$ratings', cond: { $eq: ['$$this', 2] } } } },
            1: { $size: { $filter: { input: '$ratings', cond: { $eq: ['$$this', 1] } } } }
          }
        }
      }
    ]);

    res.status(200).json({
      reviews,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalReviews: total,
      stats: stats[0] || { averageRating: 0, totalReviews: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// @desc    Get user's own reviews
// @route   GET /api/reviews/my-reviews
// @access  Private (Tourist)
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ touristId: req.user._id })
      .populate('targetId')
      .sort('-createdAt');

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your reviews', error: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Review Owner)
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure the requester is the person who wrote the review
    if (review.touristId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    
    await review.save();

    // Recalculate average (FR-R4)
    const stats = await updateAverageRating(review.targetId, review.targetModel);

    await review.populate('touristId', 'name');

    res.status(200).json({ 
      message: 'Review updated successfully', 
      review,
      stats
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating review', error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Review Owner or Admin)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure the requester is the owner OR an Admin
    if (review.touristId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const targetId = review.targetId;
    const targetModel = review.targetModel;

    await review.deleteOne();

    // Recalculate average after deletion (FR-R4)
    const stats = await updateAverageRating(targetId, targetModel);

    res.status(200).json({ 
      message: 'Review deleted successfully',
      stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

// @desc    Check if user has reviewed a target
// @route   GET /api/reviews/check/:targetId
// @access  Private
export const checkUserReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      touristId: req.user._id,
      targetId: req.params.targetId
    });

    res.status(200).json({ 
      hasReviewed: !!review,
      review: review || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking review status', error: error.message });
  }
};