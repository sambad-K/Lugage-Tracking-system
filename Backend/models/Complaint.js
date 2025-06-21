import mongoose from 'mongoose';
const { Schema } = mongoose;

const complaintSchema = new Schema({
  sessionId: { type: String, required: true },
  complaint: { type: String, required: true },
  status: { type: String, default: 'not read' }, 
  createdAt: { type: Date }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export { Complaint };
