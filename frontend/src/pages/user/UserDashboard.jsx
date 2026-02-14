import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  RotateCcw,
  Moon,
  Sun,
  ExternalLink,
  Loader2,
  Package,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Download,
  Info,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { FiMapPin, FiPhone, FiMail, FiZap } from "react-icons/fi";
import api from "../../services/api";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { displayRazorpay } from "../../services/paymentService";

// --- Service Cards Images ---
import a4Img from "../../assets/a4.jpg";
import planImg from "../../assets/Plan-Printing.jpg";
import bcardImg from "../../assets/bcard.jpg";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // States
  const [userData, setUserData] = useState({ name: "User", email: "" });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [isResuming, setIsResuming] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("ui-theme") || "light";
    setTheme(savedTheme);

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const profileRes = await api.get("/users/profile");
        setUserData(profileRes.data);

        // Synced with updated backend route
        const ordersRes = await api.get("/orders/my-orders");
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
        toast.error("Failed to sync dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // --- LOGICAL CONNECTIVITY: RESUME PAYMENT ---
  const handlePayNow = async (orderId) => {
    setIsResuming(true);
    try {
      // Calls backend to generate fresh Razorpay Order ID
      const { data } = await api.post(`/orders/resume-payment/${orderId}`);
      // Triggers Razorpay SDK
      await displayRazorpay(data, user, navigate);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Payment initialization failed";
      toast.error(msg);
    } finally {
      setIsResuming(false);
    }
  };

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.paymentStatus === "Pending").length,
    completed: orders.filter((o) => o.status === "Completed").length,
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("ui-theme", next);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const themeClasses =
    theme === "dark"
      ? "bg-slate-950 text-slate-100"
      : "bg-slate-50 text-slate-900";

  return (
    <div
      className={`${themeClasses} min-h-screen transition-colors duration-500 font-sans pb-32`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-16">
        {/* 1. HEADER */}
        <header
          className={`${theme === "dark" ? "bg-white/5 border-white/10" : "bg-white border-slate-200"} backdrop-blur-xl p-10 rounded-[3rem] flex flex-col md:flex-row justify-between items-center border shadow-2xl gap-6`}
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-lg uppercase">
              {userData.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight italic">
                Hello, {userData.name}! 👋
              </h1>
              <p className="text-slate-500 font-medium">{userData.email}</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-4 rounded-2xl bg-slate-500/10 hover:bg-slate-500/20 transition-all border border-slate-200/50"
          >
            {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
          </button>
        </header>

        {/* 2. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            label="Total Requests"
            value={stats.total}
            icon={<Package />}
            color="text-blue-500"
            theme={theme}
          />
          <StatCard
            label="Unpaid Orders"
            value={stats.pending}
            icon={<RotateCcw />}
            color="text-amber-500"
            theme={theme}
          />
          <StatCard
            label="Finalized"
            value={stats.completed}
            icon={<CheckCircle />}
            color="text-emerald-500"
            theme={theme}
          />
        </div>

        {/* 3. RECENT ORDERS TABLE */}
        <div
          className={`${theme === "dark" ? "bg-white/5 border-white/10" : "bg-white border-slate-200"} p-10 rounded-[3rem] border shadow-2xl`}
        >
          <h2 className="text-2xl font-black mb-8 px-4 border-l-4 border-blue-600 uppercase tracking-tighter">
            Your Printing History
          </h2>

          {loading ? (
            <div className="py-24 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-blue-600" size={50} />
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
                Syncing Pipeline...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-24 text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-200 rounded-[2rem]">
              No orders found. Start your first project!
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[11px] font-black tracking-[0.2em] px-4">
                      <th className="pb-4 px-6">ID</th>
                      <th className="pb-4 px-6">Service</th>
                      <th className="pb-4 px-6">Financials</th>
                      <th className="pb-4 px-6">Status</th>
                      <th className="pb-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className={`${theme === "dark" ? "bg-white/5" : "bg-slate-50"} hover:bg-blue-500/5 transition-all rounded-2xl`}
                      >
                        <td className="py-6 px-6 rounded-l-2xl font-mono text-xs font-bold text-blue-600 italic">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-6 px-6 font-black text-sm uppercase">
                          {order.serviceType}
                        </td>
                        <td className="py-6 px-6">
                          <div className="flex flex-col">
                            <span className="font-black italic text-sm">
                              ₹{order.totalAmount}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase tracking-widest ${order.paymentStatus === "Paid" ? "text-emerald-500" : "text-orange-500"}`}
                            >
                              {order.paymentStatus}
                            </span>
                          </div>
                        </td>
                        <td className="py-6 px-6 font-bold text-slate-500">
                          {order.status}
                        </td>
                        <td className="py-6 px-6 rounded-r-2xl text-right">
                          <div className="flex items-center justify-end gap-3">
                            {/* LOGICAL CONNECTIVITY: PAY NOW BUTTON */}
                            {order.paymentStatus === "Pending" &&
                              !order.filesDeleted && (
                                <button
                                  onClick={() => handlePayNow(order._id)}
                                  disabled={isResuming}
                                  className="bg-blue-600 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg animate-pulse flex items-center gap-2"
                                >
                                  {isResuming ? (
                                    <Loader2
                                      className="animate-spin"
                                      size={12}
                                    />
                                  ) : (
                                    <>
                                      <CreditCard size={14} /> Pay Now
                                    </>
                                  )}
                                </button>
                              )}
                            {order.filesDeleted &&
                              order.paymentStatus === "Pending" && (
                                <span className="text-[9px] font-black text-red-500 uppercase bg-red-50 px-4 py-2 rounded-xl border border-red-100 flex items-center gap-1">
                                  <AlertCircle size={10} /> Expired
                                </span>
                              )}
                            <button
                              onClick={() => openOrderDetails(order)}
                              className="bg-slate-800 text-white p-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg"
                            >
                              <ExternalLink size={18} />
                            </button>
                             {userData.role === "admin" && order.shipmentId && (
                                <button className="bg-purple-100 text-purple-600 p-2 rounded-lg text-xs font-bold">
                                  {order.shipmentId}
                                </button>
                             )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center items-center gap-6 bg-slate-100/50 p-4 rounded-3xl w-fit mx-auto">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-xl bg-white shadow-sm border border-slate-200 disabled:opacity-30"
                  >
                    <ChevronLeft />
                  </button>
                  <div className="font-black text-xs text-slate-500 uppercase tracking-widest">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-xl bg-white shadow-sm border border-slate-200 disabled:opacity-30"
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 4. BIG SERVICE CARDS */}
        <div className="space-y-12">
          <h2 className="text-4xl font-black text-center tracking-tighter uppercase italic">
            Order New Prints
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ServiceCard
              title="Quick Printouts"
              img={a4Img}
              link="/quick-print"
            />
            <ServiceCard
              title="Plan Printing"
              img={planImg}
              link="/plan-printing"
            />
            <ServiceCard
              title="Business Cards"
              img={bcardImg}
              link="/business-cards"
            />
          </div>
        </div>

        {/* 5. NOTES SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
          <NoteBox
            icon={<FiMapPin />}
            title="STORE PICKUP"
            desc="Arundelpet Guntur Only"
            color="blue"
          />
          <NoteBox
            icon={<FiZap />}
            title="BULK ORDERS"
            desc="+91 9441081125"
            color="yellow"
          />
          <NoteBox
            icon={<FiMail />}
            title="SUPPORT"
            desc="info@jumboxerox.com"
            color="green"
          />
        </div>
      </div>

      {/* --- ORDER DETAILS MODAL --- */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Package size={24} />
                <h2 className="text-xl font-black uppercase tracking-tight italic">
                  Order Analysis
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="bg-white/20 p-2 rounded-xl hover:bg-white/40 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Global Order ID
                  </p>
                  <p className="font-mono text-blue-600 font-bold truncate">
                    {selectedOrder._id}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Service Class
                  </p>
                  <p className="font-bold text-slate-800 uppercase italic">
                    {selectedOrder.serviceType}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Logistics Mode
                  </p>
                  <p className="font-bold text-slate-800 uppercase">
                    {selectedOrder.deliveryMode}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Total Settle
                  </p>
                  <p className="font-black text-xl text-blue-600">
                    ₹{selectedOrder.totalAmount}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 flex items-center gap-2 tracking-widest italic border-b pb-2">
                  <Info size={14} /> Technical Specs
                </h4>
                <div className="grid grid-cols-2 gap-y-3 text-xs font-bold">
                  <p className="text-slate-500 uppercase">
                    Pages:{" "}
                    <span className="text-slate-800">
                      {selectedOrder.details?.pages || "—"}
                    </span>
                  </p>
                  <p className="text-slate-500 uppercase">
                    Copies:{" "}
                    <span className="text-slate-800">
                      {selectedOrder.details?.copies || "1"}
                    </span>
                  </p>
                  <p className="text-slate-500 uppercase">
                    Size:{" "}
                    <span className="text-slate-800">
                      {selectedOrder.details?.size || "Standard"}
                    </span>
                  </p>
                  <p className="text-slate-500 uppercase">
                    Status:{" "}
                    <span className="text-blue-600 italic">
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Shipping Info Section */}
              {selectedOrder.shipmentId && (
                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 mb-6">
                  <h4 className="text-[10px] font-black text-purple-400 uppercase mb-4 flex items-center gap-2 tracking-widest italic border-b border-purple-200 pb-2">
                    <Package size={14} /> Logistics Info
                  </h4>
                  <div className="grid grid-cols-2 gap-y-3 text-xs font-bold">
                    <p className="text-slate-500 uppercase">
                      Courier:{" "}
                      <span className="text-slate-800">
                        {selectedOrder.courierName || "Standard"}
                      </span>
                    </p>
                    <p className="text-slate-500 uppercase">
                      AWB:{" "}
                      <span className="text-slate-800">
                        {selectedOrder.awbNumber || selectedOrder.shipmentId}
                      </span>
                    </p>
                    <div className="col-span-2 mt-2">
                      <a
                        href={`https://shiprocket.co/tracking/${selectedOrder.awbNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 text-white rounded-xl uppercase text-[10px] tracking-widest hover:bg-purple-700 transition"
                      >
                        Track Shipment <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Files Section with Expiry Sync */}
              {selectedOrder.files && selectedOrder.files.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                    Document Assets
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="text-blue-600" size={18} />
                          <span className="text-xs font-black text-slate-700 truncate w-40 md:w-64 italic">
                            {file.name}
                          </span>
                        </div>
                        {selectedOrder.filesDeleted ? (
                          <span className="text-[9px] font-black text-red-500 uppercase">
                            Purged
                          </span>
                        ) : (
                          <a
                            href={`${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}${file.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-[10px] font-black text-blue-600 hover:text-black uppercase tracking-widest"
                          >
                            <Download size={14} /> Open Source
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Internal Helper Components ---
const StatCard = ({ label, value, icon, color, theme }) => (
  <div
    className={`${theme === "dark" ? "bg-white/5 border-white/10" : "bg-white border-slate-200"} p-10 rounded-[3rem] border shadow-xl flex items-center justify-between`}
  >
    <div>
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
        {label}
      </p>
      <h3 className="text-5xl font-black mt-2 tracking-tighter italic">
        {value}
      </h3>
    </div>
    <div className={`${color} bg-current/10 p-6 rounded-[2.2rem]`}>
      {React.cloneElement(icon, { size: 40 })}
    </div>
  </div>
);

const ServiceCard = ({ title, img, link }) => (
  <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden group border border-slate-100 hover:translate-y-[-10px] transition-all duration-500">
    <div className="h-80 overflow-hidden relative">
      <img
        src={img}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
    </div>
    <div className="p-10 flex flex-col items-center">
      <h4 className="font-black text-2xl text-slate-800 mb-6 uppercase tracking-tighter italic">
        {title}
      </h4>
      <Link
        to={link}
        className="w-full py-5 bg-blue-600 text-white text-center rounded-[2.2rem] font-black shadow-xl hover:bg-black transition-all uppercase text-xs tracking-[0.2em]"
      >
        Start Project
      </Link>
    </div>
  </div>
);

const NoteBox = ({ icon, title, desc, color }) => {
  const colors = {
    blue: "bg-blue-100 border-blue-500 text-blue-900",
    yellow: "bg-orange-100 border-orange-500 text-orange-900",
    green: "bg-emerald-100 border-emerald-500 text-emerald-900",
  };
  return (
    <div
      className={`${colors[color]} p-10 rounded-[2.8rem] border-l-[12px] shadow-lg`}
    >
      <div className="flex items-center gap-4 mb-3 font-black uppercase text-[10px] tracking-widest">
        <span className="p-2 bg-white/50 rounded-lg">{icon}</span> {title}
      </div>
      <p className="text-[11px] font-black uppercase tracking-tight italic opacity-70">
        {desc}
      </p>
    </div>
  );
};
