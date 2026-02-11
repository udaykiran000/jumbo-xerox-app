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
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// --- UPLOADS STATIC FILES ---
const uploadsPath = path.join(__dirname, "uploads", "files");
app.use("/api/uploads/files", express.static(uploadsPath));
app.use("/uploads/files", express.static(uploadsPath));
app.use("/api/uploads", express.static(uploadsPath));
app.use("/uploads", express.static(uploadsPath));

// --- FRONTEND STATIC FILES ---
// Render  frontend/dist  path
const buildPath = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(buildPath));

// --- DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

startCronJobs();

// --- API ROUTES ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

// --- CATCH-ALL ROUTE FOR FRONTEND ---
app.get("(.*)", (req, res) => {
  // 1. API route
  if (req.path.startsWith("/api")) {
    return res.status(404).json({
      success: false,
      message: `API Route ${req.path} not found`,
    });
  }

  //
  res.sendFile(path.join(buildPath, "index.html"), (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      res
        .status(500)
        .send("Frontend build not found. Path checked: " + buildPath);
    }
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 10000; // Render port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
