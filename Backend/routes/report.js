import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import Passenger from '../models/Passenger.js';
import Poster from '../models/Poster.js';
import Success from '../models/Success.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'minorprojectsspl@gmail.com',
    pass: 'your app password' 
  }
});

const router = express.Router();
const DistributedPassenger = mongoose.model('DistributedPassenger', Passenger.schema, 'distributeds');
const ReportLost = mongoose.model('ReportLost', Passenger.schema, 'reportlost');
const ReportFound = mongoose.model('ReportFound', Passenger.schema, 'reportfound');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'minorprojectsspl@gmail.com', 
    to,
    subject,
    text
  };

  console.log(`Sending email to: ${to}, Subject: ${subject}`);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { action, ticketNumber, ltpNumber, fullName, email, phoneNumber, airline, airport, moreDetails } = req.body;

    if (action === 'found' && ticketNumber) {
      const existingPoster = await Poster.findOne({ ticketNumber });
      if (existingPoster) {
        console.log(`Post report duplication: Poster already exists with ticket number: ${ticketNumber}`);
        return res.status(400).json({ message: 'A post has already been submitted with this ticket number.' });
      }

      const lostReport = await ReportLost.findOne({ ticketNumber });
      if (lostReport) {
        console.log(`Report matched: Found report matched with lost report for ticket number: ${ticketNumber}`);

        sendEmail(email, 'Report Matched', `Your post matched with a lost report. The lost report details are: Phone - ${lostReport.phoneNumber}, Full Name - ${lostReport.fullName}, Email - ${lostReport.email}`);
        sendEmail(lostReport.email, 'Report Matched', `Your lost report matched with a post. The poster details are: Phone - ${phoneNumber}, Full Name - ${fullName}, Email - ${email}`);

        const successData = {
          passenger: {
            fullName: lostReport.fullName,
            ticketNumber: lostReport.ticketNumber,
            ltpNumber: lostReport.ltpNumber,
            phoneNumber: lostReport.phoneNumber,
            email: lostReport.email,
            airline: lostReport.airline
          },
          posterName: fullName,
          posterEmail: email
        };
        const successEntry = new Success(successData);
        await successEntry.save();
        console.log('Success entry created:', successData);

        await ReportLost.deleteOne({ _id: lostReport._id });
        await Poster.deleteOne({ email });

        return res.status(200).json({ message: 'Report matched and processed successfully' });
      }

      const passenger = await DistributedPassenger.findOne({ ticketNumber });
      if (passenger) {
        const newPassengerData = { ...passenger._doc, image: req.file?.path };
        delete newPassengerData._id;

        const newPassenger = new ReportFound(newPassengerData);
        await newPassenger.save();
        console.log('New passenger found and saved:', newPassengerData);

        const newPoster = new Poster({
          fullName,
          email,
          ticketNumber, 
          phoneNumber,
          airport, 
          image: req.file?.path, 
          moreDetails, 
          uploadedAt: new Date() 
        });
        await newPoster.save();
        console.log('New poster created and saved:', { fullName, email, ticketNumber, phoneNumber, airport, image: req.file?.path, moreDetails });

        sendEmail(email, 'Post Success', 'Your post has been successfully submitted.');

        res.status(200).json({ message: 'Post submitted successfully' });
      } else {
        res.status(404).json({ message: 'Passenger not found' });
      }
    } else if (action === 'lost' && ltpNumber && fullName && phoneNumber && airline) {
      const existingLostReport = await ReportLost.findOne({ ltpNumber, fullName, phoneNumber, airline });
      if (existingLostReport) {
        console.log(`Lost report duplication: Lost report already exists for ltpNumber: ${ltpNumber}, fullName: ${fullName}, phoneNumber: ${phoneNumber}, airline: ${airline}`);
        return res.status(400).json({ message: 'A lost report has already been submitted for this passenger.' });
      }

      const foundPost = await ReportFound.findOne({ ltpNumber });
      if (foundPost) {
        console.log(`Post duplication: Post already exists in found reports for ltpNumber: ${ltpNumber}`);
        return res.status(400).json({ message: 'A post already exists in the found reports.' });
      }

      const passenger = await DistributedPassenger.findOne({ ltpNumber, fullName, phoneNumber, airline });
      if (passenger) {
        const newPassengerData = { ...passenger._doc };
        delete newPassengerData._id;

        const newPassenger = new ReportLost(newPassengerData);
        await newPassenger.save();
        console.log('Lost report submitted and saved:', newPassengerData);

        sendEmail(passenger.email, 'Report Success', 'Your lost report has been successfully submitted.');

        res.status(200).json({ message: 'Lost report submitted successfully' });
      } else {
        res.status(404).json({ message: 'Passenger not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid action or missing parameters' });
    }
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
