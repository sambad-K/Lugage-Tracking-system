import express from "express";
import { Complaint } from "../models/Complaint.js";
import { Reply } from "../models/Reply.js";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "minorprojectsspl@gmail.com",
    pass: "your app password",
  },
});

router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/reply", async (req, res) => {
  const { complaintId, email, reply } = req.body;

  const formalReply = `${reply}`;

  const mailOptions = {
    from: "minorprojectsspl@gmail.com",
    to: email,
    subject: "Reply to your complaint",
    text: formalReply,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.error("Error sending email:", error.message);
      return res.status(500).json({ message: error.message });
    } else {
      console.log("Email sent:", info.response);
      try {
        const newReply = new Reply({ complaintId, email, reply: formalReply });
        await newReply.save();
        res.status(200).json({ message: "Email sent: " + info.response });
      } catch (err) {
        console.error("Error saving reply:", err.message);
        res.status(500).json({ message: err.message });
      }
    }
  });
});

router.get("/:complaintId/replies", async (req, res) => {
  try {
    const replies = await Reply.find({
      complaintId: req.params.complaintId,
    }).sort({ createdAt: -1 });
    res.json(replies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedComplaint = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updatedComplaint,
      { new: true }
    );
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    await Reply.deleteMany({ complaintId: req.params.id });
    res.status(200).json({ message: "Complaint deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
