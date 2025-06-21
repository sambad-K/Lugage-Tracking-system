import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import reportRoutes from "./routes/report.js";
import traceRoutes from "./routes/trace.js";
import loginRoute from "./routes/login.js";
import adminRoute from "./routes/adminRoutes.js";
import reportLostRoutes from "./routes/reportLost.js";
import barPostRoutes from "./routes/barPost.js";
import barLostRoutes from "./routes/barLost.js";
import postsRoutes from "./routes/posts.js";
import successesRoutes from "./routes/successes.js";
import distributedRoutes from "./routes/distributed.js";
import postclaimsRoutes from "./routes/postclaims.js";
import complaintsRoutes from "./routes/complaints.js";

import Distributed from "./models/Distributed.js";
import ReportLost from "./models/ReportLost.js";
import ReportFound from "./models/ReportFound.js";
import { Complaint } from "./models/Complaint.js";
import Success from "./models/Success.js";
import PostClaim from "./models/PostClaim.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(cors());
app.use("/login", loginRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect("mongodb://localhost:27017/MINOR")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/Report", reportRoutes);
app.use("/Trace", traceRoutes);
app.use("/login", loginRoute);
app.use("/found-reports", reportLostRoutes);
app.use("/posts", postsRoutes);
app.use("/successes", successesRoutes);
app.use("/distributed", distributedRoutes);
app.use("/postclaims", postclaimsRoutes);
app.use("/complaints", complaintsRoutes);
app.use("/barpost", barPostRoutes);
app.use("/barlost", barLostRoutes);
app.get("/distributeds/count", async (req, res) => {
  try {
    const count = await Distributed.countDocuments();
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/reportlost/count", async (req, res) => {
  try {
    const count = await ReportLost.countDocuments();
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/reportfound/count", async (req, res) => {
  try {
    const count = await ReportFound.countDocuments();
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/complaints/count", async (req, res) => {
  try {
    const count = await Complaint.countDocuments();
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/successes/count", async (req, res) => {
  try {
    const count = await Success.countDocuments();
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/postclaims/count", async (req, res) => {
  try {
    const count = await PostClaim.countDocuments();
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
