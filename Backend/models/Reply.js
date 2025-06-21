import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  email: { type: String, required: true },
  reply: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Reply = mongoose.model('Reply', replySchema);
