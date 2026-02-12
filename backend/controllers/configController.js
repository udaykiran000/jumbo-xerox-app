exports.getConfig = (req, res) => {
  res.json({
    otpTestMode: process.env.OTP_TEST_MODE === "true",
    paymentTestMode: process.env.PAYMENT_TEST_MODE === "true",
    shippingMode: process.env.SHIPPING_MODE,
  });
};
