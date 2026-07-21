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

Packages are published as `@vislab/*` on npm; the Jekyll theme is released as the `vislab-jekyll` gem. Use semantic versioning and changelog entries when cutting releases.

## CLI

- `pnpm --filter @vislab/cli exec vislab build` — copy IIFE bundles for static hosting.
- `pnpm --filter @vislab/cli exec vislab widget -c CpuPipeline -o ./out` — standalone iframe-friendly HTML.

## Visual regression

Widget screenshots live in `apps/demo-blog/e2e/visual.spec.ts-snapshots/`. CI runs them via Playwright after `astro build` (Chromium visuals + WebKit smoke/mobile).

Update baselines after intentional UI changes:

```bash
pnpm --filter demo-blog run build
pnpm --filter demo-blog exec playwright test e2e/visual.spec.ts --project=chromium --update-snapshots
```

Commit the changed PNG files with your widget PR.

## Docs & media helpers

```bash
pnpm run docs:widgets    # regenerate component MDX from registry (preserves hand-flagship pages)
pnpm run sri             # write docs/SRI.md integrity hashes after build
pnpm run media:capture   # README/OG stills into docs/media/ (needs demo-blog build + chromium)
```

## Widget runtime (SimClock + Static export)

All widgets should use `attachWidgetRuntime` from `packages/components/src/ui/widgetRuntime.ts` after `new Scene(canvas)` so pause/speed controls, reduced-motion defaults, and SVG a11y export stay consistent.
