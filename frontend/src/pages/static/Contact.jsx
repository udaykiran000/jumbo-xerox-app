import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageSquare,
  Clock,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

const Contact = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form logic here
    alert("Message sent! (Mockup)");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-24 px-6 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] -z-10" />

      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Touch
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Have a question about your order or our services? We're here to
            help. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left Column: Contact Info Cards (2/5 width) */}
          <div className="lg:col-span-2 space-y-6">
            <ContactCard
              icon={<MapPin className="text-blue-400" />}
              title="Our Location"
              content="Jumbo Xerox, Main Road, Beside University Campus, Your City, 500001"
            />
            <ContactCard
              icon={<Phone className="text-emerald-400" />}
              title="Phone Support"
              content="+91 98765 43210"
              subContent="Mon-Sat, 9am - 8pm"
            />
            <ContactCard
              icon={<Mail className="text-cyan-400" />}
              title="Email Us"
              content="support@jumbo-xerox.com"
              subContent="We usually reply within 2 hours."
            />

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="p-8 rounded-[2rem] bg-white/5 border border-white/10"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">
                Follow Us
              </h3>
              <div className="flex gap-4">
                <SocialIcon icon={<Instagram size={20} />} />
                <SocialIcon icon={<Twitter size={20} />} />
                <SocialIcon icon={<Linkedin size={20} />} />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form (3/5 width) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 bg-white/5 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                <MessageSquare size={24} />
              </div>
              <h2 className="text-2xl font-bold">Send a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                  How can we help?
                </label>
                <textarea
                  placeholder="Tell us about your requirements..."
                  rows="5"
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-all"
              >
                <Send size={20} />
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

/* --- Sub-Components --- */

const ContactCard = ({ icon, title, content, subContent }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    }}
    whileHover={{ x: 10 }}
    className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 transition-all group"
  >
    <div className="flex items-start gap-5">
      <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 group-hover:border-blue-500/50 transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-1">
          {title}
        </h3>
        <p className="text-lg font-bold text-slate-200 mb-1">{content}</p>
        {subContent && (
          <p className="text-sm text-slate-500 font-medium">{subContent}</p>
        )}
      </div>
    </div>
  </motion.div>
);

const SocialIcon = ({ icon }) => (
  <motion.a
    href="#"
    whileHover={{ y: -5 }}
    className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all border border-white/5"
  >
    {icon}
  </motion.a>
);

export default Contact;
