import React from "react";
import { motion } from "framer-motion";
import { Printer } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center py-16 space-y-6">
      <div className="relative w-20 h-20">
        {/* 1. Outer Rotating Ring */}
        <motion.div
          className="absolute inset-0 border-4 border-slate-800 rounded-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* 2. Inner Spinning Gradient Ring */}
        <motion.div
          className="absolute inset-0 border-t-4 border-cyan-500 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* 3. Center Icon with Pulse */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-slate-400"
          animate={{ scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Printer size={28} />
        </motion.div>

        {/* 4. Scanning Line Effect */}
        <motion.div
          className="absolute left-1 right-1 h-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-10"
          animate={{
            top: ["10%", "90%", "10%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <motion.p
          className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.3em]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Processing Documents
        </motion.p>
        <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-1">
          Please wait a moment...
        </p>
      </div>
    </div>
  );
}
