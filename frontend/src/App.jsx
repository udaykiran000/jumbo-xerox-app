import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/layout/AdminLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Static Pages
import Home from "./pages/static/Home";
import About from "./pages/static/About";
import Services from "./pages/static/Services";
import Contact from "./pages/static/Contact";

// User Pages
import QuickPrint from "./pages/user/QuickPrint";
import Profile from "./pages/user/Profile";
import UserDashboard from "./pages/user/UserDashboard";
import Checkout from "./pages/user/Checkout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminShipping from "./pages/admin/AdminShipping"; // Deenni add chesa

function App() {
  return (
    <Routes>
      {/* 1. Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2. User Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/quick-print" element={<QuickPrint />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Route>

      {/* 3. Admin Protected Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="shipping" element={<AdminShipping />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <div className="text-center mt-20 text-2xl">404 - Page Not Found</div>
        }
      />
    </Routes>
  );
}

export default App;
