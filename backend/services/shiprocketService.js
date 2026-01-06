const axios = require("axios");

const SHIPROCKET_URL = "https://apiv2.shiprocket.in/v1/external";

const getAuthToken = async () => {
  try {
    const response = await axios.post(`${SHIPROCKET_URL}/auth/login`, {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });
    return response.data.token;
  } catch (error) {
    console.error(
      "Shiprocket Auth Error:",
      error.response?.data || error.message
    );
    return null;
  }
};

exports.createShiprocketOrder = async (orderData) => {
  // --- MOCK MODE CHECK ---
  if (process.env.SHIPPING_MODE === "test") {
    console.log("⚠️ SHIPROCKET RUNNING IN MOCK MODE");
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      shipment_id: `SHIP_MOCK_${Math.floor(Math.random() * 10000)}`,
      awb_code: `AWB_MOCK_${Date.now()}`,
      courier_name: "Dummy Express (Test)",
      status: "NEW",
    };
  }

  // --- REAL LOGIC ---
  const token = await getAuthToken();
  if (!token) throw new Error("Shiprocket Authentication Failed");

  // Construct payload based on order details
  const payload = {
    order_id: orderData._id,
    order_date: orderData.createdAt,
    pickup_location_id: "Primary",
    billing_customer_name: orderData.user.name,
    billing_last_name: "",
    billing_address:
      orderData.user.addresses?.find((a) => a.isDefault)?.street || "Guntur",
    billing_city:
      orderData.user.addresses?.find((a) => a.isDefault)?.city || "Guntur",
    billing_pincode:
      orderData.user.addresses?.find((a) => a.isDefault)?.pincode || "522001",
    billing_state:
      orderData.user.addresses?.find((a) => a.isDefault)?.state ||
      "Andhra Pradesh",
    billing_country: "India",
    billing_email: orderData.user.email,
    billing_phone: orderData.user.phone || "9999999999",
    shipping_is_billing: true,
    order_items: [
      {
        name: "Print Order #" + orderData._id.slice(-5),
        sku: "PRINT-" + orderData._id.slice(-5),
        units: 1,
        selling_price: orderData.totalAmount,
      },
    ],
    payment_method: orderData.paymentMethod === "Online" ? "Prepaid" : "COD",
    sub_total: orderData.totalAmount,
    length: 10,
    breadth: 10,
    height: 5,
    weight: 0.5,
  };

  try {
    const response = await axios.post(
      `${SHIPROCKET_URL}/orders/create/adhoc`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create Shiprocket Order"
    );
  }
};
