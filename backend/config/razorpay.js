const Razorpay = require("razorpay");
require("dotenv").config();

let razorpayInstance;

if (process.env.PAYMENT_MODE === "test") {
  // MOCK INSTANCE for Development
  console.log("⚠️ RAZORPAY RUNNING IN TEST/MOCK MODE");
  razorpayInstance = {
    orders: {
      create: async (options) => {
        return {
          id: `order_mock_${Date.now()}`, // Fake Order ID
          amount: options.amount,
          currency: "INR",
          status: "created",
        };
      },
    },
  };
} else {
  // REAL INSTANCE for Production
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

module.exports = razorpayInstance;