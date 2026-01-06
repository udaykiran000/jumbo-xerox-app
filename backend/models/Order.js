const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    files: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    serviceType: { type: String, default: "QuickPrint" },
    
    // Print Details
    details: {
      pages: { type: Number, required: true },
      copies: { type: Number, default: 1 },
      printType: String,
      size: String,
      media: String,
      binding: String,
      lamination: String,
      cover: String,
      instructions: String,
    },
    
    totalAmount: { type: Number, required: true },
    
    // 👇 LOGISTICS INFO (Updated) 👇
    deliveryMode: { 
        type: String, 
        enum: ["Pickup", "Delivery"], 
        default: "Pickup" 
    },
    // IDI SNAPSHOT: User profile link kakunda, Address ni ikkade save chestam
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },

    paymentMethod: { type: String, enum: ["Online", "Cash"], required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    status: { type: String, enum: ["Pending", "Processing", "Completed", "Cancelled"], default: "Pending" },
    
    // Integrations
    razorpayOrderId: { type: String },
    paymentId: { type: String },
    shipmentId: { type: String },
    awbNumber: { type: String },
    courierName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);