const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadChunk,
  mergeChunks,
  getUploadStatus,
} = require("../controllers/uploadController");

const upload = multer({ dest: "uploads/temp/" });

// Added status route for resumable check
router.get("/status", protect, getUploadStatus);
router.post("/chunk", protect, upload.single("chunk"), uploadChunk);
router.post("/merge", protect, mergeChunks);

module.exports = router;
