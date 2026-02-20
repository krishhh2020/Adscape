import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import advertiserRoutes from "./routes/advertisers.js";
import billboardRoutes from "./routes/Billboards.js";
import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("Public/Uploads"));

app.use("/advertisers", advertiserRoutes);
app.use("/billboards", billboardRoutes);
app.use("/bookings", bookingRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Adscape Server running on port ${PORT}`);
});