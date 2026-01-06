import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    // ఈ కింద ఉన్న లైన్ యాడ్ చెయ్
    allowedHosts: true,

    // ఒకవేళ పైన ఉన్నది పని చేయకపోతే కింద ఉన్నది వాడు:
    // allowedHosts: ['all'],

    host: true,
    port: 5173,
  },
});
