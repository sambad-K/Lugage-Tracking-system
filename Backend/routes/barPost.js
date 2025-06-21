import express from "express";
import ReportFound from "../models/ReportFound.js";

const router = express.Router();

router.get("/airline-data", async (req, res) => {
  try {
    const reportFoundData = await ReportFound.aggregate([
      { $group: { _id: "$airline", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(reportFoundData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
