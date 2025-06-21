import express from "express";
import ReportLost from "../models/ReportLost.js";

const router = express.Router();

router.get("/airline-data", async (req, res) => {
  try {
    const reportLostData = await ReportLost.aggregate([
      { $group: { _id: "$airline", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(reportLostData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
