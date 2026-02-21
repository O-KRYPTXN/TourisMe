
import mongoose from 'mongoose';
const { Schema } = mongoose;

const bookingSchema = new Schema({
  touristId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, //
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true }, //
  bookingDate: { type: Date, default: Date.now },
  serviceDate: { type: Date, required: true },
  totalPrice: { type: Number },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Cancelled'], 
    default: 'Pending' 
  } //
});


const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;