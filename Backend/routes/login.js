import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Admin from "../models/Admin.js";

const router = express.Router();
const jwtSecret =
  "9793615b5d209d020375f6f4d2fa959a2bded2452e5a759dc5cdfa1e6a5c97ea177e1770430f78ac0ecee885fe4dcc919c0654456c81efaa95328e7d7deb9314"; // Replace with your own secret key

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "minorprojectsspl@gmail.com",
    pass: "your app password",
  },
});

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const otpStore = {};

const setOtpWithExpiration = (email, otp) => {
  const expirationTime = 30 * 1000;
  otpStore[email] = { otp, expiresAt: Date.now() + expirationTime };

  setTimeout(() => {
    if (otpStore[email] && otpStore[email].expiresAt <= Date.now()) {
      delete otpStore[email];
    }
  }, expirationTime);
};

router.post("/", async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (otp) {
      const storedOtpInfo = otpStore[email];
      if (
        storedOtpInfo &&
        storedOtpInfo.otp === otp &&
        Date.now() < storedOtpInfo.expiresAt
      ) {
        const token = jwt.sign(
          { id: admin._id, email: admin.email },
          jwtSecret,
          { expiresIn: "1h" }
        );

        delete otpStore[email];

        return res
          .status(200)
          .json({ message: "OTP verified successfully", token });
      } else {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const generatedOtp = generateOtp();

    setOtpWithExpiration(email, generatedOtp);

    const mailOptions = {
      from: "minorprojectsspl@gmail.com",
      to: email,
      subject: "Your OTP for Admin Panel Login",
      text: `Your OTP is ${generatedOtp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({ message: "Error sending OTP email" });
      } else {
        console.log("OTP email sent:", info.response);
        res.status(200).json({ message: "Login successful, OTP sent" });
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
