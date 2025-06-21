import mongoose from 'mongoose';

const postClaimSchema = new mongoose.Schema({
  claimantName: {
    type: String,
    required: true,
  },
  claimantEmail: {
    type: String,
    required: true,
  },
  claimantPhone: {
    type: String,
    required: true,
  },
  posterName: {
    type: String,
    required: true,
  },
  posterEmail: {
    type: String,
    required: true,
  },
  posterPhone: {
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
  airport: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    required: true,
  },
  moreDetails: {
    type: String,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

const PostClaim = mongoose.model('PostClaim', postClaimSchema);

export default PostClaim;
