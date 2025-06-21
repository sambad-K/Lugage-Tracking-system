// models/OTP.js
import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: '10m' } } // OTP expires after 10 minutes
});

const OTP = mongoose.model('OTP', OTPSchema);
export default OTP;
