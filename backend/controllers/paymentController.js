const Order = require("../models/Order");
const crypto = require("crypto");

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    // 1. Real Verification Logic (HMAC SHA256)
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // 2. Database update
      await Order.findByIdAndUpdate(dbOrderId, {
        paymentStatus: "Paid",
        paymentId: razorpay_payment_id,
        status: "Processing", //
      });

      return res.status(200).json({ 
        success: true, 
        message: "Payment verified successfully" 
      });
    } else {
      console.error("[PAYMENT-ERR] Signature Mismatch");
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment signature" 
      });
    }
  } catch (error) {
    console.error("[PAYMENT-ERR]:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};