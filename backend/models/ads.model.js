import mongoose from 'mongoose';
const { Schema } = mongoose;

const advertisementSchema = new Schema({
  ownerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  },
  contentUrl: { 
    type: String,
    required: true
  },
  promoCode: { 
    type: String,
    uppercase: true,
    trim: true
  },
  discount: {
    type: Number,
    min: 0,
    max: 100
  },
  validUntil: { 
    type: Date,
    required: true
  },
  approvalStatus: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  rejectionReason: {
    type: String
  },
  clickCount: {
    type: Number,
    default: 0
  },
  impressionCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Indexes for performance
advertisementSchema.index({ approvalStatus: 1, validUntil: 1 });
advertisementSchema.index({ ownerId: 1, createdAt: -1 });
advertisementSchema.index({ promoCode: 1 });

// Virtual to check if ad is expired
advertisementSchema.virtual('isExpired').get(function() {
  return this.validUntil < new Date();
});

// Virtual to check if ad is active
advertisementSchema.virtual('isActive').get(function() {
  return this.approvalStatus === 'Approved' && !this.isExpired;
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

export default Advertisement;