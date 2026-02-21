
import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewSchema = new Schema({
  touristId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  
  // Dynamic Reference
  targetId: { type: Schema.Types.ObjectId, required: true, refPath: 'targetModel' },
  targetModel: { 
    type: String, 
    required: true, 
    enum: ['Attraction', 'Service'] 
  },
  
  rating: { type: Number, min: 1, max: 5, required: true }, 
  comment: { type: String },
}, { timestamps: true });


const Review = mongoose.model('Review', reviewSchema);

export default Review;