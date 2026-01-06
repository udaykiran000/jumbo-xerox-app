const Order = require("../models/Order");
const crypto = require("crypto");

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // --- MOCK BYPASS LOGIC ---
    // If in test mode and receiving the special bypass signature
    if (
      process.env.PAYMENT_MODE === "test" &&
      razorpay_signature === "mock_signature_bypass"
    ) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "Paid",
          paymentId: razorpay_payment_id,
          status: "Processing",
        }
      );
      return res
        .status(200)
        .json({ success: true, message: "Mock Payment Verified" });
    }

    // --- REAL VERIFICATION LOGIC ---
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "Paid",
          paymentId: razorpay_payment_id,
          status: "Processing",
        }
      );
      return res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Verification failed" });
  }
};
