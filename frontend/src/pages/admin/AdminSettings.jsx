import api from "../../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Trash2, DollarSign, ShieldAlert, Settings2, Zap } from "lucide-react";

export default function AdminSettings() {
  const handleCleanup = async () => {
    if (
      window.confirm(
        "Are you sure? Payment avvani 48hrs patha files anni delete avthayi."
      )
    ) {
      try {
        await api.delete("/admin/cleanup-unpaid");
        toast.success("Cleanup successful!");
      } catch (e) {
        toast.error("Cleanup failed");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-8"
    >
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          System Settings
        </h1>
        <p className="text-slate-500">
          Configure global rules and manage server resources.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Storage Cleanup Section */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Trash2 size={120} />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500/20 p-3 rounded-2xl text-red-500 border border-red-500/20">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">
              Storage & Maintenance
            </h3>
          </div>

          <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-xl">
            Clean up temporary PDF files that haven't been paid for within 48
            hours. This action will free up server space and cannot be undone.
          </p>

          <button
            onClick={handleCleanup}
            className="bg-red-600 hover:bg-red-500 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-900/20"
          >
            Purge Unpaid Files (48h)
          </button>
        </div>

        {/* Pricing Rules Section */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl opacity-60 relative">
          <div className="absolute top-4 right-8 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20">
            Coming Soon
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600/20 p-3 rounded-2xl text-blue-400 border border-blue-500/20">
              <DollarSign size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">
              Dynamic Pricing Rules
            </h3>
          </div>

          <p className="text-slate-500 text-sm mb-8">
            Manage per-page costs, color rates, and binding charges directly
            from here.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex justify-between items-center">
              <span className="text-slate-500 font-bold text-xs uppercase">
                B&W Rate
              </span>
              <span className="text-slate-400 font-mono">₹2.00</span>
            </div>
            <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex justify-between items-center">
              <span className="text-slate-500 font-bold text-xs uppercase">
                Color Rate
              </span>
              <span className="text-slate-400 font-mono">₹10.00</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
