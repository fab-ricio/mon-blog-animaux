import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Remove any 'define' or 'optimizeDeps' sections related to Buffer/polyfills
});
