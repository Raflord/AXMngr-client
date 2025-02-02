import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  server: {
    proxy: {
      "/api": {
        target: "https://almox-manager-backend-development.up.railway.app/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
