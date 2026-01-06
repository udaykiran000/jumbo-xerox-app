import React, { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Clock,
  MoreHorizontal,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  Truck,
  Store,
  X,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- UNDO TIMER STATES ---
  const [countingOrderId, setCountingOrderId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pendingStatus, setPendingStatus] = useState("");
  const timerRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  // Timer Logic: Every second decrement
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && countingOrderId) {
      commitStatusChange(countingOrderId, pendingStatus);
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, countingOrderId]);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/admin/orders?page=${page}&limit=${limit}`
      );
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (e) {
      toast.error("Orders load failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = (id, newStatus) => {
    // If selecting the same status, do nothing
    const order = orders.find((o) => o._id === id);
    if (order.status === newStatus) return;

    if (newStatus === "Completed" || newStatus === "Cancelled") {
      setCountingOrderId(id);
      setPendingStatus(newStatus);
      setTimeLeft(7); // 7 seconds buffer
    } else {
      commitStatusChange(id, newStatus);
    }
  };

  const cancelCountdown = () => {
    clearTimeout(timerRef.current);
    setCountingOrderId(null);
    setTimeLeft(0);
    setPendingStatus("");
    toast.success("Action Undone", { icon: "🔄" });
  };

  const commitStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/order/${id}`, { status });
      toast.success(`Order marked as ${status}`);
      setCountingOrderId(null);
      setTimeLeft(0);
      fetchOrders(currentPage);
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
      setCountingOrderId(null);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o._id.includes(searchTerm)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8 space-y-6 min-h-screen"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic">
            JUMBO <span className="text-blue-500">ORDERS</span>
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
            Live Printing Dashboard
          </p>
        </div>
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Customer / Order ID..."
            className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-96 backdrop-blur-md transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  Customer & Info
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  Mode
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">
                  Amount
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  Status Management
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-slate-500 animate-pulse font-bold"
                  >
                    Fetching Live Data...
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const isLocked =
                    o.status === "Completed" || o.status === "Cancelled";
                  const isBeingProcessed = countingOrderId === o._id;

                  return (
                    <tr
                      key={o._id}
                      className="group hover:bg-white/[0.02] transition-all"
                    >
                      {/* CUSTOMER CELL */}
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 border border-white/10 shadow-inner">
                            <User size={22} />
                          </div>
                          <div>
                            <div className="font-black text-white text-base leading-none mb-1">
                              {o.user?.name || "Unknown"}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono tracking-tighter">
                              #{o._id.slice(-8).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* MODE CELL */}
                      <td className="p-6">
                        {o.deliveryMode === "Delivery" ? (
                          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 bg-purple-400/10 w-fit px-3 py-1.5 rounded-full border border-purple-400/20">
                            <Truck size={14} /> Delivery
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 bg-orange-400/10 w-fit px-3 py-1.5 rounded-full border border-orange-400/20">
                            <Store size={14} /> Pickup
                          </div>
                        )}
                      </td>

                      {/* AMOUNT CELL */}
                      <td className="p-6 text-center">
                        <div className="text-xl font-black text-white tracking-tighter">
                          ₹{o.totalAmount}
                        </div>
                        <div
                          className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                            o.paymentStatus === "Paid"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {o.paymentStatus}
                        </div>
                      </td>

                      {/* STATUS LOGIC CELL */}
                      <td className="p-6 min-w-[240px]">
                        {isBeingProcessed ? (
                          // 1. TIMER UI
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-3 bg-blue-600/10 border border-blue-500/30 p-2 rounded-2xl"
                          >
                            <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
                              <svg className="w-full h-full -rotate-90">
                                <circle
                                  cx="20"
                                  cy="20"
                                  r="17"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  fill="transparent"
                                  className="text-white/5"
                                />
                                <circle
                                  cx="20"
                                  cy="20"
                                  r="17"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  fill="transparent"
                                  strokeDasharray="107"
                                  strokeDashoffset={107 - (107 * timeLeft) / 7}
                                  className="text-blue-400 transition-all duration-1000"
                                />
                              </svg>
                              <span className="absolute text-[11px] font-black text-white">
                                {timeLeft}
                              </span>
                            </div>
                            <button
                              onClick={cancelCountdown}
                              className="flex-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                            >
                              <RotateCcw size={14} /> UNDO ACTION
                            </button>
                          </motion.div>
                        ) : isLocked ? (
                          // 2. LOCKED STATE
                          <div
                            className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${
                              o.status === "Completed"
                                ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                                : "bg-red-500/5 text-red-500 border-red-500/20"
                            }`}
                          >
                            <div className="flex items-center gap-2 text-[11px] font-black uppercase">
                              {o.status === "Completed" ? (
                                <CheckCircle2 size={16} />
                              ) : (
                                <AlertCircle size={16} />
                              )}
                              {o.status}
                            </div>
                            <Lock size={14} className="opacity-30" />
                          </div>
                        ) : (
                          // 3. EDITABLE DROPDOWN
                          <div className="relative group/sel">
                            <select
                              value={o.status}
                              onChange={(e) =>
                                handleStatusClick(o._id, e.target.value)
                              }
                              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-white appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/50 hover:bg-slate-800 transition-all"
                            >
                              <option value="Pending">🕒 Pending</option>
                              <option value="Processing">⚙️ Processing</option>
                              <option value="Completed">✅ Completed</option>
                              <option value="Cancelled">❌ Cancelled</option>
                            </select>
                            <Clock
                              size={16}
                              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover/sel:text-blue-400 transition-colors"
                            />
                          </div>
                        )}
                      </td>

                      {/* MORE ACTION CELL */}
                      <td className="p-6 text-center">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-3 bg-white/5 hover:bg-blue-600 text-slate-400 hover:text-white rounded-2xl border border-white/10 transition-all active:scale-90"
                        >
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-4 py-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="p-3 bg-white/5 rounded-xl border border-white/10 disabled:opacity-30 text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="p-3 bg-white/5 rounded-xl border border-white/10 disabled:opacity-30 text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ORDER DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
                <div>
                  <h3 className="text-2xl font-black text-white leading-none mb-2">
                    Order Summary
                  </h3>
                  <p className="text-slate-500 text-[10px] font-mono uppercase tracking-tighter">
                    Transaction Hash: {selectedOrder._id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2.5 bg-white/5 rounded-full hover:bg-red-500 transition-all"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-[0.2em]">
                      Customer Files
                    </h4>
                    <div className="grid gap-3">
                      {selectedOrder.files.map((file, i) => {
                        const isFinal =
                          selectedOrder.status === "Completed" ||
                          selectedOrder.status === "Cancelled";
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500/10 rounded-lg">
                                <FileText size={18} className="text-blue-400" />
                              </div>
                              <span className="text-sm font-bold text-slate-200 truncate max-w-[240px]">
                                {file.name}
                              </span>
                            </div>
                            {!isFinal ? (
                              <a
                                href={`${BASE_URL.replace(
                                  "/api",
                                  ""
                                )}/uploads/${file.url.split("/").pop()}`}
                                download={file.name}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl transition-all shadow-lg"
                              >
                                <Download size={14} /> DOWNLOAD
                              </a>
                            ) : (
                              <div className="text-[10px] font-black text-red-400/50 bg-red-400/5 px-3 py-1.5 rounded-lg border border-red-400/10">
                                FILE ARCHIVED
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
