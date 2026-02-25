import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewSchema = new Schema({
  touristId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  targetId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    refPath: 'targetModel'
  },
  targetModel: { 
    type: String, 
    enum: ['Attraction', 'Service'], 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String,
    maxlength: 1000
  },
  isVerified: {
    type: Boolean,
    default: false // Can be set to true if user actually visited/booked
  }
}, { timestamps: true });

// Compound index to prevent duplicate reviews
reviewSchema.index({ touristId: 1, targetId: 1 }, { unique: true });

// Index for faster queries
reviewSchema.index({ targetId: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;