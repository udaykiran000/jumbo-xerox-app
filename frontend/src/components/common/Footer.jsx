import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MapPin, Phone, Mail, ChevronRight, Printer } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinkStyle =
    "text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-1 group";

  return (
    <footer className="relative bg-slate-950 border-t border-white/5 pt-20 pb-10 overflow-hidden font-sans">
      {/* Decorative Background Element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* 1. Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
                <Printer size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tighter">
                Jumbo{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Xerox
                </span>
              </h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Revolutionizing online printing with high-quality laser tech and
              lightning-fast delivery. Upload, pay, and relax.
            </p>
            <div className="flex space-x-3">
              <SocialIcon
                href="#"
                icon={<FaWhatsapp />}
                color="hover:bg-green-500/20 hover:text-green-500"
              />
              <SocialIcon
                href="#"
                icon={<FaInstagram />}
                color="hover:bg-pink-500/20 hover:text-pink-500"
              />
              <SocialIcon
                href="#"
                icon={<FaFacebook />}
                color="hover:bg-blue-500/20 hover:text-blue-500"
              />
            </div>
          </motion.div>

          {/* 2. Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link to="/services" className={footerLinkStyle}>
                  <ChevronRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all"
                  />{" "}
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/track" className={footerLinkStyle}>
                  <ChevronRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all"
                  />{" "}
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/quick-print" className={footerLinkStyle}>
                  <ChevronRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all"
                  />{" "}
                  Start Printing
                </Link>
              </li>
              <li>
                <Link to="/login" className={footerLinkStyle}>
                  <ChevronRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all"
                  />{" "}
                  Partner Login
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* 3. Support & Policies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-6">
              Legal
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link to="/terms" className={footerLinkStyle}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={footerLinkStyle}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className={footerLinkStyle}>
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className={footerLinkStyle}>
                  Contact Support
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* 4. Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-6">
              Store Location
            </h3>
            <div className="space-y-4">
              <ContactItem
                icon={<MapPin size={18} />}
                text="Main Road, Guntur, AP - 522002"
              />
              <ContactItem icon={<Phone size={18} />} text="+91 98765 43210" />
              <ContactItem
                icon={<Mail size={18} />}
                text="support@jumbo-xerox.com"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-600">
          <p>© {currentYear} Jumbo Xerox — Digital Printing Reimagined.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">
              Built with ❤️ for Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --- Helper Components --- */

function SocialIcon({ href, icon, color }) {
  return (
    <a
      href={href}
      className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 transition-all duration-300 border border-white/5 ${color} hover:-translate-y-1 hover:shadow-lg`}
    >
      {icon}
    </a>
  );
}

function ContactItem({ icon, text }) {
  return (
    <div className="flex items-start gap-3 group">
      <div className="text-cyan-500 mt-0.5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-slate-400 text-sm leading-snug group-hover:text-slate-200 transition-colors">
        {text}
      </p>
    </div>
  );
}
