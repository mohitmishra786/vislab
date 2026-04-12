<div align="center">

# VisLab

*"Complexity is the enemy of understanding."*

High-fidelity systems engineering visualizations for the modern web. 

[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Monorepo](https://img.shields.io/badge/monorepo-turborepo-orange?style=flat-square)](https://turbo.build/)
[![Aesthetic](https://img.shields.io/badge/style-planetscale-black?style=flat-square)](https://planetscale.com/blog/io-devices-and-latency)

</div>

---

## Packages

| Component | Version | Description |
| :--- | :--- | :--- |
| **@vislab/core** | `0.0.0` | The zero-dependency Canvas rendering engine & SimClock |
| **@vislab/components** | `0.0.0` | A library of 15+ systems engineering visualizations |
| **@vislab/react** | `0.0.0` | Type-safe React wrappers for modern web frameworks |
| **@vislab/cli** | `0.1.0` | Scaffolding and build tool for interactive technical posts |
| **@vislab/studio** | `0.1.0` | The official web-based component composer (Astro + Tailwind) |

---

Technical writing is often trapped between two extremes: static, lifeless diagrams that fail to capture temporal complexity, and heavyweight video embeds that hurt SEO and load times.

**VisLab** takes a different approach. It provides a lightweight, GPU-accelerated visualization engine designed specifically for systems engineering (CPU pipelines, cache hierarchies, storage latency, and OS internals). 

The visuals are not just images—they are living simulations running at 60fps, mapped strictly to technical metrics.

## The PlanetScale Aesthetic

*"Simplicity is the ultimate sophistication."* — Leonardo da Vinci

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

1. **The CLI**: Use `vislab new` to scaffold a component and `vislab build` to generate standalone IIFE bundles.
2. **The Studio**: Launch a local playground to tweak parameters, colors, and simulation speeds via a drag-and-drop interface.
3. **The Adapters**: Native support for **Astro**, **React**, and **Web Components**. Whether you're using MDX or a standard HTML template, VisLab "just works" via Island Architecture.

## Architecture

- **Core Engine**: A custom entity-component-system (ECS) built purely on the HTML5 Canvas API. Zero external dependencies.
- **SimClock**: A deterministic simulation clock that allows pausing, slowing down time (0.1x), or speeding up time (10x) for deep analysis.
- **Monorepo Structure**: Managed via `pnpm` and `Turborepo` for rapid development and standardized builds.

## Looking Ahead

The roadmap includes a native video exporter (`tools/exporter`) to turn your interactive simulations into high-quality MP4/GIFs for social sharing, and an expanded library of algorithms from Distributed Systems (Raft, Paxos) and Networking (TCP/IP stack).

---

MIT License
