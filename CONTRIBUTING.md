# Contributing to VisLab

## Adding a visualization

1. Implement the widget class in [`packages/components`](packages/components) (constructor `(container: HTMLElement)`, `destroy()` calling `this.scene.dispose()`, etc.).
2. Export the class from the appropriate `index.ts` under `cpu/`, `os/`, `algorithms/`, `compiler/`, or `storage/`, and from [`packages/components/src/index.ts`](packages/components/src/index.ts) if it is a new top-level entry.
3. Register it in [`packages/registry/src/registry.ts`](packages/registry/src/registry.ts) with `id`, `globalName`, `displayName`, `category`, `customElementTag`, optional `props`, and `create`.
4. Add a thin named export in [`packages/react/src/catalog.tsx`](packages/react/src/catalog.tsx) (wrap `VislabMount`) so MDX authors can import by component name.
5. Run `pnpm run build` and `pnpm run test` from the repo root.

The [`@vislab/web-components`](packages/web-components) package defines custom elements and `[data-vislab]` mounting from the same registry — no per-component CE files are required.

## Accessibility

Chrome buttons use `styleVislabButton` with `role="button"` and `aria-label` from button text. Canvas content is visual-only; document widget purpose in surrounding prose for screen reader users.

## Versioning and publish

**Status:** `@vislab/*` packages are **not yet published** to npm (first `0.1.0` needs human approval + `NPM_TOKEN`). The Jekyll theme gemspec lives in `packages/jekyll-theme` but is **not published** to RubyGems until marketed as installable.

Until publish, develop against the monorepo workspace. Use semantic versioning and changelog entries when cutting releases.

## CLI

- `pnpm --filter @vislab/cli exec vislab build` — copy IIFE bundles for static hosting.
- `pnpm --filter @vislab/cli exec vislab widget -c CpuPipeline -o ./out` — standalone iframe-friendly HTML.

## Visual regression

Full-widget screenshots (title chrome + controls + canvas) live in
`apps/demo-blog/e2e/visual.spec.ts-snapshots/`.

Baselines are **platform-tagged** so quality stays high on each host:

- `*-chromium-darwin.png` — local macOS
- `*-chromium-linux.png` — GitHub Actions Ubuntu (required for CI)

Update after intentional UI changes:

```bash
# On your Mac (darwin baselines)
pnpm --filter demo-blog run build
pnpm --filter demo-blog exec playwright test e2e/visual.spec.ts --project=chromium --update-snapshots

# Linux baselines for CI (Docker; from monorepo root)
bash scripts/update-visual-snapshots-linux.sh
```

Commit **both** darwin and linux PNGs with your widget PR.

## Widget runtime (SimClock + Static export)

All widgets should use `attachWidgetRuntime` + `createLiveSummary` from `packages/components/src/ui/widgetRuntime.ts` after `new Scene(canvas)` so pause/speed controls, reduced-motion defaults, live SR summaries, and SVG a11y export stay consistent.

- Call `liveSummary.set(...)` (or `runtime.summary.set`) when simulation state changes so screen readers and Static SVG export stay current.
- Set `showStaticExport: false` for pure step-through widgets where the export control clutters the toolbar.

## Per-widget code-splitting (#51)

`@vislab/components` builds multi-entry ESM at `@vislab/components/widgets/<Name>` plus a full IIFE catalog (`index.global.js`).

- **Eager (default IIFE / `initVislabEmbeds()`):** one script loads the full catalog — best for static HTML / Jekyll.
- **Lazy ESM:** `createVislabComponentAsync` / `initVislabEmbedsLazy()` dynamically import only the requested widget graph.

```ts
import { createVislabComponentAsync } from "@vislab/registry";
await createVislabComponentAsync("CpuPipeline", el, {
  stages: ["IF", "ID", "EX", "MEM", "WB"],
});
```

Bundle budgets: `pnpm run check:bundle-size` (full IIFE + per-widget ESM graph gzip).

## Docs & media helpers

```bash
pnpm run docs:widgets    # regenerate component MDX from registry (preserves hand-flagship pages)
pnpm run sri             # write docs/SRI.md integrity hashes after build
pnpm run media:capture   # README/OG stills into docs/media/ (needs demo-blog build + chromium)
pnpm run media:gif       # 4s StorageComparison GIF/WebM (needs demo-blog build + chromium + ffmpeg)
```
