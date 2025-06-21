import express from "express";
import Distributed from "../models/Distributed.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const distributeds = await Distributed.find();
    res.json(distributeds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const distributed = new Distributed(req.body);
  try {
    const newDistributed = await distributed.save();
    res.status(201).json(newDistributed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedDistributed = await Distributed.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDistributed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Distributed.findByIdAndDelete(req.params.id);
    res.json({ message: "Distributed record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
