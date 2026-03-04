import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      workbox: {
        // ❌ Removed navigateFallback (no offline page)
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "document",
            handler: "NetworkOnly", // Always use network
          },
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith("/api/"),
            handler: "NetworkOnly", // Never cache API
          },
        ],
      },

      manifest: {
        name: "Kaleva36",
        short_name: "K36",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
      },
    }),
  ],
});