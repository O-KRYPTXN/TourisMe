import mongoose from 'mongoose';
const { Schema } = mongoose;

const serviceSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, 
  description: { type: String },
  price: { type: Number, required: true }, 
  averageRating: { type: Number, default: 0 }, 
  images: [{ type: String }], 
  serviceType: { 
    type: String, 
    enum: ['Restaurant', 'Rental', 'TourPackage'], 
    required: true 
  }
}, { discriminatorKey: 'serviceType', timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

// Restaurant Schema
const Restaurant = Service.discriminator('Restaurant', new Schema({
  cuisineType: { type: String }, 
  menu: [{ 
    itemName: String, 
    price: Number, 
    photo: String 
  }], 
  tableCapacity: { type: Number }
}));

// Rental Schema (Cars, Bikes, etc.)
const Rental = Service.discriminator('Rental', new Schema({
  vehicleType: { type: String }, 
  capacity: { type: Number }, 
  conditions: { type: String }
}));

// Tour Package Schema
const TourPackage = Service.discriminator('TourPackage', new Schema({
  itinerary: { type: String }, 
  durationDays: { type: Number }, 
  includedItems: [{ type: String }] 
}));


export { Service, Restaurant, Rental, TourPackage };
export default Service;