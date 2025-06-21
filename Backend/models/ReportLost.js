import mongoose from 'mongoose';
import Distributed from './Distributed.js';
import ReportFound from './ReportFound.js';

const reportLostSchema = new mongoose.Schema({
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
}, { collection: 'reportlost' });

reportLostSchema.pre('save', async function(next) {
  console.log(`Saving ${this.ticketNumber} in ReportLost`);
  await synchronizeDistributed(this);
  await synchronizeReportFound(this);
  next();
});

reportLostSchema.pre('findOneAndUpdate', async function(next) {
  console.log(`findOneAndUpdate middleware for ${this._conditions.ticketNumber}`);
  const update = this.getUpdate();
  await synchronizeDistributed(update);
  await synchronizeReportFound(update);
  next();
});

async function synchronizeDistributed(data) {
  const distributed = await Distributed.findOne({ ticketNumber: data.ticketNumber });
  if (distributed) {
    distributed.fullName = data.fullName;
    distributed.ltpNumber = data.ltpNumber;
    distributed.email = data.email;
    distributed.phoneNumber = data.phoneNumber;
    distributed.airline = data.airline;
    distributed.date = data.date;
    await distributed.save();
    console.log(`Updated distributed document with ticketNumber ${data.ticketNumber}`);
  }
}

async function synchronizeReportFound(data) {
  const reportFound = await ReportFound.findOne({ ticketNumber: data.ticketNumber });
  if (reportFound) {
    reportFound.fullName = data.fullName;
    reportFound.ltpNumber = data.ltpNumber;
    reportFound.email = data.email;
    reportFound.phoneNumber = data.phoneNumber;
    reportFound.airline = data.airline;
    reportFound.date = data.date;
    await reportFound.save();
    console.log(`Updated reportFound document with ticketNumber ${data.ticketNumber}`);
  }
}

const ReportLost = mongoose.models.ReportLost || mongoose.model('ReportLost', reportLostSchema);

export default ReportLost;
