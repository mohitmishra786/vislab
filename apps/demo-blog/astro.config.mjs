import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://vislab.dev",
  integrations: [react(), mdx()],
  vite: {
    esbuild: { target: "es2022" },
  },
});
