

const chatSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  messages: [{
    role: { type: String, enum: ['user', 'ai', 'system'] },
    content: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', chatSessionSchema);