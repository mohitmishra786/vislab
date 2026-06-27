# VisLab Roadmap

> Registry-first platform for systems engineering visualizations.  
> Track work in [GitHub Issues](https://github.com/mohitmishra786/vislab/issues) — this file is the high-level map.

---

## Current state (June 2026)

| Layer                          | Status                                                          |
| ------------------------------ | --------------------------------------------------------------- |
| Core engine (`@vislab/core`)   | Done — Scene, SimClock, primitives, themes                      |
| Widgets (`@vislab/components`) | 17 registered; all use shared `articleChrome` variants          |
| Registry (`@vislab/registry`)  | Done — single manifest, props schema, third-party registration  |
| React / Web Components         | Done — `VislabMount`, `data-vislab`, auto custom elements       |
| CLI                            | Done — `build`, `widget`, `preview`, `new`, `export` (GIF/MP4)  |
| Studio                         | Done — picker, registry property panel, embed export tabs       |
| Docs site                      | Starlight — live gallery for all 17 widgets + guides + API      |
| CI                             | Lint, typecheck, test, build, e2e, visual regression, bundle    |
| npm publish                    | Prepared (`publishConfig`, Changesets workflow) — not tagged  |
| Video export                   | GIF + MP4 via ffmpeg                                            |

**Pre-release ready.** Remaining before `npm` tag: Astro 6 migration for last 2 high-severity advisories, then publish.

---

## Phase: pre-release

Issues: [#3](https://github.com/mohitmishra786/vislab/issues/3), [#4](https://github.com/mohitmishra786/vislab/issues/4), [#8](https://github.com/mohitmishra786/vislab/issues/8), [#11](https://github.com/mohitmishra786/vislab/issues/11), [#33](https://github.com/mohitmishra786/vislab/issues/33), [#35](https://github.com/mohitmishra786/vislab/issues/35)

- [x] Registry platform consolidation (PR #2)
- [x] CI pnpm + e2e fixes
- [x] Typecheck in CI
- [x] Dependabot reduction (47 → 12; happy-dom, vite, esbuild, babel patched)
- [x] Quickstart guide ([docs/QUICKSTART.md](docs/QUICKSTART.md))
- [ ] Astro 6 upgrade (2 remaining high-severity advisories on Astro 5)

---

## Phase: beta

Issues: [#5](https://github.com/mohitmishra786/vislab/issues/5)–[#31](https://github.com/mohitmishra786/vislab/issues/31)

### Platform

- [x] Registry `props` schema for all 17 widgets ([#16](https://github.com/mohitmishra786/vislab/issues/16))
- [x] Studio registry-driven property editor ([#17](https://github.com/mohitmishra786/vislab/issues/17))
- [x] Studio embed export tabs ([#18](https://github.com/mohitmishra786/vislab/issues/18))
- [x] Changesets + publish workflow ([#7](https://github.com/mohitmishra786/vislab/issues/7))
- [x] Component lifecycle tests ([#6](https://github.com/mohitmishra786/vislab/issues/6))
- [x] Visual regression tests — 17 widget snapshots ([#5](https://github.com/mohitmishra786/vislab/issues/5))
- [x] Bundle size budget ([#31](https://github.com/mohitmishra786/vislab/issues/31))

### Widget fidelity

- [x] CpuPipeline flagship ([#19](https://github.com/mohitmishra786/vislab/issues/19))
- [x] CacheSimulator flagship ([#20](https://github.com/mohitmishra786/vislab/issues/20))
- [x] ProcessScheduler flagship ([#21](https://github.com/mohitmishra786/vislab/issues/21))
- [x] VirtualMemory + TLBWalk ([#22](https://github.com/mohitmishra786/vislab/issues/22))
- [x] SortRace flagship ([#23](https://github.com/mohitmishra786/vislab/issues/23))
- [x] StorageComparison → shared articleChrome ([#25](https://github.com/mohitmishra786/vislab/issues/25))
- [x] demo-blog all 17 widgets ([#29](https://github.com/mohitmishra786/vislab/issues/29))

### Docs & distribution

- [x] Starlight docs site ([#12](https://github.com/mohitmishra786/vislab/issues/12))
- [x] Live component gallery — all 17 MDX pages ([#13](https://github.com/mohitmishra786/vislab/issues/13))
- [x] API reference from JSDoc ([#14](https://github.com/mohitmishra786/vislab/issues/14))
- [x] Integration guides ([#15](https://github.com/mohitmishra786/vislab/issues/15))
- [x] npm pre-release publish prep ([#9](https://github.com/mohitmishra786/vislab/issues/9))
- [x] Jekyll gem publish prep ([#10](https://github.com/mohitmishra786/vislab/issues/10))
- [x] CLI project scaffolds ([#26](https://github.com/mohitmishra786/vislab/issues/26))

---

## Phase: 1.0

Issues: [#24](https://github.com/mohitmishra786/vislab/issues/24), [#27](https://github.com/mohitmishra786/vislab/issues/27)–[#34](https://github.com/mohitmishra786/vislab/issues/34)

- [x] Depth pass on remaining 10 widgets ([#24](https://github.com/mohitmishra786/vislab/issues/24))
- [x] GIF + MP4 export pipeline ([#27](https://github.com/mohitmishra786/vislab/issues/27), [#28](https://github.com/mohitmishra786/vislab/issues/28))
- [x] Accessibility — ARIA labels on chrome ([#30](https://github.com/mohitmishra786/vislab/issues/30))
- [x] Third-party widget registration API ([#32](https://github.com/mohitmishra786/vislab/issues/32))
- [x] HTML examples folder ([#34](https://github.com/mohitmishra786/vislab/issues/34))

---

## Architecture (current)

```
@vislab/core          → Canvas ECS, SimClock, primitives
@vislab/components    → 17 widget classes (IIFE: VisLab)
@vislab/registry      → Metadata + create() — single source of truth
@vislab/react         → VislabMount + catalog exports
@vislab/web-components → Custom elements + [data-vislab]
@vislab/cli           → build, widget, preview, new, export
vislab-jekyll         → Jekyll includes
```

Adding a widget: see [CONTRIBUTING.md](CONTRIBUTING.md).

---

_Last updated: June 2026_