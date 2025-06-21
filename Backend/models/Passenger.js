import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  airline: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Passenger = mongoose.model('Passenger', passengerSchema);

export default Passenger;
