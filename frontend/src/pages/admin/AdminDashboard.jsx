import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Users,
  ShoppingBag,
  IndianRupee,
  Activity,
  TrendingUp,
  HardDrive,
  LayoutDashboard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserPlus,
  ShoppingCart,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    todayReg: 0,
    todayOrders: { total: 0, completed: 0, pending: 0 },
    todayRev: 0,
    disk: {
      free: "0 GB",
      used: "0 GB",
      total: "0 GB",
      percentFree: "0%",
      uploadsSize: "0 MB",
      isLowSpace: false,
    },
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDiskTheme = (isLow) =>
    isLow
      ? "text-red-400 border-red-500/30 bg-red-500/10"
      : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading)
    return (
      <div className="p-10 flex justify-center text-slate-500 font-bold uppercase tracking-widest">
        <Activity className="animate-spin mr-2" /> Loading...
      </div>
    );

  return (
    <div className="p-4 md:p-8 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="text-blue-400" size={18} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Live Control Center
            </p>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Dashboard</h1>
        </div>
        {stats.disk && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/admin/settings")}
            className={`cursor-pointer p-5 rounded-[2rem] border transition-all flex items-center gap-5 ${getDiskTheme(
              stats.disk.isLowSpace
            )} shadow-2xl`}
          >
            <div className="p-3 bg-white/5 rounded-2xl">
              {stats.disk.isLowSpace ? (
                <AlertTriangle size={24} className="animate-pulse" />
              ) : (
                <HardDrive size={24} />
              )}
            </div>
            <div className="flex flex-col gap-1 w-full min-w-[200px]">
              <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-70">
                <p>Uploads Folder</p> <p>System Free</p>
              </div>
              <div className="flex justify-between items-baseline">
                <p className="text-xl font-black">{stats.disk.uploadsSize}</p>
                <p className="text-sm font-bold opacity-80">
                  {stats.disk.free}
                </p>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden flex">
                <div
                  className={`h-full rounded-full ${
                    stats.disk.isLowSpace ? "bg-red-500" : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${100 - parseFloat(stats.disk.percentFree)}%`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Total Customers",
            value: stats.totalUsers,
            subtext: `+${stats.todayReg} New Today`,
            icon: <Users size={20} />,
            color: "blue",
          },
          {
            title: "Today's Orders",
            value: stats.todayOrders?.total || 0,
            subtext: (
              <div className="flex gap-2 text-[10px] mt-1">
                <span className="flex items-center text-emerald-400 gap-1">
                  <CheckCircle2 size={10} /> {stats.todayOrders?.completed} Done
                </span>
                <span className="flex items-center text-yellow-400 gap-1">
                  <Clock size={10} /> {stats.todayOrders?.pending} Pending
                </span>
              </div>
            ),
            icon: <ShoppingBag size={20} />,
            color: "indigo",
          },
          {
            title: "Daily Revenue",
            value: `₹${stats.todayRev}`,
            subtext: "Updated in real-time",
            icon: <IndianRupee size={20} />,
            color: "orange",
          },
        ].map((c, i) => (
          <div
            key={i}
            className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/[0.07] transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 text-white group-hover:scale-110 transition-transform">
                {c.icon}
              </div>
              <TrendingUp
                size={16}
                className={`text-${c.color}-500 opacity-50`}
              />
            </div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">
              {c.title}
            </p>
            <h3 className="text-4xl font-black tracking-tighter mb-2">
              {c.value}
            </h3>
            <div className="text-slate-400">{c.subtext}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl">
        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
          <Activity size={20} className="text-blue-400" /> Recent Activity Feed
        </h3>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {stats.recentActivity &&
            stats.recentActivity.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors"
              >
                <div
                  className={`p-3 rounded-xl ${
                    item.type === "order"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-purple-500/10 text-purple-400"
                  }`}
                >
                  {item.type === "order" ? (
                    <ShoppingCart size={18} />
                  ) : (
                    <UserPlus size={18} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-200">
                    {item.type === "order"
                      ? `${item.user?.name || "Unknown"} placed an order`
                      : `${item.name} joined Jumbo Xerox`}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {item.type === "order"
                      ? `₹${item.totalAmount} • ${item.paymentMethod} • ${item.files.length} Files`
                      : `Email: ${item.email}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    {formatTime(item.activityTime)}
                  </p>
                  {item.type === "order" && (
                    <button
                      onClick={() => navigate("/admin/orders")}
                      className="text-[10px] text-blue-400 hover:underline mt-1"
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            ))}
          {(!stats.recentActivity || stats.recentActivity.length === 0) && (
            <p className="text-center text-slate-500 italic">
              No recent activity.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
