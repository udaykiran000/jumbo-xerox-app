import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      toast.success("Registration Successful!");
      login(data.token);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-20 relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back to Home Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back to home
        </Link>

        {/* Register Card */}
        <div className="bg-white/5 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
              <UserPlus size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-2">
              Create Account
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Join Jumbo Xerox for seamless printing
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <InputGroup
              label="Full Name"
              icon={<User size={18} />}
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="John Doe"
            />

            {/* Email Address */}
            <InputGroup
              label="Email Address"
              icon={<Mail size={18} />}
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="name@example.com"
            />

            {/* Password */}
            <InputGroup
              label="Password"
              icon={<Lock size={18} />}
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="••••••••"
            />

            {/* Confirm Password */}
            <InputGroup
              label="Confirm Password"
              icon={<CheckCircle2 size={18} />}
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder="••••••••"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full relative overflow-hidden bg-blue-600 py-4 rounded-2xl font-black text-white shadow-xl shadow-blue-900/40 transition-all mt-4 flex items-center justify-center gap-2 group disabled:opacity-70`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign Up{" "}
                  <UserPlus
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="text-center text-slate-500 mt-8 text-sm font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Footer Info */}
        <p className="text-center text-slate-600 text-[10px] uppercase tracking-[0.2em] font-black mt-8">
          Secure 256-bit SSL Encryption
        </p>
      </motion.div>
    </div>
  );
}

/* --- Helper Sub-component --- */
const InputGroup = ({
  label,
  icon,
  type,
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-700 font-medium"
      />
    </div>
  </div>
);
