import mongoose from 'mongoose';

const successSchema = new mongoose.Schema({
  passenger: {
    fullName: {
      type: String,
      required: true,
    },
    ticketNumber: {
      type: String,
      required: true,
    },
    ltpNumber: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    airline: {
      type: String,
      required: true,
    },
  },
  posterName: {
    type: String,
    required: true,
  },
  posterEmail: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Success = mongoose.model('Success', successSchema);

export default Success;
