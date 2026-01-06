import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminTopbar from "./AdminTopbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Printer,
  CreditCard,
  Truck,
  ChevronRight,
  X,
} from "lucide-react";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={18} /> },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: <CreditCard size={18} />,
    },
    { name: "Shipping", path: "/admin/shipping", icon: <Truck size={18} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={18} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
  ];

  const SidebarLink = ({ item, onClick }) => {
    const isActive =
      item.path === "/admin"
        ? location.pathname === "/admin"
        : location.pathname.startsWith(item.path);

    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
          isActive
            ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
            : "text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent"
        }`}
      >
        <div className="flex items-center gap-3 relative z-10">
          <span
            className={`${
              isActive
                ? "text-blue-400"
                : "text-slate-500 group-hover:text-slate-300"
            } transition-colors`}
          >
            {item.icon}
          </span>
          <span className="text-sm font-bold tracking-tight">{item.name}</span>
        </div>
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
          />
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-2xl border-r border-white/5 hidden lg:flex flex-col z-50 shadow-2xl h-full">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
              <Printer size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tighter leading-none">
                Jumbo <span className="text-blue-500">Xerox</span>
              </span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] pl-0.5 mt-1">
                Admin Console
              </span>
            </div>
          </Link>
        </div>
        <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
            Main Menu
          </p>
          <nav className="space-y-1.5">
            {menu.map((item) => (
              <SidebarLink key={item.path} item={item} />
            ))}
          </nav>
        </div>
        <div className="p-6 border-t border-white/5">
          <button
            onClick={logout}
            className="flex items-center gap-3 p-4 text-slate-500 hover:text-red-400 hover:bg-red-400/5 w-full rounded-2xl transition-all font-bold text-sm group"
          >
            <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-red-400/10 transition-colors">
              <LogOut size={18} />
            </div>
            Logout Session
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 h-full w-72 bg-slate-900 border-r border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-white/5">
                <span className="text-lg font-black text-white">
                  Jumbo Xerox
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-white/5 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 px-4 py-6 overflow-y-auto">
                <nav className="space-y-2">
                  {menu.map((item) => (
                    <SidebarLink
                      key={item.path}
                      item={item}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                </nav>
              </div>
              <div className="p-6 border-t border-white/5">
                <button
                  onClick={logout}
                  className="w-full py-3 bg-red-500/10 text-red-500 font-bold rounded-xl"
                >
                  Logout
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none z-0" />
        <AdminTopbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-10 relative z-10 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
          <footer className="mt-10 py-6 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest border-t border-white/5">
            © 2025 Jumbo Xerox • System Architecture v2.0
          </footer>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
