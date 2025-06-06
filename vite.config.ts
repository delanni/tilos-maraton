import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const baseName = process.env.BASE_NAME || "/";

export default defineConfig({
  base: baseName,
  define: {
    "process.env.BASE_NAME": JSON.stringify(baseName),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      srcDir: "src",
      filename: "service-worker.ts",
      strategies: "injectManifest",
      injectRegister: "auto",
      manifest: {
        name: "Tilos Maraton 2025",
        short_name: "Tilos Maraton",
        start_url: baseName,
        display: "standalone",
        background_color: "#EDE1DF",
        theme_color: "#FE4E00",
        icons: [
          {
            src: "https://tilos.hu/tilos_radio_logo.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  assetsInclude: ["./resources/**"],
  build: {
    target: "esnext",
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("programme/") || id.endsWith(".json")) {
            return "data";
          }
        },
      },
    },
  },
});
