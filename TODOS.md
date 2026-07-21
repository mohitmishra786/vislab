# VisLab Roadmap

> Living **Now / Next / Later** map. Detailed history lives in closed GitHub issues and `audits/`.

**Last updated:** 2026-07-21

---

## Now (launch blockers)

- [x] Restore green monorepo build (js-yaml pin, Starlight 0.40 for Astro 6)
- [x] Package metadata (exports, keywords, descriptions)
- [x] SECURITY.md + CODE_OF_CONDUCT.md
- [x] Flagship policy unit tests + mount error UI
- [x] Canvas a11y baseline + SimClock controls on flagships
- [ ] First **0.1.0 npm publish** (needs `NPM_TOKEN` + human approval)
- [ ] Deploy docs/demo to GitHub Pages (`mohitmishra786.github.io/vislab`)
- [ ] Set GitHub repo homepage to deployed demo URL

## Next (post-publish)

- [ ] Expand remaining widget docs beyond flagships
- [ ] Wire SimClock controls into all temporal widgets
- [ ] Consumer pack-install smoke tests in CI
- [ ] Mobile viewport e2e for top 5 widgets
- [ ] Flagship interactive blog series (content marketing)
- [ ] `good first issue` labels + ADOPTERS.md entries

## Later

- [ ] Astro 7 + Starlight 0.41 major upgrade (coordinated)
- [ ] Per-widget code-splitting for IIFE embed
- [ ] WebKit Playwright job
- [ ] SVG export / static twin for print a11y
- [ ] GitHub Sponsors after meaningful adoption (~100 stars)
- [ ] Custom domain (do **not** use `vislab.dev` — university collision)

## Support tiers (frozen)

| Tier | Paths | Policy |
| ---- | ----- | ------ |
| **1** | React/MDX (`@vislab/react`), static HTML embed | Fully supported |
| **2** | Jekyll gem | Best-effort; no new features until Tier 1 is rock-solid |
| **3** | Puppeteer exporter / GIF-MP4 | Optional tooling only |

## Architecture (current)

```
@vislab/core          → Canvas ECS, SimClock, primitives
@vislab/components    → 17 widget classes (IIFE: VisLab)
@vislab/registry      → Metadata + create() — single source of truth
@vislab/react         → VislabMount + catalog exports
@vislab/web-components → Custom elements + [data-vislab]
@vislab/cli           → build, widget, preview, new, export (0.2.0)
vislab-jekyll         → Jekyll includes (tier 2)
```

Adding a widget: see [CONTRIBUTING.md](CONTRIBUTING.md).

## Audit implementation

Progress against the 360° audit: [`audits/IMPLEMENTATION_LOG.md`](audits/IMPLEMENTATION_LOG.md).
