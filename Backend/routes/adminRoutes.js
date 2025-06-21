import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Welcome to the admin panel" });
});

export default router;
