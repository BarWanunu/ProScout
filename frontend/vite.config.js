import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url"; // 1. Import URL helpers

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 2. Use the new URL-based method to define the alias
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
