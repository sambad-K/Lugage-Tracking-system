import express from "express";
import PostClaim from "../models/PostClaim.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const postClaims = await PostClaim.find();
    res.json(postClaims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const postClaim = new PostClaim(req.body);
  try {
    const newPostClaim = await postClaim.save();
    res.status(201).json(newPostClaim);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedPostClaim = await PostClaim.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPostClaim);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await PostClaim.findByIdAndDelete(req.params.id);
    res.json({ message: "Post claim record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
