import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Poster from "../models/Poster.js";
import PostClaim from "../models/PostClaim.js";

const router = express.Router();

const DistributedPassenger =
  mongoose.models.DistributedPassenger ||
  mongoose.model(
    "DistributedPassenger",
    new mongoose.Schema({}, { strict: false }),
    "distributeds"
  );

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "minorprojectsspl@gmail.com",
    pass: "your app password",
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: "minorprojectsspl@gmail.com",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

let otps = {};

router.get("/", async (req, res) => {
  console.log("Received GET request for posters");
  try {
    const posters = await Poster.find().select(
      "fullName ticketNumber phoneNumber airport uploadedAt moreDetails image"
    );
    console.log("Fetched posters:", posters);
    res.status(200).json(posters);
  } catch (err) {
    console.error("Error fetching posters:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const {
    postId,
    claimantName,
    claimantEmail,
    claimantPhone,
    ticketNumber,
    ltpNumber,
    otp,
  } = req.body;
  console.log("Received POST request with body:", req.body);

  try {
    if (otp) {
      console.log("OTP provided:", otp);
      if (otps[claimantEmail] !== otp) {
        console.log("Invalid OTP for email:", claimantEmail);
        return res.status(400).json({ message: "Invalid OTP" });
      }

      delete otps[claimantEmail];
      console.log("OTP verified and cleared for email:", claimantEmail);

      const poster = await Poster.findById(postId);
      if (!poster) {
        console.log("Poster not found for ID:", postId);
        return res.status(404).json({ message: "Poster not found" });
      }
      console.log("Poster found:", poster);

      const postClaim = new PostClaim({
        claimantName,
        claimantEmail,
        claimantPhone,
        posterName: poster.fullName,
        posterEmail: poster.email,
        posterPhone: poster.phoneNumber,
        ticketNumber,
        ltpNumber,
        airport: poster.airport,
        uploadedAt: poster.uploadedAt,
        moreDetails: poster.moreDetails,
        image: poster.image,
      });
      await postClaim.save();
      console.log("PostClaim saved:", postClaim);

      await Poster.findByIdAndDelete(postId);
      console.log("Poster removed:", postId);

      const db = mongoose.connection.db;
      await db.collection("reportfound").deleteOne({ ticketNumber, ltpNumber });
      console.log("Entry removed from reportfound collection:", {
        ticketNumber,
        ltpNumber,
      });

      sendEmail(
        claimantEmail,
        "Claim Success",
        `Consult ${poster.fullName}, Phone: ${poster.phoneNumber}, Email: ${poster.email}`
      );
      console.log("Email sent to claimant:", claimantEmail);

      sendEmail(
        poster.email,
        "Claim regarding your post",
        `Consult ${claimantName}, Phone: ${claimantPhone}`
      );
      console.log("Email sent to poster:", poster.email);

      return res
        .status(200)
        .json({ message: "Claim submitted and emails sent successfully" });
    } else {
      console.log("No OTP provided, processing initial claim details");

      const poster = await Poster.findById(postId);
      if (!poster) {
        console.log("Poster not found for ID:", postId);
        return res.status(404).json({ message: "Poster not found" });
      }
      console.log("Poster found:", poster);

      const passenger = await DistributedPassenger.findOne({
        ticketNumber,
        ltpNumber,
        fullName: claimantName,
        email: claimantEmail,
        phoneNumber: claimantPhone,
      });
      if (!passenger) {
        console.log("Passenger details do not match for:", {
          ticketNumber,
          ltpNumber,
          fullName: claimantName,
          email: claimantEmail,
          phoneNumber: claimantPhone,
        });
        return res
          .status(404)
          .json({ message: "Passenger details do not match" });
      }
      console.log("Passenger matched:", passenger);

      const generatedOtp = generateOTP();
      otps[claimantEmail] = generatedOtp;
      console.log("Generated OTP:", generatedOtp, "for email:", claimantEmail);
      sendEmail(claimantEmail, "Your OTP", `Your OTP is ${generatedOtp}`);
      console.log("OTP email sent to:", claimantEmail);

      return res
        .status(200)
        .json({ message: "Details matched. OTP sent.", otpSent: true });
    }
  } catch (error) {
    console.error("Error processing claim:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
