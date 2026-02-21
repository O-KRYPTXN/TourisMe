
import mongoose from 'mongoose';
const { Schema } = mongoose;

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


const Advertisement = mongoose.model('Advertisement', advertisementSchema);

export default Advertisement;