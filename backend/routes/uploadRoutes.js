const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  uploadChunk,    // Modified for Busboy
  mergeChunks,
  getUploadStatus,
  downloadOrderZip,
} = require("../controllers/uploadController");

// status route for resumable check
router.get("/status", protect, getUploadStatus);

// Busboy streaming in controller
router.post("/chunk", protect, uploadChunk);

router.post("/merge", protect, mergeChunks);
router.get("/download-zip/:orderId", protect, downloadOrderZip);

module.exports = router;