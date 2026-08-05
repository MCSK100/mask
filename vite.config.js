import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return

          if (
            id.includes("react") ||
            id.includes("react-dom") ||
            id.includes("react-router-dom")
          ) {
            return "react-vendor"
          }

          if (id.includes("framer-motion")) {
            return "motion-vendor"
          }

          if (id.includes("socket.io-client") || id.includes("styled-components")) {
            return "rtc-vendor"
          }
        }
      }
    }
  },

  define: {
    global: "globalThis",
  }
})