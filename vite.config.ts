import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  //* base: "/tilos-maraton", // will be uncommented pre-gh-builds
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
        start_url: "/tilos-maraton",
        display: "standalone",
        background_color: "#202020",
        theme_color: "#FE4E00",
        icons: [
          {
            src: "/resources/logo.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  build: {
    target: "esnext",
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
  },
});
