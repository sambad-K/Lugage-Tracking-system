import express from "express";
import Poster from "../models/Poster.js";
import ReportFound from "../models/ReportFound.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posters = await Poster.find();
    const posts = await Promise.all(
      posters.map(async (poster) => {
        const person = await ReportFound.findOne({
          ticketNumber: poster.ticketNumber,
        });
        return { poster, person };
      })
    );
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedPoster = await Poster.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPoster);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id);
    if (poster) {
      await ReportFound.findOneAndDelete({ ticketNumber: poster.ticketNumber });
      await Poster.findByIdAndDelete(req.params.id);
      res.json({ message: "Post and corresponding report deleted" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
