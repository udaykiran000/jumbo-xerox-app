const Order = require("../models/Order");
const mongoose = require("mongoose");
const razorpayInstance = require("../config/razorpay");
const { calculateBackendPrice } = require("../utils/priceCalculator");

exports.createOrder = async (req, res) => {
  console.log("\n--- [START] Order Process ---");
  try {
    // 👇 Receive 'shippingAddress' from frontend
    const {
      files,
      details,
      totalAmount,
      paymentMethod,
      deliveryMode,
      shippingAddress,
    } = req.body;

    // ... Basic Validation ...
    if (!files || files.length === 0)
      return res.status(400).json({ success: false, message: "No files." });

    // ... Price Calculation (Same as before) ...
    const pages = Number(details.pages);
    const copies = Number(details.copies);
    const serverSidePrice = calculateBackendPrice(pages, copies, details);

    if (serverSidePrice === -1)
      return res
        .status(400)
        .json({ success: false, message: "Invalid specs." });
    if (Math.abs(serverSidePrice - totalAmount) > 5)
      return res
        .status(400)
        .json({ success: false, message: "Price mismatch." });

    // 👇 SNAPSHOT LOGIC 👇
    let finalAddress = null;
    if (deliveryMode === "Delivery") {
      if (!shippingAddress) {
        return res
          .status(400)
          .json({ success: false, message: "Delivery address is required." });
      }
      // Save the address object permanently in order
      finalAddress = {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
      };
    }

    // Base Order Data
    const baseOrderData = {
      user: req.user._id,
      files,
      details: { ...details, pages, copies },
      totalAmount: serverSidePrice,
      paymentMethod,
      deliveryMode: deliveryMode || "Pickup",
      shippingAddress: finalAddress, // Saved here
      paymentStatus: "Pending",
      status: "Pending",
    };

    // --- CASH ---
    if (paymentMethod === "Cash") {
      const newOrder = await Order.create(baseOrderData);
      return res
        .status(201)
        .json({ success: true, message: "Order placed!", order: newOrder });
    }

    // --- ONLINE ---
    if (paymentMethod === "Online") {
      if (!razorpayInstance) throw new Error("Razorpay not configured");

      const options = {
        amount: Math.round(serverSidePrice * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };
      const rzpOrder = await razorpayInstance.orders.create(options);

      const newOrder = await Order.create({
        ...baseOrderData,
        razorpayOrderId: rzpOrder.id,
      });
      return res
        .status(201)
        .json({ success: true, razorpayOrder: rzpOrder, dbOrder: newOrder });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid payment method." });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ... keep other functions (getMyOrders, getOrderById) as is ...
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: "Not Found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};
