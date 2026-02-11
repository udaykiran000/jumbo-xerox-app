import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Clock,
  Search,
  X,
  RotateCcw,
  Eye,
  Lock,
  AlertTriangle,
  Truck,
  User,
  MapPin,
  CreditCard,
  Hash,
} from "lucide-react";

export default function AdminOrders() {
  const { state } = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [countingId, setCountingId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pendingStatus, setPendingStatus] = useState("");
  const timerRef = useRef(null);

  // Safe API URL Logic (Original Integrity Preserved)
  const rawUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const API_BASE_URL = rawUrl.replace("/api", "");

  useEffect(() => {
    fetchOrders();
  }, []);

  // Dashboard Auto-open Logic (Original Integrity Preserved)
  useEffect(() => {
    if (orders.length > 0 && state?.openOrderId) {
      const target = orders.find((o) => o._id === state.openOrderId);
      if (target) setSelectedOrder(target);
    }
  }, [orders, state]);

  // 7-SECOND UNDO TIMER (Original Integrity Preserved)
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && countingId) {
      commitStatus(countingId, pendingStatus);
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, countingId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/orders");
      setOrders(data.orders || []);
    } catch (e) {
      toast.error("Cloud Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, status) => {
    const order = orders.find((o) => o._id === id);
    if (!order || order.status === status) return;
    if (status === "Completed" || status === "Cancelled") {
      setCountingId(id);
      setPendingStatus(status);
      setTimeLeft(7);
      toast(`Action locking in 7s...`, { icon: "⏳" });
    } else {
      commitStatus(id, status);
    }
  };

  const commitStatus = async (id, status) => {
    try {
      await api.put(`/admin/order/${id}`, { status });
      toast.success(`Order locked as ${status}`);
      setCountingId(null);
      fetchOrders();
    } catch (e) {
      toast.error(e.response?.data?.message || "Lock active");
      setCountingId(null);
    }
  };

  // Holistic Upgrade: ZIP Download Trigger
  const handleZipDownload = async (orderId) => {
    try {
      const response = await api.get(`/admin/download-zip/${orderId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Order_${orderId.slice(-6).toUpperCase()}.zip`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("ZIP Generation Failed");
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.phone?.includes(searchTerm) ||
      o._id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">
          Order Repository
        </h1>
        <div className="relative w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Identity, Name or Phone..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-blue-600 shadow-sm outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="p-7">ID</th>
                <th className="p-7">Customer</th>
                <th className="p-7 text-center">Amount</th>
                <th className="p-7 text-center">Status</th>
                <th className="p-7 text-center">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((o) => {
                const isLocked =
                  o.status === "Completed" ||
                  o.status === "Cancelled" ||
                  o.filesDeleted;
                const canShip =
                  o.paymentStatus === "Paid" &&
                  o.status === "Completed" &&
                  o.deliveryMode === "Delivery";

                return (
                  <tr
                    key={o._id}
                    className="hover:bg-blue-50/20 transition-all"
                  >
                    <td className="p-7 text-blue-600 font-black italic">
                      #{o._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="p-7">
                      <p className="text-slate-900 font-black text-sm">
                        {o.user?.name || "N/A"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {o.user?.phone || "No Phone"}
                      </p>
                    </td>
                    <td className="p-7 text-center italic font-black text-slate-800 text-lg">
                      ₹{o.totalAmount}
                    </td>
                    <td className="p-7 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                          o.status === "Completed"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : o.status === "Cancelled"
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-7">
                      <div className="flex items-center justify-center gap-3">
                        {countingId === o._id ? (
                          <button
                            onClick={() => setCountingId(null)}
                            className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black animate-pulse flex items-center gap-2"
                          >
                            <RotateCcw size={14} /> UNDO ({timeLeft}s)
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            {!isLocked ? (
                              <select
                                value={o.status}
                                onChange={(e) =>
                                  handleStatusChange(o._id, e.target.value)
                                }
                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-black outline-none cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            ) : (
                              <div className="bg-slate-100 px-5 py-2.5 rounded-xl text-[10px] font-black text-slate-400 border border-slate-200 uppercase flex items-center gap-2">
                                <Lock size={14} /> Static
                              </div>
                            )}
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="p-3 bg-blue-600 text-white rounded-xl hover:scale-110 shadow-xl"
                            >
                              <Eye size={18} />
                            </button>
                            {canShip && (
                              <button
                                onClick={() =>
                                  toast.success(
                                    "Opening Shipment Assignment...",
                                  )
                                }
                                className="p-3 bg-emerald-600 text-white rounded-xl hover:scale-110 shadow-xl flex items-center gap-1"
                              >
                                <Truck size={18} />{" "}
                                <span className="text-[9px] font-black">
                                  SHIP
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col h-[85vh]"
            >
              <div className="p-8 bg-slate-950 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">
                    Order Specification Master
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Identity: {selectedOrder._id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-3 bg-white/10 rounded-2xl hover:bg-white/20"
                >
                  <X />
                </button>
              </div>

              <div className="p-10 overflow-y-auto space-y-10 text-left">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 flex items-center gap-2">
                      <User size={14} /> User Info
                    </h4>
                    <p className="font-black text-sm">
                      {selectedOrder.user?.name}
                    </p>
                    <p className="text-[11px] font-black text-blue-600 mt-2">
                      {selectedOrder.user?.phone}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 flex items-center gap-2">
                      <MapPin size={14} /> {selectedOrder.deliveryMode} Info
                    </h4>
                    {selectedOrder.deliveryMode === "Delivery" ? (
                      <p className="text-[10px] font-bold leading-relaxed">
                        {selectedOrder.shippingAddress?.street},{" "}
                        {selectedOrder.shippingAddress?.city},{" "}
                        {selectedOrder.shippingAddress?.pincode}
                      </p>
                    ) : (
                      <p className="text-[10px] font-bold uppercase italic">
                        Pickup: {selectedOrder.pickupDetails?.name || "Self"}
                      </p>
                    )}
                  </div>
                  <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                    <h4 className="text-[10px] font-black uppercase text-blue-400 mb-4 flex items-center gap-2">
                      <CreditCard size={14} /> Settlement
                    </h4>
                    <p className="text-2xl font-black text-blue-700">
                      ₹{selectedOrder.totalAmount}
                    </p>
                    <p className="text-[9px] font-bold uppercase text-blue-400 mt-1">
                      {selectedOrder.paymentStatus} /{" "}
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <h4 className="text-[11px] font-black uppercase text-slate-400 mb-6 border-b pb-3 flex items-center gap-2">
                    <FileText size={16} /> Specs Matrix
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">
                        Service
                      </p>
                      <p className="font-bold text-xs uppercase">
                        {selectedOrder.serviceType}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">
                        Print & Size
                      </p>
                      <p className="font-bold text-xs uppercase">
                        {selectedOrder.details?.printType} (
                        {selectedOrder.details?.size})
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">
                        Orientation
                      </p>
                      <p className="font-bold text-xs uppercase">
                        {selectedOrder.details?.orientation || "Auto"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">
                        Lamination
                      </p>
                      <p className="font-bold text-xs uppercase">
                        {selectedOrder.details?.lamination || "None"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">
                        Binding / Cover
                      </p>
                      <p className="font-bold text-xs uppercase">
                        {selectedOrder.details?.binding || "No"} /{" "}
                        {selectedOrder.details?.cover || "No"}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-[9px] font-black text-slate-400 uppercase">
                        Instructions
                      </p>
                      <p className="font-bold text-[10px] italic">
                        {selectedOrder.details?.instructions ||
                          "Standard processing"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <Hash size={16} /> Source Documentation
                    </h4>
                    {!selectedOrder.filesDeleted && (
                      <button
                        onClick={() => handleZipDownload(selectedOrder._id)}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl shadow-blue-200"
                      >
                        <Download size={14} /> Download All (ZIP)
                      </button>
                    )}
                  </div>
                  <div className="grid gap-4">
                    {selectedOrder.filesDeleted ? (
                      <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-3 text-red-600">
                        <AlertTriangle size={20} />
                        <p className="text-[10px] font-black uppercase tracking-widest">
                          Assets purged by security policy (48h). Meta-data
                          preserved.
                        </p>
                      </div>
                    ) : (
                      (selectedOrder.files || []).map((f, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-white p-6 rounded-[1.8rem] border border-slate-100"
                        >
                          <span className="text-xs font-black text-slate-700 italic truncate max-w-[500px]">
                            {f.name}
                          </span>
                          <a
                            href={`${API_BASE_URL}${f.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-3 bg-blue-600 text-white rounded-xl hover:scale-110 shadow-xl"
                          >
                            <Download size={18} />
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
