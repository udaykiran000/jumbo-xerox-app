require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { errorHandler } = require("./middleware/errorMiddleware");
const { startCronJobs } = require("./services/cronService");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// --- FIXED: Mapping both paths to uploads/files folder ---
app.use(
  "/api/uploads",
  express.static(path.join(__dirname, "uploads", "files"))
);
app.use("/uploads", express.static(path.join(__dirname, "uploads", "files")));

// --- OLD METHOD: Serving frontend from backend/public folder ---
//
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

startCronJobs();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

// --- FIXED: Catch-all route with Node v22 compatible syntax ---
// '*'
app.get(/.*/, (req, res) => {
  //
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
