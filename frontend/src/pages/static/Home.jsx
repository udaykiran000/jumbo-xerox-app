import React from "react";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiTruck,
  FiRefreshCw,
  FiPhone,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { motion } from "framer-motion"; 

// --- Swiper (For Decoratives) ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// --- IMAGE IMPORTS ---
import h1 from "../../assets/1.jpg";
import h2 from "../../assets/2.jpg";
import h3 from "../../assets/3.jpg";
import h4 from "../../assets/4.jpg";
import h5 from "../../assets/5.jpg";
import h6 from "../../assets/6.jpg";
import h7 from "../../assets/7.jpg";

import catA4 from "../../assets/a4.jpg";
import catPlan from "../../assets/Plan-Printing.jpg";
import catFlyer from "../../assets/flyers.jpg";
import catBcard from "../../assets/bcard.jpg";
import catSticker from "../../assets/poster.jpg";

import biz1 from "../../assets/prescription-pads.webp";
import biz2 from "../../assets/bill-books.webp";
import biz3 from "../../assets/letterheads.webp";
import biz4 from "../../assets/cash-receipts.webp";
import biz5 from "../../assets/vouchers.webp";
import biz6 from "../../assets/envelopes.webp";
import biz7 from "../../assets/mouse-pads.webp";
import biz8 from "../../assets/keychains.webp";
import biz9 from "../../assets/metal.webp";
import biz10 from "../../assets/name-pencils.webp";

import s1 from "../../assets/slide1.webp";
import s2 from "../../assets/slide2.webp";
import s3 from "../../assets/slide3.webp";
import s4 from "../../assets/slide4.jpg";
import s5 from "../../assets/slide5.webp";
import s6 from "../../assets/slide6.webp";

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "backOut" } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "backOut" } }
};

const slideInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "backOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

const maskedReveal = {
  hidden: { y: "100%" },
  visible: { y: "0%", transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } }
};

const MaskedHeading = ({ children, className }) => (
  <div className="overflow-hidden relative inline-block">
    <motion.h2 variants={maskedReveal} className={className}>
      {children}
    </motion.h2>
  </div>
);

const Home = () => {
  const heroImages = [h1, h2, h3, h4, h5, h6, h7];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-700 overflow-x-hidden relative">
      
      {/* --- FLOATING BACKGROUND BLOBS --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ y: [0, -50, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[-100px] w-96 h-96 bg-blue-100/40 rounded-full blur-3xl mix-blend-multiply"
        />
        <motion.div 
          animate={{ y: [0, 50, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-40 right-[-100px] w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl mix-blend-multiply"
        />
      </div>

      {/* HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[220px] sm:h-[350px] md:h-[550px] bg-slate-900 overflow-hidden z-10"
      >
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={true}
          loop={true}
          speed={1000}
          className="h-full w-full hero-swiper"
        >
          {heroImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.section>

      {/* TICKER */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="bg-blue-700 text-white py-4 overflow-hidden shadow-xl z-30 relative border-b border-blue-800"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6">
          <div className="flex-shrink-0 font-black text-sm italic tracking-tighter bg-white/20 px-4 py-1.5 rounded-lg border border-white/10">
            📢 ANNOUNCEMENTS:
          </div>
          <div className="flex-grow overflow-hidden relative h-6 flex items-center">
            <div className="flex gap-16 animate-marquee whitespace-nowrap absolute text-[11px] font-extrabold uppercase tracking-wide">
              <span>✨ FAST TURNAROUND TIME - GET YOUR PRINTS IN 24 HOURS!</span>
              <span>🎁 FIRST-TIME USERS GET 10% OFF ON ALL ORDERS!</span>
              <span>📦 FREE SHIPPING ON BULK ORDERS ABOVE ₹2000!</span>
              <span>✨ FAST TURNAROUND TIME - GET YOUR PRINTS IN 24 HOURS!</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CATEGORIES */}
      <section className="py-10 md:py-20 px-4 max-w-7xl mx-auto text-center relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <MaskedHeading className="text-3xl md:text-4xl font-black mb-2 text-slate-800 uppercase tracking-tighter">
            Our Categories
          </MaskedHeading>
          <motion.p variants={fadeInUp} className="text-slate-400 mb-10 md:mb-16 font-bold text-xs uppercase tracking-widest">
            Choose what you need to print
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {[
            { n: "Document Print A4", i: catA4 },
            { n: "Plan Printing", i: catPlan },
            { n: "Flyers", i: catFlyer },
            { n: "Business Cards", i: catBcard },
            { n: "Sticker Printing", i: catSticker },
          ].map((cat, i) => (
            <motion.div key={i} variants={scaleIn} whileHover={{ y: -10 }} className="flex flex-col items-center group cursor-pointer">
              <div className="w-28 h-28 md:w-48 md:h-48 rounded-full overflow-hidden border-[4px] border-slate-50 shadow-2xl relative">
                <img src={cat.i} alt={cat.n} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <p className="mt-4 font-black text-[10px] md:text-xs text-slate-700 uppercase tracking-tighter group-hover:text-indigo-600">
                {cat.n}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* INFO GRID */}
      <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 shadow-sm border-y border-slate-50 gap-4 relative z-10 bg-white/80 backdrop-blur-sm">
        <motion.div initial="hidden" whileInView="visible" variants={slideInLeft} className="bg-indigo-50/50 p-6 flex items-center gap-5 rounded-xl">
          <FiMapPin className="text-indigo-600 w-8 h-8" />
          <div>
            <p className="text-[11px] font-black text-indigo-900 uppercase">Store Pickup</p>
            <p className="text-xs text-slate-500 mt-1">Available only at Guntur Branch</p>
          </div>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" variants={slideInUp} className="bg-yellow-50/50 p-6 flex items-center gap-5 rounded-xl">
          <FiPhone className="text-yellow-600 w-8 h-8" />
          <div>
            <p className="text-[11px] font-black text-yellow-900 uppercase">Bulk Orders</p>
            <p className="text-xs text-slate-500 mt-1">+91 9441081125</p>
          </div>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" variants={slideInRight} className="bg-emerald-50/50 p-6 flex items-center gap-5 rounded-xl">
          <FiMail className="text-emerald-600 w-8 h-8" />
          <div>
            <p className="text-[11px] font-black text-emerald-900 uppercase">Order Related</p>
            <p className="text-xs text-slate-500 mt-1">info@jumboxerox.com</p>
          </div>
        </motion.div>
      </section>

      {/* BUSINESS NEEDS */}
      <section className="py-10 md:py-24 bg-slate-50/50 px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <MaskedHeading className="text-3xl md:text-4xl font-black mb-10 uppercase tracking-[0.2em] text-slate-800">
            Business Needs
          </MaskedHeading>
          <motion.div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6" initial="hidden" whileInView="visible" variants={staggerContainer}>
            {[
              { n: "Prescription Pads", i: biz1 }, { n: "Bill Books", i: biz2 },
              { n: "Letterheads", i: biz3 }, { n: "Cash Receipts", i: biz4 },
              { n: "Payment Vouchers", i: biz5 }, { n: "Envelopes", i: biz6 },
              { n: "Mousepads", i: biz7 }, { n: "Pen & Keychain", i: biz8 },
              { n: "Metal Pens", i: biz9 }, { n: "Name Pencils", i: biz10 },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 group cursor-pointer">
                <div className="h-32 md:h-44 bg-slate-50 rounded-xl mb-4 overflow-hidden">
                  <img src={item.i} alt={item.n} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <p className="font-bold text-[10px] uppercase text-slate-600 group-hover:text-blue-600">{item.n}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* DECORATIVES */}
      <section className="py-10 md:py-24 bg-white px-4 border-t border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto">
          <MaskedHeading className="text-3xl md:text-4xl font-black text-center mb-10 uppercase tracking-[0.2em] text-slate-800">
            Home Decoratives
          </MaskedHeading>
          <Swiper
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 3000 }}
            navigation={true}
            loop={true}
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="decor-swiper pb-10"
          >
            {[s1, s2, s3, s4, s5, s6].map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden group">
                  <div className="h-48 md:h-64 overflow-hidden">
                    <img src={img} alt="decor" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default Home;
