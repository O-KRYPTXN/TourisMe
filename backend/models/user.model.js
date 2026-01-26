const mongoose = require('mongoose');
const { Schema } = mongoose;

// Base User Schema
const userSchema = new Schema({
  name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true }, 
  passwordHash: { type: String, required: true }, 
  phone: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  role: { 
    type: String, 
    enum: ['Tourist', 'LocalBusinessOwner', 'Admin'], 
    required: true 
  }
}, { discriminatorKey: 'role', timestamps: true });

const User = mongoose.model('User', userSchema);

// Tourist Discriminator
const Tourist = User.discriminator('Tourist', new Schema({
  preferences: [{ type: String }],
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Attraction' }] 
}));

// Local Business Owner Discriminator
const LocalBusinessOwner = User.discriminator('LocalBusinessOwner', new Schema({
  companyName: { type: String, required: true }, 
  licenseNumber: { type: String, required: true }, 
  isVerified: { type: Boolean, default: false }
}));

// Admin Discriminator
const Admin = User.discriminator('Admin', new Schema({
  roleLevel: { type: String, default: 'Moderator' } 
}));

module.exports = { User, Tourist, LocalBusinessOwner, Admin };