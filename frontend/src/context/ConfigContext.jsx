import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    otpTestMode: false,
    paymentTestMode: false,
    shippingMode: "real",
    loading: true,
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await api.get("/config");
        console.log("[CONFIG] Loaded:", data);
        setConfig({ ...data, loading: false });
      } catch (error) {
        console.error("[CONFIG] Failed to load config:", error);
        setConfig((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};
