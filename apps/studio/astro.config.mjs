import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://vislab.dev",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    esbuild: { target: "es2022" },
  },
});
