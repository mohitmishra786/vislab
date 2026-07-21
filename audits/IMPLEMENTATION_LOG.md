# VisLab Audit Implementation Log

**Started:** 2026-07-21  
**Last updated:** 2026-07-21 (issues #56 #55 #54 #51 #49)

**Status legend:** `[ ]` not started · `[~]` in progress · `[x]` done · `[-]` deferred (reason) · issue filed

---

## Issues batch (feat/issues-56-55-54-51-49)

| Issue | Title | Status |
|-------|--------|--------|
| [#56](https://github.com/mohitmishra786/vislab/issues/56) | Astro 7 + Starlight 0.41 | **[x]** shipped on main via PR #61 (`astro@7.1.3`, `@astrojs/starlight@0.41.3`, peers, setup-node@v7). Docs/demo-blog/studio build green. |
| [#55](https://github.com/mohitmishra786/vislab/issues/55) | SimClock polish long-tail | **[x]** `createLiveSummary` + per-widget `summary.set` on interactions; `showStaticExport: false` for pure step widgets; Studio maturity badges already present. |
| [#54](https://github.com/mohitmishra786/vislab/issues/54) | Audit doc contradictions | **[x]** docs honesty pass: npm unpublished, Canvas 2D, CLI 0.2.0, Node ≥22.12, no vislab.dev, Jekyll gem path-only until RubyGems. Remaining H1/H2 are human (#57). |
| [#51](https://github.com/mohitmishra786/vislab/issues/51) | Per-widget code-splitting | **[x]** multi-entry tsup + `@vislab/components/widgets/*`, `createVislabComponentAsync`, `initVislabEmbedsLazy`, bundle budget graph check. |
| [#49](https://github.com/mohitmishra786/vislab/issues/49) | README GIF | **[x]** `docs/media/storage-comparison.gif` + `.webm` via `pnpm run media:gif`; linked in README; CONTRIBUTING documented. |

---

## Final summary (prior pass)

| Area | Status |
|------|--------|
| SimClock on all 17 widgets | **[x]** via `attachWidgetRuntime` |
| prefers-reduced-motion | **[x]** default startPaused when reduced motion |
| Mobile 375px smoke | **[x]** `e2e/mobile.spec.ts` (5 flagships) |
| Studio flagship/beta badges | **[x]** maturity on registry + Studio UI |
| Static SVG a11y twin | **[x]** Static export button + unit tests |
| Visual regression refresh | **[x]** platform-tagged full-widget baselines |
| Dispose audit | **[x]** lifecycle asserts empty DOM + canvas/summary/clock |
| README media + OG | **[x]** docs/media/*.png + GIF/WebM |
| SRI hashes | **[x]** docs/SRI.md + `pnpm run sri` |
| Pack-install CI | **[x]** `.github/workflows/pack-smoke.yml` |
| Props tables / 12 docs | **[x]** `pnpm run docs:widgets` generated |
| WebKit Playwright | **[x]** project + CI install |
| Screencast 90s | **[-]** issue #50 |
| Outreach execution | **[-]** issue #52 |
| Human decisions H1–H9 | **[-]** issue #57 |

### GitHub issues filed

| # | Title |
|---|--------|
| [#49](https://github.com/mohitmishra786/vislab/issues/49) | README GIF / short demo animation |
| [#50](https://github.com/mohitmishra786/vislab/issues/50) | 90s first-embed screencast |
| [#51](https://github.com/mohitmishra786/vislab/issues/51) | Per-widget IIFE code-splitting |
| [#52](https://github.com/mohitmishra786/vislab/issues/52) | Outreach / GSC / rankings |
| [#53](https://github.com/mohitmishra786/vislab/issues/53) | Visual snapshot refresh process |
| [#54](https://github.com/mohitmishra786/vislab/issues/54) | Audit contradictions checklist |
| [#55](https://github.com/mohitmishra786/vislab/issues/55) | Long-tail SimClock polish |
| [#56](https://github.com/mohitmishra786/vislab/issues/56) | Astro 7 + Starlight 0.41 upgrade |
| [#57](https://github.com/mohitmishra786/vislab/issues/57) | Human decisions H1–H9 |

---

## Needs Human Decision (unchanged)

H1 npm publish · H2 Pages deploy · H3 brand · H4 founder goal · H5 Sponsors · H6 launch posts · H7 Discussions · H8 consulting contact · H9 launch availability  
→ tracked in **#57**

---

## Bundle size note

Full catalog IIFE ≈ **22 KB** gzip · Embeds ≈ **28 KB** gzip · largest per-widget ESM graph ≈ **6.5 KB** gzip (budget 36 KB).

---

## Verification (this batch)

- `pnpm run test` — core 5 + components 22 + registry 23 pass  
- `pnpm --filter @vislab/components typecheck` / registry typecheck pass  
- `pnpm --filter docs build` (Astro 7.1 + Starlight 0.41) pass  
- `pnpm --filter demo-blog build` pass  
- `node scripts/check-bundle-size.mjs` pass  
- GIF/WebM generated under `docs/media/`
