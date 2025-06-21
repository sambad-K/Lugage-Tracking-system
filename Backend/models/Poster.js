import mongoose from 'mongoose';

const PosterSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  ticketNumber: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String, // Add phone number
    required: true,
  },
  airport: {
    type: String, // Add airport
    required: true,
  },
  image: {
    type: String,
  },
  moreDetails: {
    type: String,
  },
  uploadedAt: {
    type: Date, 
    default: Date.now,
  }
});

const Poster = mongoose.model('Poster', PosterSchema);

export default Poster;
