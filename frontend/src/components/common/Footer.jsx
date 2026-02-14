import React from "react";
import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiPhone,
  FiMail,
  FiMapPin,
  FiEye,
  FiCheckCircle,
  FiTruck,
  FiRefreshCw,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-[#0f172a] text-gray-100 overflow-hidden md:rounded-t-[80px] text-[11px] md:text-base">
      {/* 1. FEATURES SECTION */}
      <section className="py-6 md:py-20 border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-16 text-center px-4">
          <div className="flex flex-col items-center group">
            <div className="bg-blue-600 p-4 md:p-8 rounded-[25px] md:rounded-[35px] mb-3 md:mb-6 shadow-2xl group-hover:scale-110 transition duration-500">
              <FiCheckCircle size={25} className="md:w-5 md:h-5" />
            </div>
            <p className="font-black uppercase text-[10px] md:text-xs tracking-[0.3em]">
              Premium Quality
            </p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="bg-emerald-500 p-4 md:p-8 rounded-[25px] md:rounded-[35px] mb-3 md:mb-6 shadow-2xl group-hover:scale-110 transition duration-500">
              <FiTruck size={25} className="md:w-5 md:h-5" />
            </div>
            <p className="font-black uppercase text-[10px] md:text-xs tracking-[0.3em]">
              Free Delivery
            </p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="bg-orange-500 p-4 md:p-8 rounded-[25px] md:rounded-[35px] mb-3 md:mb-6 shadow-2xl group-hover:scale-110 transition duration-500">
              <FiRefreshCw size={25} className="md:w-5 md:h-5" />
            </div>
            <p className="font-black uppercase text-[10px] md:text-xs tracking-[0.3em]">
              30 Days Return
            </p>
          </div>
        </div>
      </section>

      {/* Background Animated Glows (UNCHANGED) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-40 left-0 w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-blue-500 rounded-full blur-[120px] animate-float"></div>
        <div
          className="absolute bottom-0 right-0 w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-indigo-500 rounded-full blur-[120px] animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-20 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-16 mb-10 md:mb-20">
          {/* Brand Info */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-tighter">
              Jumbo Xerox
            </h3>

            <p className="text-gray-400 text-xs md:text-sm leading-relaxed text-justify">
              Guntur's premier digital print destination. Whether you are a
              student or a professional, we deliver quality prints right to your
              doorstep.
            </p>

            <div className="flex gap-3 md:gap-4">
              {[FiFacebook, FiTwitter, FiInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 md:w-12 md:h-12 rounded-2xl bg-gray-800/50 flex items-center justify-center hover:bg-blue-600 transition-all border border-gray-700 shadow-xl"
                >
                  <Icon size={16} />
                </a>
              ))}
              <a
                href="https://wa.me/919441081125"
                className="w-9 h-9 md:w-12 md:h-12 rounded-2xl bg-gray-800/50 flex items-center justify-center hover:bg-green-600 transition-all border border-gray-700 shadow-xl"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs md:text-sm mb-6 md:mb-8 border-l-4 border-blue-500 pl-3">
              Quick Links
            </h4>

            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm text-gray-400 font-medium">
              {[
                { name: "Home", path: "/" },
                { name: "Quick Prints", path: "/quick-print" },
                { name: "Business Cards", path: "/business-card" },
                { name: "Plan Printing", path: "/plan-printing" },
                { name: "Track Order", path: "/dashboard" },
              ].map((l) => (
                <li key={l.name}>
                  <Link
                    to={l.path}
                    className="hover:text-blue-400 transition-all hover:pl-2"
                  >
                    -- {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs md:text-sm mb-6 md:mb-8 border-l-4 border-emerald-500 pl-3">
              Support
            </h4>

            <ul className="space-y-4 md:space-y-5 text-xs md:text-sm text-gray-400">
              <li className="flex items-center gap-3 md:gap-4 group">
                <FiPhone size={16} />
                +91 9441081125
              </li>

              <li className="flex items-center gap-3 md:gap-4 group">
                <FiMail size={16} />
                info@jumboxerox.com
              </li>

              <li className="flex items-start gap-3 md:gap-4 group">
                <FiMapPin size={16} className="mt-1" />
                <span>
                  9th Line, Arundulpet,
                  <br />
                  Guntur, AP - 522001
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs md:text-sm mb-6 md:mb-8 border-l-4 border-purple-500 pl-3">
              Legal
            </h4>

            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm text-gray-400 font-medium">
              {[
                "About Us",
                "Privacy Policy",
                "Refund Policy",
                "Terms & Conditions",
              ].map((l) => (
                <li key={l}>
                  <Link
                    to="#"
                    className="hover:text-purple-400 transition-all hover:pl-2"
                  >
                    -- {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar (UNCHANGED CONTENT) */}
        <div className="pt-6 md:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
          <p className="text-gray-500 text-[9px] md:text-xs font-bold uppercase tracking-widest text-center md:text-left">
            © 2026 New Cyber Shoppee Jumbo Xerox. All Rights Reserved.
          </p>

          <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl animate-pulse-glow">
            <FiEye className="text-blue-400" size={16} />
            <span className="text-gray-400 text-[10px] md:text-xs font-black uppercase">
              Visitors:
            </span>
            <strong className="text-blue-400 text-base md:text-lg font-black shimmer-text">
              664
            </strong>
          </div>

          <p className="text-[8px] md:text-[10px] text-gray-600 font-black uppercase tracking-widest text-center md:text-right">
            Designed by WebnApp Studio
          </p>
        </div>
      </div>
    </footer>
  );
}
