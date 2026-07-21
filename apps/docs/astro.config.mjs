import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// Canonical site: use GitHub Pages until a custom domain is owned.
// Do NOT use vislab.dev — that domain belongs to Northeastern University VisLab.
const site =
  process.env.VISLAB_SITE_URL ?? "https://mohitmishra786.github.io/vislab";
// Local dev: default base "/". CI/Pages: set VISLAB_BASE=/vislab
const base = process.env.VISLAB_BASE ?? "/";

export default defineConfig({
  output: "static",
  site,
  base,
  vite: {
    esbuild: { target: "es2022" },
  },
  integrations: [
    react(),
    starlight({
      title: "VisLab Widgets",
      description:
        "Embeddable systems & CS education canvas simulations for technical writing (CPU, cache, OS, storage)",
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
            { label: "Troubleshooting", slug: "troubleshooting" },
            { label: "Accessibility", slug: "guides/accessibility" },
            { label: "Compare", slug: "compare" },
            { label: "Support tiers", slug: "support" },
          ],
        },
        {
          label: "Components",
          items: [{ autogenerate: { directory: "components" } }],
        },
        {
          label: "Guides",
          items: [
            { label: "Astro / MDX", slug: "guides/astro" },
            { label: "Plain HTML", slug: "guides/html" },
            { label: "Jekyll", slug: "guides/jekyll" },
            { label: "Studio", slug: "guides/studio" },
            { label: "SEO for embeds", slug: "guides/seo" },
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
