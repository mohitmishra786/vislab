# VisLab Roadmap

> Registry-first platform for systems engineering visualizations.  
> Track work in [GitHub Issues](https://github.com/mohitmishra786/vislab/issues) — this file is the high-level map.

---

## Current state (June 2026)

| Layer                          | Status                                                          |
| ------------------------------ | --------------------------------------------------------------- |
| Core engine (`@vislab/core`)   | Done — Scene, SimClock, primitives, themes                      |
| Widgets (`@vislab/components`) | 17 registered; **StorageComparison** flagship; others schematic |
| Registry (`@vislab/registry`)  | Done — single manifest for all adapters                         |
| React / Web Components         | Done — `VislabMount`, `data-vislab`, auto custom elements       |
| CLI                            | Done — `build`, `widget`, `preview`, `new`                      |
| Studio                         | Partial — picker + preview + MDX copy                           |
| Docs site                      | Minimal — registry list only                                    |
| CI                             | Lint, typecheck, test, build, e2e                               |
| npm publish                    | Not yet                                                         |
| Video export                   | PNG frames only                                                 |

**Not release-ready.** Target pre-release only after widget fidelity + docs + quickstart validation.

---

## Phase: pre-release

Blocks first `npm` tag. Issues: [#3](https://github.com/mohitmishra786/vislab/issues/3), [#4](https://github.com/mohitmishra786/vislab/issues/4), [#8](https://github.com/mohitmishra786/vislab/issues/8), [#11](https://github.com/mohitmishra786/vislab/issues/11), [#33](https://github.com/mohitmishra786/vislab/issues/33), [#35](https://github.com/mohitmishra786/vislab/issues/35)

- [x] Registry platform consolidation (PR #2)
- [x] CI pnpm + e2e fixes
- [x] Typecheck in CI
- [x] Dependabot reduction (47 → 17)
- [x] Quickstart guide ([docs/QUICKSTART.md](docs/QUICKSTART.md))
- [ ] Remaining high-severity audit items

---

## Phase: beta

Required for public beta. Issues: [#5](https://github.com/mohitmishra786/vislab/issues/5)–[#31](https://github.com/mohitmishra786/vislab/issues/31)

### Platform

- [ ] Registry `props` schema for all 17 widgets ([#16](https://github.com/mohitmishra786/vislab/issues/16))
- [ ] Studio registry-driven property editor ([#17](https://github.com/mohitmishra786/vislab/issues/17))
- [ ] Studio embed export tabs ([#18](https://github.com/mohitmishra786/vislab/issues/18))
- [ ] Changesets + publish workflow ([#7](https://github.com/mohitmishra786/vislab/issues/7))
- [ ] Component lifecycle tests ([#6](https://github.com/mohitmishra786/vislab/issues/6))
- [ ] Visual regression tests ([#5](https://github.com/mohitmishra786/vislab/issues/5))
- [ ] Bundle size budget ([#31](https://github.com/mohitmishra786/vislab/issues/31))

### Widget fidelity

- [ ] CpuPipeline flagship ([#19](https://github.com/mohitmishra786/vislab/issues/19))
- [ ] CacheSimulator flagship ([#20](https://github.com/mohitmishra786/vislab/issues/20))
- [ ] ProcessScheduler flagship ([#21](https://github.com/mohitmishra786/vislab/issues/21))
- [ ] VirtualMemory + TLBWalk ([#22](https://github.com/mohitmishra786/vislab/issues/22))
- [ ] SortRace flagship ([#23](https://github.com/mohitmishra786/vislab/issues/23))
- [ ] StorageComparison → shared articleChrome ([#25](https://github.com/mohitmishra786/vislab/issues/25))
- [ ] demo-blog all 17 widgets ([#29](https://github.com/mohitmishra786/vislab/issues/29))

### Docs & distribution

- [ ] Starlight docs site ([#12](https://github.com/mohitmishra786/vislab/issues/12))
- [ ] Live component gallery ([#13](https://github.com/mohitmishra786/vislab/issues/13))
- [ ] API reference from JSDoc ([#14](https://github.com/mohitmishra786/vislab/issues/14))
- [ ] Integration guides ([#15](https://github.com/mohitmishra786/vislab/issues/15))
- [ ] npm pre-release publish ([#9](https://github.com/mohitmishra786/vislab/issues/9))
- [ ] Jekyll gem publish ([#10](https://github.com/mohitmishra786/vislab/issues/10))
- [ ] CLI project scaffolds ([#26](https://github.com/mohitmishra786/vislab/issues/26))

---

## Phase: 1.0

Polish and ecosystem. Issues: [#24](https://github.com/mohitmishra786/vislab/issues/24), [#27](https://github.com/mohitmishra786/vislab/issues/27)–[#34](https://github.com/mohitmishra786/vislab/issues/34)

- [ ] Depth pass on remaining 10 widgets
- [ ] GIF + MP4 export pipeline
- [ ] Accessibility (keyboard, ARIA)
- [ ] Third-party widget registration API
- [ ] vislab-examples repo

---

## Architecture (current)

```
@vislab/core          → Canvas ECS, SimClock, primitives
@vislab/components    → 17 widget classes (IIFE: VisLab)
@vislab/registry      → Metadata + create() — single source of truth
@vislab/react         → VislabMount + catalog exports
@vislab/web-components → Custom elements + [data-vislab]
@vislab/cli           → build, widget, preview, new
vislab-jekyll         → Jekyll includes
```

Adding a widget: see [CONTRIBUTING.md](CONTRIBUTING.md).

---

_Last updated: June 2026_
