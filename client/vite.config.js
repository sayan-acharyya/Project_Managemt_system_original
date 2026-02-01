import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
// Add your framework's plugin if necessary, e.g., import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    // e.g., react(),
    tailwindcss(),
  ],
});
