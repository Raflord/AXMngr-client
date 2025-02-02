import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const API_URL = `${env.VITE_API_URL ?? "http://127.0.0.1:8080"}`;

  return {
    server: {
      proxy: {
        "/api": API_URL,
      },
    },
    plugins: [react(), TanStackRouterVite()],
  };
});
