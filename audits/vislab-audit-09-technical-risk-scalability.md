# VisLab Audit §9 — Technical Risk & Scalability

**Audit date:** 2026-07-21  
**Evidence:** Scene/engine code, bundle budget script, CI logs, package graph, exporter README, maintainer stats

---

## Executive verdict

Technical risk is **moderate for a 0.x embed library** and **high for a solo maintainer promising four integration paths + headless video export**. Canvas performance and bundle budgets are thoughtfully constrained; multi-widget pages and pedagogical correctness are less proven. The bus factor is **one**. Puppeteer is correctly isolated to exporter but still taxes CI/docs complexity. Biggest near-term technical risk is not FPS — it is **shipping reliability** (red main CI) and **surface-area sprawl**.

---

## Canvas performance at scale

### Architecture [verified]
- `Scene`: `requestAnimationFrame` loop, entity list, `SimClock`, `Scheduler`
- DPR-aware resize via `ResizeObserver`
- Entities implement draw/update patterns (`AnimatedRect`, etc.)

### Risks
| Scenario | Risk | Notes |
|----------|------|-------|
| One widget / page | Low | Design target |
| Many widgets / page (docs gallery) | Medium | N independent rAF loops if each Scene starts |
| Large entity counts | Medium | No spatial index; O(n) draw |
| Background tabs | Low–medium | rAF throttles; clocks may drift |
| Low-end mobile | Medium | Fixed layouts + continuous animation burn battery |

**[reasonable inference]** Gallery pages (docs RegistryGallery, demo-blog index) can wake 17 animations — should use `client:visible` / IntersectionObserver to start scenes only when on screen. React path documents `client:visible` for Astro; static HTML path may auto-start on parse.

**Missing [verified absence]:** global “pause all,” shared clock across widgets, performance budgets beyond bundle size (no FPS CI metric).

---

## Bundle size

**Budgets [verified `scripts/check-bundle-size.mjs`]:**
| Artifact | Max gzip |
|----------|----------|
| VisLab IIFE (`packages/components/dist/index.global.js`) | **85 KB** |
| VisLabEmbeds IIFE (`packages/web-components/dist/index.global.js`) | **95 KB** |

**Measured locally 2026-07-21 [verified]:**
| Artifact | Raw | Gzip | Budget gzip |
|----------|-----|------|-------------|
| VisLab IIFE | 86.8 KB | **16.4 KB** | 85 KB ✓ |
| VisLabEmbeds IIFE | 100.0 KB | **18.8 KB** | 95 KB ✓ |

Embed weight is **excellent** for a 17-widget kit. Publish these numbers in README.

**Risk:** Monolithic IIFE means **one widget still downloads all 17** in the static embed path. Tree-shaking works better for ESM React imports **if** package entry points allow — currently single entry builds.

**Mitigation options:**
- Per-widget code-split entries for embed script  
- Dynamic `import()` by `data-vislab` name  
- Document React ESM path as smaller for single-widget pages  

---

## Browser compatibility

| API | Usage | Risk |
|-----|-------|------|
| Canvas 2D | Core | Universal modern browsers |
| `requestAnimationFrame` | Core | Fine |
| `ResizeObserver` | Scene | Fine on modern; no old IE |
| Custom elements | web-components | Fine modern |
| `performance.now` | SimClock | Fine |

**[verified]** No explicit browserslist; Node engines ≥ 22.12 for **build**, not runtime browser matrix.

**Risk:** No documented support matrix (Safari iOS quirks for canvas text, font loading). Visual regression is **Chromium-only** in Playwright config path (install chromium in CI).

---

## Multi-path maintenance burden

| Path | Package | Ongoing cost |
|------|---------|--------------|
| Core engine | `@vislab/core` | Medium |
| Widgets | `@vislab/components` | **High** (17 sims) |
| Registry | `@vislab/registry` | Low–medium |
| React | `@vislab/react` | Low (thin) |
| Web components | `@vislab/web-components` | Low–medium |
| Jekyll gem | `vislab-jekyll` | Medium (Ruby ecosystem separate) |
| CLI | `@vislab/cli` | Medium |
| Exporter | `@vislab/exporter` + Puppeteer | **High** |
| Apps docs/studio/demo | Astro ×3 | **High** (CI breakages already) |

**[verified]** Recent CI failures cluster on **Astro app builds**, not core packages — surface area tax is real.

**Recommendation:** For solo stage, declare **React + static embed** tier-1; Jekyll tier-2; exporter tier-3 (best effort). Document support tiers.

---

## Puppeteer / exporter risk

**[verified]** `@vislab/exporter` depends on `puppeteer@^24`; README requires Chromium download; used for PNG frames → GIF/MP4 (gifski/ffmpeg external).

**Implications:**
- Not needed for end users embedding widgets — good  
- CI should not install Puppeteer for default test path (currently e2e uses Playwright Chromium separately)  
- Security surface: browser automation dependency updates  
- Changesets **ignore** exporter from version coupling — good  

**Risk:** Feature marketing (“export GIF/MP4”) raises support load when ffmpeg/gifski missing on user machines.

---

## Single-maintainer bus factor

**[verified]** ~55 human commits from one person (Mohit / chessMan), Dependabot, ImgBot.

| Bus-factor risk | Severity |
|----------------|----------|
| Knowledge concentration | Critical |
| No CODEOWNERS diversity | High |
| Roadmap issues closed by author | Medium (no external contributors) |
| Security response capacity | High if popular |

**Mitigations:** excellent CONTRIBUTING widget recipe (already good); architecture docs; reduce paths; recruit 1–2 co-maintainers post-launch; add `SECURITY.md`.

---

## Correctness / educational risk

Simulations that teach **wrong** mental models are worse than static diagrams. Tests cover lifecycle, not LRU correctness, pipeline hazard rules, or CFS vs RR semantics.

**[risk]** Academic users will audit semantics. Flagship widgets need correctness notes and references.

---

## Dependency / supply chain

- Root overrides list shows active CVE whack-a-mole  
- Security audit workflow 403s on alert API — blind spot  
- Astro patch in `patches/` — upgrade fragility  
- `onlyBuiltDependencies: ["esbuild"]` — sensible  

---

## Scalability of the product (non-performance)

| Dimension | Can it scale? |
|-----------|---------------|
| Widget count to 50 | Registry yes; quality no without staff |
| Third-party widgets | API exists; no ecosystem yet |
| Versioning multi-package | Changesets ready; never used in prod |
| Breaking changes in 0.x | Expected; document migration |

---

## Top technical risks ranked

1. **Red CI / fragile Astro apps** — blocks trust and release  
2. **Monolithic embed bundle** — page weight for one widget  
3. **Bus factor = 1**  
4. **Canvas a11y/SEO** — adoption blockers (see §2/§4)  
5. **Pedagogical correctness untested**  
6. **Four-path support promise**  
7. **Puppeteer optional path complexity**  

---

## Checklist

- [ ] Restore green CI; treat main red as P0 outage
- [ ] Publish measured gzip sizes in README after green build
- [ ] Add IntersectionObserver / visible-only start for embeds
- [ ] Investigate per-widget code splitting for IIFE embed
- [ ] Define browser support matrix; add WebKit Playwright job later
- [ ] Document support tiers (React/static primary)
- [ ] Keep Puppeteer out of default consumer install docs
- [ ] Add correctness tests for CacheSimulator policy + CpuPipeline stages
- [ ] Cap concurrent animated widgets guidance in docs
- [ ] Add `SECURITY.md` + fix Dependabot alert workflow permissions
- [ ] Consider `CODEOWNERS` and 2FA/org best practices before fame
- [ ] Pause new embed paths until first three are rock-solid
- [ ] Memory/dispose audit: ensure all widgets call `scene.dispose` on destroy (partially tested)
- [ ] Evaluate `prefers-reduced-motion` for power/CPU savings
