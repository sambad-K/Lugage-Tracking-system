import mongoose from 'mongoose';
import ReportLost from './ReportLost.js';
import ReportFound from './ReportFound.js';

const distributedSchema = new mongoose.Schema({
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
}, { collection: 'distributeds' });

distributedSchema.pre('save', async function(next) {
  console.log(`Saving ${this.ticketNumber} in Distributeds`);
  await synchronizeReportLost(this);
  await synchronizeReportFound(this);
  next();
});

distributedSchema.pre('findOneAndUpdate', async function(next) {
  console.log(`findOneAndUpdate middleware for ${this._conditions.ticketNumber}`);
  const update = this.getUpdate();
  await synchronizeReportLost(update);
  await synchronizeReportFound(update);
  next();
});

async function synchronizeReportLost(data) {
  const reportLost = await ReportLost.findOne({ ticketNumber: data.ticketNumber });
  if (reportLost) {
    reportLost.fullName = data.fullName;
    reportLost.ltpNumber = data.ltpNumber;
    reportLost.email = data.email;
    reportLost.phoneNumber = data.phoneNumber;
    reportLost.airline = data.airline;
    reportLost.date = data.date;
    await reportLost.save();
    console.log(`Updated reportLost document with ticketNumber ${data.ticketNumber}`);
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

const Distributed = mongoose.models.Distributed || mongoose.model('Distributed', distributedSchema);

export default Distributed;
