const Order = require("../models/Order");
const User = require("../models/User");
const mongoose = require("mongoose");
const { createShiprocketOrder } = require("../services/shiprocketService");
const { performCleanup } = require("../services/cronService");
const checkDiskSpace = require("check-disk-space").default;
const path = require("path");
const fs = require("fs");

// Helper: Recursive folder size
const getDirSize = (dirPath) => {
  let size = 0;
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      try {
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) size += getDirSize(filePath);
        else size += stats.size;
      } catch (err) {
        console.log(`Skipping file: ${file}`);
      }
    });
  }
  return size;
};

// 1. Stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayReg = await User.countDocuments({ createdAt: { $gte: today } });
    const todayOrdersTotal = await Order.countDocuments({
      createdAt: { $gte: today },
    });
    const todayOrdersCompleted = await Order.countDocuments({
      createdAt: { $gte: today },
      status: "Completed",
    });
    const todayOrdersPending = await Order.countDocuments({
      createdAt: { $gte: today },
      status: { $in: ["Pending", "Processing"] },
    });
    const uploadsPath = path.join(process.cwd(), "uploads", "files");
    const uploadsSizeBytes = getDirSize(uploadsPath);
    const diskStats = {
      free: "0 GB",
      total: "0 GB",
      used: "0 GB",
      percentFree: "0%",
      uploadsSize: "0 MB",
      isLowSpace: false,
    };
    try {
      const space = await checkDiskSpace(process.cwd());
      const freeGB = (space.free / 1e9).toFixed(2);
      const totalGB = (space.size / 1e9).toFixed(2);
      const percentFree = ((space.free / space.size) * 100).toFixed(0);
      diskStats.free = `${freeGB} GB`;
      diskStats.total = `${totalGB} GB`;
      diskStats.percentFree = `${percentFree}%`;
      diskStats.uploadsSize = (uploadsSizeBytes / 1e6).toFixed(2) + " MB";
      diskStats.isLowSpace = percentFree < 20;
    } catch (err) {
      console.error(err);
    }
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const combinedActivity = []; // Logic to populate
    res.json({
      totalUsers,
      todayReg,
      todayOrders: {
        total: todayOrdersTotal,
        completed: todayOrdersCompleted,
        pending: todayOrdersPending,
      },
      todayRev: revenueData[0]?.total || 0,
      disk: diskStats,
      recentActivity: combinedActivity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Search, 3. Shipment, 4. AllOrders, 5. AllUsers, 6. DeleteUser (Keeping your original logic)
exports.adminSearch = async (req, res) => {
  /* ... original ... */
};
exports.createShipment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user");
    if (!order) return res.status(404).json({ message: "Order not found" });
    const shipData = await createShiprocketOrder(order);
    order.shipmentId = shipData.shipment_id;
    await order.save();
    res.json({ message: "Shipment created successfully", data: shipData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const orders = await Order.find()
      .populate("user", "name email phone addresses")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalOrders = await Order.countDocuments();
    res.json({
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  /* ... original ... */
};
exports.deleteUser = async (req, res) => {
  /* ... original ... */
};

// 7. Update Status with 7s UNDO & AUTO-DELETE
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Lock check
    if (order.filesDeleted) {
      return res
        .status(400)
        .json({ message: "Order is locked. Files already deleted." });
    }

    order.status = status;
    await order.save();

    // --- 7 SECONDS UNDO LOGIC ---
    if (status === "Completed" || status === "Cancelled") {
      setTimeout(async () => {
        try {
          const finalCheckOrder = await Order.findById(orderId);
          // 7 సెకన్ల తర్వాత కూడా స్టేటస్ అలాగే ఉంటేనే డిలీట్ చేయాలి
          if (
            finalCheckOrder &&
            (finalCheckOrder.status === "Completed" ||
              finalCheckOrder.status === "Cancelled")
          ) {
            finalCheckOrder.files.forEach((file) => {
              const fileName = path.basename(file.url);
              const filePath = path.join(
                process.cwd(),
                "uploads",
                "files",
                fileName
              );
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Permanently Deleted: ${fileName}`);
              }
            });
            finalCheckOrder.filesDeleted = true;
            await finalCheckOrder.save();
          }
        } catch (err) {
          console.error("Auto-delete error:", err);
        }
      }, 7000);
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. Maintenance (Originals)
exports.clearUnpaidOrders = async (req, res) => {
  /* ... original ... */
};
exports.manualCleanup = async (req, res) => {
  /* ... original ... */
};
exports.clearTempChunks = async (req, res) => {
  /* ... original ... */
};
exports.manualSystemCleanup = async (req, res) => {
  /* ... original ... */
};
