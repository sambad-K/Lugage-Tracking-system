import express from "express";
import nodemailer from "nodemailer";
import Poster from "../models/Poster.js";
import Passenger from "../models/Passenger.js";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "minorprojectsspl@gmail.com",
    pass: "idhy nenw vghh wdus",
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

router.post("/claim", async (req, res) => {
  console.log("Received claim request:", req.body);

  try {
    const {
      postId,
      claimantName,
      claimantEmail,
      claimantPhone,
      ticketNumber,
      ltpNumber,
    } = req.body;
    console.log("Extracted data:", {
      postId,
      claimantName,
      claimantEmail,
      claimantPhone,
      ticketNumber,
      ltpNumber,
    });

    const poster = await Poster.findById(postId);
    console.log("Poster search result:", poster);
    if (!poster) {
      console.error("Poster not found:", postId);
      return res.status(404).json({ message: "Poster not found" });
    }

    const passenger = await Passenger.findOne({ ticketNumber, ltpNumber });
    console.log("Passenger search result:", passenger);
    if (!passenger) {
      console.error("Passenger not found:", { ticketNumber, ltpNumber });
      return res.status(404).json({ message: "Passenger not found" });
    }

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

    await Poster.findByIdAndDelete(postId);
    console.log("Poster removed from database:", postId);

    res
      .status(200)
      .json({ message: "Claim submitted and emails sent successfully" });
  } catch (error) {
    console.error("Error submitting claim:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
