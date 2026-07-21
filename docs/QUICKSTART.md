# VisLab Quickstart

Get a visualization running locally. **Packages are not yet published to npm** — install from this monorepo (or wait for the first `0.1.0` release).

## Prerequisites

- **Node.js ≥ 22.12** (see root `package.json` `engines`)
- **pnpm 10+** (`corepack enable && corepack prepare pnpm@10.33.0 --activate`)

---

## Path 1: React / Astro MDX (from monorepo)

```bash
git clone https://github.com/mohitmishra786/vislab.git
cd vislab
pnpm install
pnpm run build
```

In a workspace app or via `pnpm link` / workspace protocol:

```tsx
import { StorageComparison } from "@vislab/react";

export default function Demo() {
  return <StorageComparison />;
}
```

**Astro island** (recommended for blogs):

```astro
---
import { StorageComparison } from "@vislab/react";
---
<figure>
  <StorageComparison client:visible />
  <figcaption>
    Relative latency across storage tiers. Prefer describing the concept in prose —
    canvas pixels are not crawlable.
  </figcaption>
</figure>
```

All 17 widgets are named exports from `@vislab/react`. See `@vislab/registry` for the full list.

> **After npm publish:** `pnpm add @vislab/react` (or `npm install @vislab/react`) will work. Until then, use the monorepo path above.

---

## Path 2: Static HTML (`data-vislab`)

Build embed bundles:

```bash
pnpm run build
pnpm --filter @vislab/cli exec vislab build -o ./public/vislab
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <script src="./vislab/vislab-embed.min.js" defer></script>
  </head>
  <body>
    <div
      data-vislab="StorageComparison"
      style="min-height: 420px; width: 100%;"
    ></div>
  </body>
</html>
```

**With props** (CpuPipeline stages):

```html
<div
  data-vislab="CpuPipeline"
  data-props='{"stages":["IF","ID","EX","MEM","WB"]}'
  style="min-height: 200px;"
></div>
```

**Custom element** (auto-registered by embed script):

```html
<vislab-storage-comparison
  style="display:block;min-height:420px"
></vislab-storage-comparison>
```

**Bundle size (gzip, measured):** VisLab IIFE ≈ **16 KB**; VisLabEmbeds IIFE ≈ **19 KB**.

---

## Path 3: Jekyll

The gem sources live in `packages/jekyll-theme` (`vislab-jekyll` gemspec). Until published to RubyGems, path the gem locally:

```ruby
# Gemfile
gem "vislab-jekyll", path: "../vislab/packages/jekyll-theme"
```

Copy built embed JS into your site `assets/vislab/` after `vislab build`.

```liquid
{% include vislab.html id="storage1" component="StorageComparison" %}
```

---

## CLI helpers

```bash
# Standalone iframe-ready HTML for one widget
pnpm --filter @vislab/cli exec vislab widget -c StorageComparison -o ./out

# Preview the demo blog locally
pnpm --filter @vislab/cli exec vislab preview

# Scaffold a snippet project
pnpm --filter @vislab/cli exec vislab new my-post --template html
```

CLI version: **0.2.0**. After publish: `npx @vislab/cli widget -c CpuPipeline -o ./out`.

### Optional: video export (not required for embeds)

`@vislab/exporter` uses **Puppeteer/Chromium**. Only install when you need PNG frames → GIF/MP4. Keep it off the default blog embed path.

---

## Next steps

- **Studio** composer: `pnpm --filter studio dev` — Copy MDX / HTML / Jekyll / iframe
- **Docs** site: `pnpm --filter docs dev`
- **Demo blog**: `pnpm --filter demo-blog dev`
- See [CONTRIBUTING.md](../CONTRIBUTING.md) to add a widget
- Support tiers: React + static HTML are primary; Jekyll and exporter are best-effort

## Support matrix (browsers)

Modern evergreen browsers: Chromium 111+, Firefox 121+, Safari 16.4+. Visual regression CI uses Chromium only.
