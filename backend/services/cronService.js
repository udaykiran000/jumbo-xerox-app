const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const Order = require("../models/Order");

const TEMP_BASE = path.join(process.cwd(), "uploads", "temp");

const performCleanup = async () => {
  console.log("♻️ Starting Smart Cleanup...");
  try {
    // 1. Temp Chunks Cleanup (2.5 hours old)
    if (fs.existsSync(TEMP_BASE)) {
      const folders = fs.readdirSync(TEMP_BASE);
      folders.forEach((folder) => {
        const p = path.join(TEMP_BASE, folder);
        const s = fs.statSync(p);
        if (Date.now() - s.mtimeMs > 2.5 * 60 * 60 * 1000) {
          fs.rmSync(p, { recursive: true, force: true });
          console.log(`🗑️ Deleted old temp: ${folder}`);
        }
      });
    }

    // 2. Completed Orders Cleanup (48 hours old)
    const limit = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const completedOrders = await Order.find({
      status: "Completed",
      updatedAt: { $lt: limit },
    });

    for (const order of completedOrders) {
      order.files.forEach((file) => {
        const p = path.join(process.cwd(), file.url);
        if (fs.existsSync(p)) {
          fs.unlinkSync(p);
          console.log(`🗑️ Deleted completed file: ${file.name}`);
        }
      });
      order.status = "Archived"; // Status update logic
      await order.save();
    }
    console.log("✅ Cleanup Finished Successfully.");
  } catch (e) {
    console.error("❌ Cleanup Error:", e.message);
  }
};

const startCronJobs = () => {
  // Every 30 minutes run avthundi
  cron.schedule("*/30 * * * *", performCleanup);
};

module.exports = { startCronJobs, performCleanup };
