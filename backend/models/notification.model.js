
import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true }, 
  type: { type: String, enum: ['Booking', 'Reminder', 'Promo'] }, 
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;