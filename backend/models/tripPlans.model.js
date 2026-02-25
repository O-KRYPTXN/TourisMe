import mongoose from 'mongoose';
const { Schema } = mongoose;

const tripPlanSchema = new Schema({
  touristId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  title: { type: String, default: 'My Luxor Adventure' },
  startDate: { type: Date }, 
  endDate: { type: Date },
  budget: { type: Number }, 
  intensityLevel: { type: String, enum: ['Relaxed', 'Balanced', 'Intense'] }, 
  status: { type: String, enum: ['Draft', 'Confirmed', 'Completed'], default: 'Draft' },
  
  // Embedded itinerary items
  itineraryItems: [{
    attractionId: { type: Schema.Types.ObjectId, ref: 'Attraction' },
    dayNumber: { type: Number },
    scheduledTime: { type: String },
    notes: { type: String }
  }]
}, { timestamps: true });

// Indexes for performance
tripPlanSchema.index({ touristId: 1, createdAt: -1 });
tripPlanSchema.index({ status: 1 });

const TripPlan = mongoose.model('TripPlan', tripPlanSchema);

export default TripPlan;