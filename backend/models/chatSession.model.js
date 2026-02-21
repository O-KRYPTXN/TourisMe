
import mongoose from 'mongoose';
const { Schema } = mongoose;

const chatSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  messages: [{
    role: { type: String, enum: ['user', 'ai', 'system'] },
    content: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
export default ChatSession;