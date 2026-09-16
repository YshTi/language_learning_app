import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules[\\/](react|react-dom|react-router-dom)/,
              priority: 40,
            },
            {
              name: "firebase",
              test: /node_modules[\\/](@firebase|firebase)/,
              priority: 30,
            },
            {
              name: "forms",
              test: /node_modules[\\/](react-hook-form|@hookform|yup)/,
              priority: 20,
            },
            {
              name: "ui",
              test: /node_modules[\\/](react-hot-toast|react-icons)/,
              priority: 15,
            },
            {
              name: "vendor",
              test: /node_modules/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
