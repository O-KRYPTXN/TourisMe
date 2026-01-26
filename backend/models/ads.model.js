
const advertisementSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  contentUrl: { type: String }, 
  promoCode: { type: String }, 
  validUntil: { type: Date },
  approvalStatus: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  } 
});

module.exports = mongoose.model('Advertisement', advertisementSchema);