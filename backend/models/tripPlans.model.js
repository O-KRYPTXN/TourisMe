

const tripPlanSchema = new Schema({
  touristId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  title: { type: String, default: 'My Trip' },
  startDate: { type: Date }, 
  endDate: { type: Date },
  budget: { type: Number }, 
  intensityLevel: { type: String, enum: ['Relaxed', 'Balanced', 'Intense'] }, 
  status: { type: String, enum: ['Draft', 'Confirmed', 'Completed'], default: 'Draft' },
  
  // Embedded Items (Optimized)
  itineraryItems: [{
    attractionId: { type: Schema.Types.ObjectId, ref: 'Attraction' },
    dayNumber: Number,
    scheduledTime: String,
    notes: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('TripPlan', tripPlanSchema);