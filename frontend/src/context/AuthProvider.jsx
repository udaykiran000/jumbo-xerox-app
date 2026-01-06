import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // AuthContext ni import chesam

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Logout Function
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  // 2. Login Function (Updated)
  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded); // Token lo unna user data set chestundi

      // Role check chesi navigate cheyali
      if (decoded.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  // 3. Token Check (On Page Refresh)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          // Token expire ayindhemo check chestundi
          if (decoded.exp && decoded.exp < currentTime) {
            logout();
          } else {
            setUser(decoded);
          }
        } catch (error) {
          console.error("Auth check error:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
