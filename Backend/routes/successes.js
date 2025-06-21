import express from "express";
import Success from "../models/Success.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const successes = await Success.find();
    res.json(successes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const success = new Success(req.body);
  try {
    const newSuccess = await success.save();
    res.status(201).json(newSuccess);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedSuccess = await Success.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSuccess);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Success.findByIdAndDelete(req.params.id);
    res.json({ message: "Success record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
