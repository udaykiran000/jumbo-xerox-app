import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CloudUpload,
  IndianRupee,
  Truck,
  ArrowRight,
  Printer,
  Star,
  CheckCircle,
  Zap,
} from "lucide-react";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const Home = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans overflow-x-hidden">
      {/* 1. Background Visuals (Blobs) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      {/* 2. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-semibold mb-8 shadow-xl"
          >
            <Zap size={16} className="fill-current" /> Next-Gen Online Printing
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-8xl font-black leading-[1.1] mb-8 tracking-tight"
          >
            Print Anything. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
              Delivered Anywhere.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Join the smart way of printing. Upload documents from your phone,
            choose custom options, and get them delivered to your door.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex justify-center gap-5 flex-wrap"
          >
            <Link
              to="/quick-print"
              className="group relative px-10 py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center gap-2 active:scale-95"
            >
              Start Printing{" "}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              to="/services"
              className="px-10 py-4 rounded-2xl font-bold border border-slate-700 text-slate-200 hover:bg-white/5 transition-all active:scale-95"
            >
              Check Prices
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. Stats Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 py-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white/5 backdrop-blur-md rounded-[3rem] p-10 border border-white/10 shadow-2xl">
          <StatBox number="10k+" label="Pages Printed" />
          <StatBox number="2k+" label="Happy Students" />
          <StatBox number="500+" label="Daily Deliveries" />
          <StatBox number="4.9/5" label="User Rating" />
        </div>
      </motion.section>

      {/* 4. Features Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
            Features You'll Love
          </h2>
          <div className="w-24 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<CloudUpload size={32} className="text-cyan-400" />}
            title="Instant Upload"
            desc="Easily upload PDFs or Word files from WhatsApp or your File Manager."
          />
          <FeatureCard
            icon={<IndianRupee size={32} className="text-emerald-400" />}
            title="Bulk Discounts"
            desc="More pages, less price. Special rates for study materials & notes."
          />
          <FeatureCard
            icon={<Truck size={32} className="text-blue-400" />}
            title="Fast Delivery"
            desc="Get your prints within hours. We deliver to hostels, offices, and homes."
          />
        </motion.div>
      </section>

      {/* 5. Trust Section / Testimonials */}
      <section className="bg-white/[0.02] border-y border-white/5 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                Trusted by thousands of students.
              </h2>
              <div className="space-y-4">
                <TrustItem text="High-Quality Laser Printing" />
                <TrustItem text="Secure Document Handling" />
                <TrustItem text="Easy Order Tracking" />
              </div>
            </motion.div>

            <div className="grid gap-6">
              <TestimonialCard
                name="Rohan Varma"
                role="Engineering Student"
                text="Saved my time during exam submissions! Best online printing service."
              />
              <TestimonialCard
                name="Sneha Reddy"
                role="Project Manager"
                text="Very professional and transparent pricing. Highly recommended."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer Call to Action */}
      <section className="max-w-5xl mx-auto px-6 py-32">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[3rem] p-12 text-center shadow-[0_20px_50px_rgba(37,99,235,0.3)] relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
              Ready to Start?
            </h2>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-700 px-12 py-5 rounded-2xl font-black text-xl hover:shadow-2xl transition-all active:scale-95"
            >
              Create Account — Free
            </Link>
          </div>
          <Printer className="absolute bottom-[-20px] right-[-20px] text-white/10 w-64 h-64 rotate-12" />
        </motion.div>
      </section>

      {/* Footer info */}
      <footer className="py-10 text-center text-slate-500 border-t border-white/5">
        <p>© {new Date().getFullYear()} Jumbo Xerox. All rights reserved.</p>
      </footer>
    </div>
  );
};

/* --- Sub Components --- */

function StatBox({ number, label }) {
  return (
    <div className="text-center">
      <h4 className="text-3xl font-black text-white">{number}</h4>
      <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -12 }}
      className="group bg-white/5 p-10 rounded-[2.5rem] border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-500"
    >
      <div className="mb-6 p-4 bg-slate-900 rounded-2xl inline-block border border-white/5 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-lg">{desc}</p>
    </motion.div>
  );
}

function TrustItem({ text }) {
  return (
    <div className="flex items-center gap-3 text-lg font-medium text-slate-300">
      <CheckCircle className="text-cyan-500" size={24} />
      <span>{text}</span>
    </div>
  );
}

function TestimonialCard({ name, role, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors"
    >
      <div className="flex gap-1 text-yellow-500 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>
      <p className="text-slate-200 italic mb-6 leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-black text-xl shadow-lg">
          {name[0]}
        </div>
        <div>
          <h5 className="font-bold text-slate-100">{name}</h5>
          <p className="text-sm text-slate-500">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;
