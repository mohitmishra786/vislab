<div align="center">

# VisLab

_"Complexity is the enemy of understanding."_

High-fidelity systems engineering visualizations for the modern web.

[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Monorepo](https://img.shields.io/badge/monorepo-turborepo-orange?style=flat-square)](https://turbo.build/)
[![Aesthetic](https://img.shields.io/badge/style-planetscale-black?style=flat-square)](https://planetscale.com/blog/io-devices-and-latency)

</div>

---

## Packages

| Package                               | Version | Description                                                               |
| :------------------------------------ | :------ | :------------------------------------------------------------------------ |
| **@vislab/core**                      | `0.0.0` | Canvas engine, `SimClock`, primitives, themes                             |
| **@vislab/components**                | `0.0.0` | Simulation classes (IIFE global **`VisLab`**)                             |
| **@vislab/registry**                  | `0.0.0` | Single manifest for every widget (metadata + `create`)                    |
| **@vislab/react**                     | `0.0.0` | React / MDX via `VislabMount` and named exports                           |
| **@vislab/web-components**            | `0.0.0` | Embeds: custom elements, `[data-vislab]`, IIFE **`VisLabEmbeds`**         |
| **@vislab/cli**                       | `0.2.0` | `vislab build`, `widget`, `preview`, `new`                                |
| **@vislab/exporter**                  | `0.0.0` | Puppeteer PNG frame capture → GIF/MP4 tooling                             |
| **vislab-jekyll** (gem)               | `0.1.0` | Jekyll layout + includes ([packages/jekyll-theme](packages/jekyll-theme)) |
| **studio** / **docs** / **demo-blog** | —       | Astro apps: composer, registry docs, React demo                           |

---

Technical writing is often trapped between two extremes: static, lifeless diagrams that fail to capture temporal complexity, and heavyweight video embeds that hurt SEO and load times.

**VisLab** takes a different approach. It provides a lightweight, GPU-accelerated visualization engine designed specifically for systems engineering (CPU pipelines, cache hierarchies, storage latency, and OS internals).

The visuals are not just images—they are living simulations running at 60fps, mapped strictly to technical metrics.

## The PlanetScale Aesthetic

_"Simplicity is the ultimate sophistication."_ — Leonardo da Vinci

VisLab follows a "PlanetScale-style" visual philosophy: bare-metal, retro, and unapologetically technical.

- **Flat Geometry**: No gradients, no dropshadows, no "fluff". Just precise matte shapes.
- **Strict Monospace**: Powered by `JetBrains Mono` for maximum legibility in technical contexts.
- **Latency Logic**: Animations are not just "tweened"—they are simulated. A storage race between NVMe and HDD actually moves at relative speeds proportional to their physical latencies.

## What It Actually Does

When you drop a VisLab component into your technical blog or documentation site, you aren't just showing a diagram. You are providing a playground:

- **Storage Latency Comparison**: A horizontal race track showing the gargantuan gap between L1 cache, NVMe, and rotational HDDs.
- **CPU Pipeline Simulation**: A granular look at instructions flowing through Fetch, Decode, and Execute stages.
- **Cache Hierarchies**: Visualizing hits, misses, and evictions across L1/L2/L3 boundaries.
- **Process Scheduling**: Interactive Gantt charts showing context switching and queue priorities in real-time.

## The Authoring Workflow

VisLab is designed to work where technical writers work:

1. **The CLI**: `pnpm --filter @vislab/cli exec vislab build` writes `vislab.min.js` + `vislab-embed.min.js`; `vislab widget -c CpuPipeline` emits iframe-ready HTML.
2. **The Studio**: `pnpm --filter studio dev` — registry-driven picker, live preview, **Copy MDX** snippets.
3. **The Adapters**: **React** (`@vislab/react`), **custom elements** + **`[data-vislab]`** (embed script), and **Jekyll** includes — all driven by `@vislab/registry`.

## Quickstart

Copy-paste guides for **React/Astro**, **static HTML**, and **Jekyll**: [docs/QUICKSTART.md](docs/QUICKSTART.md).  
Roadmap and open work: [TODOS.md](TODOS.md) · [GitHub Issues](https://github.com/mohitmishra786/vislab/issues).

## Architecture

- **Core Engine**: A custom entity-component-system (ECS) built purely on the HTML5 Canvas API. Zero external dependencies.
- **SimClock**: A deterministic simulation clock that allows pausing, slowing down time (0.1x), or speeding up time (10x) for deep analysis.
- **Monorepo Structure**: Managed via `pnpm` and `Turborepo` for rapid development and standardized builds.

## Releases and versioning

All npm packages use `0.x` until the public API stabilizes. Publish with `pnpm -r publish` from a clean `main` (after `pnpm run build` and `pnpm run test`). The Jekyll theme is versioned in `vislab-jekyll.gemspec`. See [CONTRIBUTING.md](CONTRIBUTING.md) for adding a component via the registry.

---

MIT License
