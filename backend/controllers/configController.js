exports.getConfig = (req, res) => {
  /* console.log("[DEBUG-CONFIG] Env Vars Check:", {
    OTP: process.env.OTP_TEST_MODE,
    PAYMENT: process.env.PAYMENT_TEST_MODE,
    SHIPPING: process.env.SHIPPING_MODE
  }); */
  
  res.json({
    otpTestMode: process.env.OTP_TEST_MODE === "true",
    paymentTestMode: process.env.PAYMENT_TEST_MODE === "true",
    shippingMode: process.env.SHIPPING_MODE,
  });
};
