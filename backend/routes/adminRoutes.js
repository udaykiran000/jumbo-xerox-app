const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getAllOrders,
  getAllUsers,
  updateOrderStatus,
  clearUnpaidOrders,
  adminSearch,
  createShipment,
  manualCleanup,
  clearTempChunks,
  manualSystemCleanup,
  deleteUser,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.use(protect, admin);

router.get("/stats", getAdminStats);
router.get("/orders", getAllOrders);
router.get("/users", getAllUsers);
router.delete("/user/:id", deleteUser); // New Route
router.get("/search", adminSearch);
router.put("/order/:id", updateOrderStatus);
router.delete("/cleanup-unpaid", clearUnpaidOrders);
router.get("/system-stats", getAdminStats);
router.post("/cleanup-now", manualCleanup);
router.post("/clear-temp", clearTempChunks);
router.post("/full-cleanup", manualSystemCleanup);
router.post("/order/:id/ship", createShipment);

module.exports = router;