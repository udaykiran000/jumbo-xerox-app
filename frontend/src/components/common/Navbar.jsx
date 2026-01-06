import { useState, useContext, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Printer,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };
  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
      isActive
        ? "text-blue-600 bg-blue-50"
        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
    }`;

  return (
    <nav
      className={`fixed w-full z-[40] top-0 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <Printer size={24} />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tighter">
              Jumbo<span className="text-blue-600">Xerox</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            <NavLink to="/" className={navLinkClass}>
              <LayoutDashboard size={16} /> Home
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              <Briefcase size={16} /> Services
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              <Phone size={16} /> Contact
            </NavLink>
            {user && (
              <NavLink to="/dashboard" className={navLinkClass}>
                <User size={16} /> Dashboard
              </NavLink>
            )}
          </div>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                  >
                    <ShieldCheck size={14} /> Admin
                  </Link>
                )}
                <div className="h-8 w-[1px] bg-slate-200" />
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 group"
                >
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-black text-xs group-hover:scale-105 transition-transform">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 leading-none">
                      {user.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">
                      Account
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-slate-600 font-bold hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden absolute w-full bg-white border-b border-slate-100 shadow-2xl transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-6 space-y-2">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 p-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs mb-4"
            >
              <ShieldCheck size={16} /> Go to Admin Console
            </Link>
          )}
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `p-3 rounded-xl font-bold flex items-center gap-3 ${
                isActive ? "bg-blue-50 text-blue-600" : "text-slate-600"
              }`
            }
          >
            <LayoutDashboard size={20} /> Home
          </NavLink>
          <NavLink
            to="/services"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `p-3 rounded-xl font-bold flex items-center gap-3 ${
                isActive ? "bg-blue-50 text-blue-600" : "text-slate-600"
              }`
            }
          >
            <Briefcase size={20} /> Services
          </NavLink>
          {user ? (
            <>
              <div className="h-[1px] bg-slate-100 my-2" />
              <NavLink
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-50"
              >
                <User size={20} /> User Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="p-3 rounded-xl font-bold flex items-center gap-3 text-red-500 hover:bg-red-50 w-full"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-center p-3 rounded-xl border border-slate-200 font-bold"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="text-center p-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
