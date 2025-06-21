import mongoose from 'mongoose';
import Distributed from './Distributed.js';
import ReportLost from './ReportLost.js';

const reportFoundSchema = new mongoose.Schema({
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

reportFoundSchema.pre('save', async function(next) {
  const distributed = await Distributed.findOne({ ticketNumber: this.ticketNumber });
  const reportLost = await ReportLost.findOne({ ticketNumber: this.ticketNumber });

  if (distributed) {
    distributed.fullName = this.fullName;
    distributed.ltpNumber = this.ltpNumber;
    distributed.email = this.email;
    distributed.phoneNumber = this.phoneNumber;
    distributed.airline = this.airline;
    distributed.date = this.date;
    await distributed.save();
  }

  if (reportLost) {
    reportLost.fullName = this.fullName;
    reportLost.ltpNumber = this.ltpNumber;
    reportLost.email = this.email;
    reportLost.phoneNumber = this.phoneNumber;
    reportLost.airline = this.airline;
    reportLost.date = this.date;
    await reportLost.save();
  }

  next();
});

reportFoundSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  const distributed = await Distributed.findOne({ ticketNumber: update.ticketNumber });
  const reportLost = await ReportLost.findOne({ ticketNumber: update.ticketNumber });

  if (distributed) {
    if (update.fullName) distributed.fullName = update.fullName;
    if (update.ltpNumber) distributed.ltpNumber = update.ltpNumber;
    if (update.email) distributed.email = update.email;
    if (update.phoneNumber) distributed.phoneNumber = update.phoneNumber;
    if (update.airline) distributed.airline = update.airline;
    if (update.date) distributed.date = update.date;
    await distributed.save();
  }

  if (reportLost) {
    if (update.fullName) reportLost.fullName = update.fullName;
    if (update.ltpNumber) reportLost.ltpNumber = update.ltpNumber;
    if (update.email) reportLost.email = update.email;
    if (update.phoneNumber) reportLost.phoneNumber = update.phoneNumber;
    if (update.airline) reportLost.airline = update.airline;
    if (update.date) reportLost.date = update.date;
    await reportLost.save();
  }

  next();
});

const ReportFound = mongoose.models.ReportFound || mongoose.model('ReportFound', reportFoundSchema);

export default ReportFound;
