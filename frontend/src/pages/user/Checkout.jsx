import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  Truck,
  Store,
  MapPin,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Just used for ID/Name, not addresses

  // --- STATES ---
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [deliveryMode, setDeliveryMode] = useState("Pickup");

  // Local Address State (Fetched from DB, not Token)
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [isAddingAddr, setIsAddingAddr] = useState(false);

  // 1. FETCH LATEST ADDRESSES FROM DB ON MOUNT
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/profile");
        if (data && data.addresses) {
          setAddressList(data.addresses);
          // Find default or select first
          const defaultIdx = data.addresses.findIndex((a) => a.isDefault);
          setSelectedAddressIndex(defaultIdx >= 0 ? defaultIdx : 0);
        }
      } catch (error) {
        console.error("Profile load error", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. Handle Order Placement
  const handleOrder = async () => {
    if (isSubmitting) return;

    // Validation: Delivery Mode needs Address
    if (deliveryMode === "Delivery") {
      if (addressList.length === 0) {
        toast.error("Please add a delivery address!");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const filesArray = state.fileKeys.map((key) => ({
        name: key,
        url: `/uploads/${key}`,
      }));

      // Get selected address object
      const selectedAddrObj = addressList[selectedAddressIndex];

      const orderData = {
        files: filesArray,
        totalAmount: state.totalPrice,
        deliveryMode,
        // Snapshot the address
        shippingAddress: deliveryMode === "Delivery" ? selectedAddrObj : null,
        details: {
          pages: state.totalPages,
          copies: state.copies || 1,
          printType: state.printType,
          size: state.size,
          media: state.media,
          binding: state.binding,
          lamination: state.lamination,
          cover: state.cover,
          instructions: state.instructions,
        },
        paymentMethod,
      };

      const { data } = await api.post("/orders", orderData);

      if (paymentMethod === "Cash") {
        toast.success("Order Placed Successfully!");
        navigate("/dashboard");
      } else {
        const { razorpayOrder } = data;

        // Mock Mode Check
        if (razorpayOrder.id.startsWith("order_mock_")) {
          toast.success("Test Mode: Payment Auto-Verified!");
          await api.post("/payments/verify", {
            razorpay_order_id: razorpayOrder.id,
            razorpay_payment_id: "pay_mock_123456",
            razorpay_signature: "mock_signature_bypass",
          });
          navigate("/dashboard");
          return;
        }

        // Real Razorpay
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: "INR",
          name: "Jumbo Xerox",
          description: "Printing Service",
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              const verifyRes = await api.post("/payments/verify", response);
              if (verifyRes.data.success) {
                toast.success("Payment Received!");
                navigate("/dashboard");
              }
            } catch (err) {
              toast.error("Verification Failed.");
            }
          },
          theme: { color: "#2563eb" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Order Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Handle Add New Address
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setIsAddingAddr(true);
    try {
      const { data } = await api.post("/users/address", newAddr);
      // Update Local List immediately
      setAddressList(data.addresses);
      toast.success("Address Added!");
      setShowAddressModal(false);
      setNewAddr({ street: "", city: "", state: "", pincode: "" });
      // Auto select the new one
      setSelectedAddressIndex(data.addresses.length - 1);
    } catch (error) {
      toast.error("Failed to add address");
    } finally {
      setIsAddingAddr(false);
    }
  };

  if (!state)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 mb-4">No order details found.</p>
        <button
          onClick={() => navigate("/quick-print")}
          className="text-blue-600 font-bold underline"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10 border border-gray-100 mb-20 relative">
      <h2 className="text-2xl font-black mb-6 text-gray-800 flex items-center gap-2">
        <ShieldCheck className="text-blue-600" /> Confirm & Pay
      </h2>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-3 border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">
            Files
          </span>
          <span className="font-bold">{state.fileKeys?.length} Docs</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">
            Type
          </span>
          <span className="font-bold">{state.printType}</span>
        </div>
        <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-lg font-bold">Total Pay:</span>
          <span className="text-2xl font-black text-blue-600">
            ₹{state.totalPrice}
          </span>
        </div>
      </div>

      {/* DELIVERY METHOD */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
          1. Delivery Mode
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => setDeliveryMode("Pickup")}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${
              deliveryMode === "Pickup"
                ? "border-blue-600 bg-blue-50/50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <Store
              size={24}
              className={
                deliveryMode === "Pickup" ? "text-blue-600" : "text-gray-400"
              }
            />
            <div>
              <p className="font-bold text-gray-800 text-sm">Shop Pickup</p>
              <p className="text-[10px] text-gray-500">Collect yourself</p>
            </div>
          </div>
          <div
            onClick={() => setDeliveryMode("Delivery")}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${
              deliveryMode === "Delivery"
                ? "border-purple-600 bg-purple-50/50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <Truck
              size={24}
              className={
                deliveryMode === "Delivery"
                  ? "text-purple-600"
                  : "text-gray-400"
              }
            />
            <div>
              <p className="font-bold text-gray-800 text-sm">Home Delivery</p>
              <p className="text-[10px] text-gray-500">Via Courier</p>
            </div>
          </div>
        </div>

        {/* ADDRESS SELECTION LIST */}
        {deliveryMode === "Delivery" && (
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Select Address
              </h4>
              <button
                onClick={() => setShowAddressModal(true)}
                className="flex items-center gap-1 text-[10px] bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-slate-700 transition"
              >
                <Plus size={12} /> ADD NEW
              </button>
            </div>

            {isLoadingProfile ? (
              <div className="p-4 text-center text-xs text-gray-400">
                Loading addresses...
              </div>
            ) : addressList.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar border border-gray-100 rounded-xl p-2">
                {addressList.map((addr, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedAddressIndex === idx
                        ? "border-purple-500 bg-purple-50"
                        : "border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedAddressIndex === idx
                          ? "border-purple-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedAddressIndex === idx && (
                        <div className="w-2 h-2 bg-purple-600 rounded-full" />
                      )}
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-gray-800">{addr.street}</p>
                      <p className="text-xs text-gray-500">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-xs italic">
                No addresses found in your profile. <br /> Please add one.
              </div>
            )}
          </div>
        )}
      </div>

      {/* PAYMENT METHOD */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
          2. Payment Method
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div
            onClick={() => setPaymentMethod("Online")}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              paymentMethod === "Online"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${
                  paymentMethod === "Online"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <CreditCard size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">
                  Online Payment
                </p>
                <p className="text-[10px] text-gray-500">
                  UPI, Card, Net Banking
                </p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "Online"
                  ? "border-blue-600"
                  : "border-gray-300"
              }`}
            >
              {paymentMethod === "Online" && (
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
              )}
            </div>
          </div>
          <div
            onClick={() => setPaymentMethod("Cash")}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              paymentMethod === "Cash"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${
                  paymentMethod === "Cash"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Banknote size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Pay at Shop</p>
                <p className="text-[10px] text-gray-500">Cash on Pickup</p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "Cash" ? "border-blue-600" : "border-gray-300"
              }`}
            >
              {paymentMethod === "Cash" && (
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleOrder}
        disabled={isSubmitting}
        className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest text-white transition shadow-lg ${
          isSubmitting
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-slate-900 hover:bg-slate-800 active:scale-95 shadow-slate-900/20"
        }`}
      >
        {isSubmitting
          ? "Processing..."
          : `Pay ₹${state.totalPrice} & Place Order`}
      </button>
      <p className="text-[10px] text-gray-400 text-center mt-6">
        Secure checkout powered by Razorpay.
      </p>

      {/* ADDRESS MODAL POPUP */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-black text-gray-800">
                  Add New Address
                </h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-full text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Street / Area
                  </label>
                  <input
                    required
                    type="text"
                    value={newAddr.street}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, street: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500/50 outline-none font-bold"
                    placeholder="Eg: 4th Line, Brundavan Gardens"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                      City
                    </label>
                    <input
                      required
                      type="text"
                      value={newAddr.city}
                      onChange={(e) =>
                        setNewAddr({ ...newAddr, city: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500/50 outline-none font-bold"
                      placeholder="Guntur"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                      State
                    </label>
                    <input
                      required
                      type="text"
                      value={newAddr.state}
                      onChange={(e) =>
                        setNewAddr({ ...newAddr, state: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500/50 outline-none font-bold"
                      placeholder="AP"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Pincode
                  </label>
                  <input
                    required
                    type="text"
                    value={newAddr.pincode}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, pincode: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500/50 outline-none font-bold"
                    placeholder="522007"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAddingAddr}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-4"
                >
                  {isAddingAddr ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Save & Select"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Checkout;
