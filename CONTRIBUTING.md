# Contributing to VisLab

## Adding a visualization

1. Implement the widget class in [`packages/components`](packages/components) (constructor `(container: HTMLElement)`, `destroy()` calling `this.scene.dispose()`, etc.).
2. Export the class from the appropriate `index.ts` under `cpu/`, `os/`, `algorithms/`, `compiler/`, or `storage/`, and from [`packages/components/src/index.ts`](packages/components/src/index.ts) if it is a new top-level entry.
3. Register it in [`packages/registry/src/registry.ts`](packages/registry/src/registry.ts) with `id`, `globalName`, `displayName`, `category`, `customElementTag`, optional `props`, and `create`.
4. Add a thin named export in [`packages/react/src/catalog.tsx`](packages/react/src/catalog.tsx) (wrap `VislabMount`) so MDX authors can import by component name.
5. Run `pnpm run build` and `pnpm run test` from the repo root.

The [`@vislab/web-components`](packages/web-components) package defines custom elements and `[data-vislab]` mounting from the same registry — no per-component CE files are required.

## Versioning and publish

Packages are published as `@vislab/*` on npm; the Jekyll theme is released as the `vislab-jekyll` gem. Use semantic versioning and changelog entries when cutting releases.

## CLI

- `pnpm --filter @vislab/cli exec vislab build` — copy IIFE bundles for static hosting.
- `pnpm --filter @vislab/cli exec vislab widget -c CpuPipeline -o ./out` — standalone iframe-friendly HTML.
