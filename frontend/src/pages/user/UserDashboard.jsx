import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  RotateCcw,
  LifeBuoy,
  Upload,
  Moon,
  Sun,
  LogOut,
  ExternalLink,
  Loader2,
} from "lucide-react";
import api from "../../services/api"; // Backend connection
import toast from "react-hot-toast";

export default function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "User",
    email: "N/A",
    phone: "N/A",
  };

  const [theme, setTheme] = useState("dark");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Theme persistence
  useEffect(() => {
    const saved = localStorage.getItem("ui-theme");
    setTheme(saved || "dark");
  }, []);

  // 2. Fetch Orders from Backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("ui-theme", next);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Magnetic Effect Logic
  useEffect(() => {
    const els = document.querySelectorAll(".magnetic");
    const move = (e) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    };
    const leave = (e) => {
      e.currentTarget.style.transform = "translate(0,0)";
    };
    els.forEach((el) => {
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
    });
    return () =>
      els.forEach((el) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
  }, [loading]); // Re-run after loading finished

  const themeClasses =
    theme === "dark"
      ? "bg-slate-950 text-slate-100"
      : "bg-slate-50 text-slate-900";

  return (
    <div
      className={`${themeClasses} p-20 min-h-screen transition-colors duration-500 font-sans`}
    >
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}
        <header
          className={`${
            theme === "dark"
              ? "bg-white/5 border-white/10"
              : "bg-white border-slate-200"
          } backdrop-blur-2xl p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center border shadow-xl gap-4`}
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Hello, {user.name} 👋
            </h1>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Manage your prints and track delivery status
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 transition-all"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 bg-red-500/10 px-5 py-2.5 rounded-xl font-semibold hover:bg-red-500/20 transition-all active:scale-95"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/quick-print")}
            className="magnetic flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all"
          >
            <Upload size={18} /> Upload New
          </button>
          <a
            href="#orders"
            className="magnetic flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all"
          >
            <RotateCcw size={18} /> History
          </a>
          <button className="magnetic flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all">
            <LifeBuoy size={18} /> Support
          </button>
        </div>

        {/* Hero Card */}
        <div className="relative group overflow-hidden rounded-[2.5rem] p-1 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 animate-pulse" />
          <div
            className={`relative ${
              theme === "dark" ? "bg-slate-900/90" : "bg-white/90"
            } backdrop-blur-xl p-8 md:p-12 rounded-[2.4rem] flex flex-col items-start gap-6`}
          >
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                New Print
              </h2>
              <p
                className={`${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                } text-lg max-w-md`}
              >
                Upload your PDF/Docs and get high-quality laser prints
                delivered.
              </p>
            </div>
            <button
              onClick={() => navigate("/quick-print")}
              className="group relative flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            >
              <FileText size={22} />
              Order Now 🖨️
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`${
              theme === "dark" ? "bg-white/5" : "bg-white"
            } p-8 rounded-[2rem] border border-white/10`}
          >
            <p className="text-sm font-medium text-slate-500 uppercase">
              Total Orders
            </p>
            <h3 className="text-3xl font-black mt-2">{orders.length}</h3>
            <p className="text-xs text-slate-500 mt-2 font-medium italic">
              Lifetime printing activity
            </p>
          </div>
          <div
            className={`${
              theme === "dark" ? "bg-white/5" : "bg-white"
            } p-8 rounded-[2rem] border border-white/10`}
          >
            <p className="text-sm font-medium text-slate-500 uppercase">
              Profile Info
            </p>
            <h3 className="text-xl font-bold mt-2 truncate">{user.email}</h3>
            <p className="text-sm text-slate-500">{user.phone}</p>
          </div>
        </div>

        {/* Orders Table */}
        <div
          id="orders"
          className={`${
            theme === "dark" ? "bg-white/5" : "bg-white"
          } backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-xl`}
        >
          <h3 className="text-xl font-bold mb-8">Recent Activity</h3>

          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 className="animate-spin text-cyan-500" size={40} />
              <p className="text-slate-500 animate-pulse">
                Fetching your orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 mb-4 text-lg">
                No orders found yet.
              </p>
              <button
                onClick={() => navigate("/quick-print")}
                className="text-cyan-500 font-bold hover:underline"
              >
                Place your first order!
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-slate-500 uppercase text-[10px] tracking-widest font-bold">
                    <th className="px-4 pb-2">Order ID</th>
                    <th className="px-4 pb-2">File Name</th>
                    <th className="px-4 pb-2">Amount</th>
                    <th className="px-4 pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className={`${
                        theme === "dark"
                          ? "bg-white/5 hover:bg-white/10"
                          : "bg-slate-100 hover:bg-slate-200"
                      } transition-colors group cursor-pointer`}
                    >
                      <td className="p-4 rounded-l-2xl font-mono text-xs opacity-60">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4 font-semibold italic">
                        <a
                          href={order.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 hover:text-cyan-500 transition-colors"
                        >
                          <ExternalLink size={14} />{" "}
                          {order.fileName || "document.pdf"}
                        </a>
                      </td>
                      <td className="p-4 font-bold">₹{order.totalAmount}</td>
                      <td className="p-4 rounded-r-2xl text-right">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter 
                          ${
                            order.status === "Completed"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : order.status === "Processing"
                              ? "bg-cyan-500/20 text-cyan-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
