# VisLab Quickstart

Get a visualization running in under 5 minutes. Choose your embed path.

## Prerequisites

- Node.js 18+
- pnpm 10+ (or npm)

---

## Path 1: React / Astro MDX

```bash
npm install @vislab/react
```

```tsx
// MyPost.mdx or any React page
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
<StorageComparison client:visible />
```

All 17 widgets are named exports from `@vislab/react`. See `@vislab/registry` for the full list.

---

## Path 2: Static HTML (`data-vislab`)

Build embed bundles from the monorepo (or copy from a release artifact):

```bash
pnpm --filter @vislab/cli exec vislab build -o ./public/vislab
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
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
<vislab-storage-comparison style="display:block;min-height:420px"></vislab-storage-comparison>
```

---

## Path 3: Jekyll

Add the gem to your `Gemfile`:

```ruby
gem "vislab-jekyll"
```

In your layout `<head>`:

```html
<script src="{{ '/assets/vislab/vislab-embed.min.js' | relative_url }}" defer></script>
```

In a post:

```liquid
{% include vislab.html id="storage1" component="StorageComparison" %}
```

With props:

```liquid
{% include vislab.html id="cpu1" component="CpuPipeline" props='{"stages":["IF","ID","EX","MEM","WB"]}' %}
```

Iframe embed (no script on parent page):

```liquid
{% include vislab_iframe.html id="viz1" component="StorageComparison" %}
```

---

## CLI helpers

```bash
# Standalone iframe-ready HTML for one widget
pnpm --filter @vislab/cli exec vislab widget -c StorageComparison -o ./out

# Preview the demo blog locally
pnpm --filter @vislab/cli exec vislab preview

# Scaffold a Jekyll-style snippet
pnpm --filter @vislab/cli exec vislab new my-post
```

---

## Next steps

- Run the **Studio** composer: `pnpm --filter studio dev`
- Browse the **component registry**: `pnpm --filter docs dev`
- See [CONTRIBUTING.md](../CONTRIBUTING.md) to add a widget