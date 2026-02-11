import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Loader2,
  ArrowLeft,
  Phone,
  ShieldCheck,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // States
  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [otpValue, setOtpValue] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const timerRef = useRef(null);

  const { name, email, phone, password, confirmPassword } = formData;

  // OTP Timer Logic
  useEffect(() => {
    if (otpTimer > 0) {
      timerRef.current = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [otpTimer]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Request OTP
  const handleRegisterRequest = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords mismatch!");
    if (phone.length < 10) return toast.error("Enter valid 10-digit mobile!");

    setLoading(true);
    try {
      await api.post("/auth/register-request", {
        name,
        email,
        phone,
        password,
      });
      toast.success("Verification code sent!");
      setStep(2);
      setOtpTimer(60);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Verification trigger failed",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Final Verify & Create Account
  const handleFinalizeRegister = async () => {
    if (otpValue.length < 6) return toast.error("Enter 6-digit code");

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register-verify", {
        ...formData,
        otp: otpValue,
      });
      toast.success("Identity Verified. Welcome!");
      login(data.token); // Auto-login using AuthContext
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-20 relative overflow-hidden font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 text-sm font-black uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="bg-white/5 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-10">
                  <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
                    <UserPlus size={32} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter mb-2 italic">
                    CREATE ACCOUNT
                  </h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Join the Jumbo Network
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleRegisterRequest}>
                  <InputGroup
                    label="Full Identity"
                    icon={<User size={18} />}
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Full Name"
                  />
                  <InputGroup
                    label="Email Stream"
                    icon={<Mail size={18} />}
                    name="email"
                    type="email"
                    value={email}
                    onChange={onChange}
                    placeholder="name@example.com"
                  />
                  <InputGroup
                    label="Secure Mobile"
                    icon={<Phone size={18} />}
                    name="phone"
                    value={phone}
                    onChange={onChange}
                    placeholder="10-digit number"
                  />
                  <InputGroup
                    label="Key Pass"
                    icon={<Lock size={18} />}
                    name="password"
                    type="password"
                    value={password}
                    onChange={onChange}
                    placeholder="••••••••"
                  />
                  <InputGroup
                    label="Confirm Key"
                    icon={<CheckCircle2 size={18} />}
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={onChange}
                    placeholder="••••••••"
                  />

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-blue-600 py-5 rounded-2xl font-black text-white shadow-xl shadow-blue-900/40 mt-4 flex items-center justify-center gap-2 group transition-all"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        Request OTP{" "}
                        <ArrowLeft className="rotate-180" size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="text-center space-y-6">
                  <div className="bg-emerald-500/10 text-emerald-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto">
                    <ShieldCheck size={40} />
                  </div>
                  <h3 className="text-2xl font-black italic tracking-tighter">
                    VERIFY MOBILE
                  </h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                    Code sent to <span className="text-blue-400">{phone}</span>
                  </p>

                  <input
                    type="text"
                    maxLength="6"
                    placeholder="••••••"
                    className="w-full text-center text-4xl font-black tracking-[0.3em] py-6 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 outline-none transition-all"
                    value={otpValue}
                    onChange={(e) =>
                      setOtpValue(e.target.value.replace(/\D/g, ""))
                    }
                  />

                  <div className="flex justify-between items-center px-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Key Expired"}
                    </p>
                    <button
                      disabled={otpTimer > 0}
                      onClick={handleRegisterRequest}
                      className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1 disabled:opacity-30"
                    >
                      <RefreshCcw size={12} /> Resend
                    </button>
                  </div>

                  <button
                    disabled={loading || otpValue.length < 6}
                    onClick={handleFinalizeRegister}
                    className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Verify & Sign Up"
                    )}
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="text-[10px] font-black text-slate-500 uppercase tracking-widest"
                  >
                    Change Phone Number
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

const InputGroup = ({
  label,
  icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-2">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm font-bold"
      />
    </div>
  </div>
);
