import React, { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Receipt,
  CreditCard,
  CheckCircle2,
  XCircle,
  Calendar,
  ShieldCheck,
  Search,
} from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/admin/orders?limit=100");
        setPayments(data.orders || []);
      } catch (e) {
        toast.error("Payments load failed");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(
    (p) =>
      p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.paymentId &&
        p.paymentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.razorpayOrderId &&
        p.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-black uppercase tracking-[0.2em]">
          {" "}
          Loading Ledger...{" "}
        </p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-cyan-400" size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              {" "}
              Financial Records{" "}
            </span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {" "}
            Revenue Ledger{" "}
          </h2>
        </div>
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Trans. ID..."
            className="bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-full md:w-80 transition-all placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                  Transaction ID
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                  Customer
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                  Amount
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                  Channel
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                  Status
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPayments.map((p) => (
                <tr
                  key={p._id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-white/5 text-slate-400 group-hover:text-blue-400 transition-colors">
                        <Receipt size={18} />
                      </div>
                      <span className="font-mono text-xs font-bold text-blue-400/80 tracking-tight">
                        {p.paymentId || p.razorpayOrderId || "CASH_ORDER"}
                        <div className="text-[9px] text-slate-600 mt-0.5">
                          ORD: #{p._id.slice(-6)}
                        </div>
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-[10px] font-black border border-blue-500/20">
                        {p.user?.name?.charAt(0) || "U"}
                      </div>
                      <span className="font-bold text-slate-200">
                        {" "}
                        {p.user?.name || "Unknown"}{" "}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="text-lg font-black text-white tracking-tighter">
                      {" "}
                      ₹{p.totalAmount}{" "}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <CreditCard size={14} className="text-slate-600" />{" "}
                      {p.paymentMethod}
                    </div>
                  </td>
                  <td className="p-6">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        p.paymentStatus === "Paid"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                    >
                      {p.paymentStatus === "Paid" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {p.paymentStatus}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                        <Calendar size={12} className="text-slate-600" />{" "}
                        {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] font-medium text-slate-500">
                        {new Date(p.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayments.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold italic">
                {" "}
                No transaction records.{" "}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
