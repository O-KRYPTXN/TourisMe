
const attractionSchema = new Schema({
  name: { type: String, required: true }, 
  description: { type: String },
  category: { type: String, index: true }, 
  ticketPrice: { type: Number },
  openingHours: { type: String },
  images: [{ type: String }],
  // GeoJSON for location-based searches
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [Longitude, Latitude]
  },
  averageRating: { type: Number, default: 0 } 
}, { timestamps: true });

// Index for geospatial queries
attractionSchema.index({ location: '2dsphere' }); 

module.exports = mongoose.model('Attraction', attractionSchema);