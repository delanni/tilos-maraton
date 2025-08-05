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
      registerType: "prompt",
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}?${Date.now()}`;
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              }
            }
          }
        ]
      },
      srcDir: "src",
      filename: "service-worker.ts",
      strategies: "injectManifest",
      injectRegister: "auto",
      manifest: {
        name: "Tilos Maraton",
        short_name: "Tilos Maraton",
        description: "Tilos Maraton 2025 adománygyűjtő fesztivál mobil programfüzet",
        start_url: baseName,
        display: "standalone",
        background_color: "#1a1a1a",
        theme_color: "#FE4E00",
        lang: "hu",
        scope: baseName,
        icons: [
          {
            src: "/icons/icon-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
        categories: ["music", "entertainment", "lifestyle"],
        shortcuts: [
          {
            name: "Program",
            short_name: "Program",
            description: "Napi program megtekintése",
            url: `${baseName}program`,
            icons: [{ src: "/icons/icon-192.svg", sizes: "192x192" }]
          },
          {
            name: "Előadók",
            short_name: "Előadók",
            description: "Előadók listája",
            url: `${baseName}artists`,
            icons: [{ src: "/icons/icon-192.svg", sizes: "192x192" }]
          }
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
