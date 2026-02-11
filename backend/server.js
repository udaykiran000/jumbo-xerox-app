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

// Mapping both paths to uploads/files folder
// Order matters: more specific routes first
app.use(
  "/api/uploads/files",
  express.static(path.join(__dirname, "uploads", "files"))
);
app.use(
  "/uploads/files",
  express.static(path.join(__dirname, "uploads", "files"))
);
app.use(
  "/api/uploads",
  express.static(path.join(__dirname, "uploads", "files"))
);
app.use("/uploads", express.static(path.join(__dirname, "uploads", "files")));

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

// Catch-all route with Node v22 compatible syntax
//Professional Catch-all Route
app.get("*path", (req, res) => {
  // 1. Check if the request is for an API that doesn't exist
  if (req.path.startsWith("/api")) {
    return res.status(404).json({
      success: false,
      message: `API Route ${req.path} not found on this server`,
    });
  }

  // 2. If it's NOT an API route, serve the React Frontend
  // This allows React Router to handle page navigation
  res.sendFile(path.join(__dirname, "public", "index.html"), (err) => {
    if (err) {
      res
        .status(500)
        .send("Frontend build not found. Run 'npm run build' in frontend.");
    }
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
