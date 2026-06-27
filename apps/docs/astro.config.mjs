import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://vislab.dev",
  integrations: [
    react(),
    starlight({
      title: "VisLab",
      description: "Systems engineering visualizations for the web",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/mohitmishra786/vislab",
        },
      ],
      sidebar: [
        {
          label: "Start",
          items: [
            { label: "Introduction", slug: "index" },
            { label: "Quickstart", slug: "quickstart" },
          ],
        },
        {
          label: "Components",
          autogenerate: { directory: "components" },
        },
        {
          label: "Guides",
          items: [
            { label: "Astro / MDX", slug: "guides/astro" },
            { label: "Plain HTML", slug: "guides/html" },
            { label: "Jekyll", slug: "guides/jekyll" },
          ],
        },
        {
          label: "API",
          items: [{ label: "Core engine", slug: "api/core" }],
        },
      ],
    }),
  ],
});
