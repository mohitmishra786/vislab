# VisLab Audit §2 — Product / UI Design

**Audit date:** 2026-07-21  
**Scope:** Visual quality vs PlanetScale aesthetic, consistency, a11y of canvas, responsive/mobile, theming, animation & SimClock UX  
**Evidence:** Source of themes/chrome/widgets + Playwright snapshots present in repo; visual judgment of design system in code (not a live pixel review of all 17 on a device matrix)

---

## Executive verdict

VisLab has a **coherent design system skeleton** (shared `articleChrome` variants, monospace themes, matte palette) that is directionally aligned with the PlanetScale blog aesthetic it cites. Execution is **uneven across widgets**: flagships (StorageComparison, CpuPipeline) show intentional craft; many others are thinner. The biggest product-design risk is not taste — it is **canvas-as-UI**: accessibility, SEO of embedded content, and mobile usability of fixed schematic layouts. The marketed SimClock (pause / 0.1× / 10×) is **real in the engine** but **inconsistently exposed in the product UI**.

---

## Stated aesthetic vs. implementation

**Claim [README, verified]:** “PlanetScale-style” — flat geometry, no gradients/drop shadows, JetBrains Mono, latency-mapped animation. Inspiration badge links to [PlanetScale’s IO devices and latency post](https://planetscale.com/blog/io-devices-and-latency) (interactive systems education content that did well on HN in 2025).

**Theme tokens [verified in `packages/core/src/themes/index.ts`]:**
| Theme id | Character |
|----------|-----------|
| `dark-premium` / `dark-terminal` | `#111` bg, cyan/green/red/purple accents, JetBrains Mono |
| `light-academic` | white/slate, sky/emerald accents |
| `high-contrast` | black/white + pure accent colors, Courier New fallback |

No gradients in theme objects. Borders are 1px solids. Fonts are monospace-only. **Claim holds at the token level.**

**Chrome system [verified `articleChrome.ts`]:** four variants — `article`, `diagram`, `toolbar`, `terminal` — with different padding, title casing, border radius, and left accent rail. This is the right abstraction for consistency.

**PlanetScale comparison [web, 2025–2026]:** PlanetScale’s IO post is narrative-first, custom interactive scenes, speed control, request queue visualization. VisLab’s `StorageComparison` literally titles itself “IO devices and latency” and races L1 / NVMe / etc. — intentional homage. Differentiation risk: readers may see VisLab as a clone kit rather than a general systems viz platform unless other widgets feel equally intentional.

---

## Consistency across 17 widgets

**What enforces consistency [verified]:**
- Shared chrome + `styleVislabButton`
- Registry metadata (`displayName`, `category`, props including `themeName`)
- Visual regression snapshots for all 17 ids under `apps/demo-blog/e2e/visual.spec.ts-snapshots/`

**What breaks consistency [verified + reasonable inference from code structure]:**
- Control surfaces differ: CpuPipeline has Pause/Step; StorageComparison has “Trigger I/O”; many widgets expose fewer or no speed controls
- Canvas heights hard-coded per chrome defaults (168–400px) — not a single responsive “fill parent” contract
- Simulation fidelity varies: registry tests only assert mount/destroy, not visual richness
- Component MDX docs are nearly identical stubs (~18–26 words) — docs don’t teach visual language either

**[reasonable inference]** Without a live gallery walkthrough in this audit, treat “flagship” status in TODOS (CpuPipeline, CacheSimulator, ProcessScheduler, SortRace, StorageComparison) as the intentional quality tier; remaining widgets likely lag. That tiering should be **product-honest** in marketing (“5 flagship, 12 solid”) rather than “17 high-fidelity.”

---

## Accessibility (critical risk)

**Documented stance [CONTRIBUTING.md, verified]:**
> Canvas content is visual-only; document widget purpose in surrounding prose for screen reader users.

**Implemented a11y [verified via grep]:**
- Buttons get `role="button"` and `aria-label` via `styleVislabButton`
- CpuPipeline explicitly labels Play/Pause and Step
- Widget roots get `data-vislab-widget` (test ids, not a11y)

**Missing [verified absence]:**
- No `aria-label` / `role="img"` / `aria-describedby` on `<canvas>` elements in sampled widgets
- No live region announcing simulation state (hit/miss, stage, queue depth)
- No keyboard map for canvas interactions beyond focusable header buttons
- No reduced-motion handling (`prefers-reduced-motion`)
- No text alternative export (SVG/HTML table twin) for SEO or SR users

**Why this matters for the product:** Target users are technical writers and educators. Accessibility failures are not just compliance — they are **adoption blockers** for universities, public-sector docs, and many company design systems. Canvas-only content also undermines the README’s SEO argument (see §4).

**Industry context [web search 2025–2026]:** Canvas is not exposed as a DOM tree; WCAG-aligned practice requires accessible names, textual equivalents, and operable controls outside the bitmap. VisLab partially has exterior controls; it does not have content equivalents.

---

## Responsiveness & mobile

**[verified]** `Scene` uses `ResizeObserver` + devicePixelRatio scaling — canvases redraw at CSS size. Good foundation.

**[reasonable inference / risk]** Widget layouts use absolute coordinates (e.g. CpuPipeline stages at fixed `stageWidth = 64`, StorageComparison CPU block at fixed geometry). Resizing the canvas without reflowing entities produces **letterboxed or cramped diagrams**, not true responsive redesign. Mobile phones will see tiny stage labels or horizontal overflow depending on parent width.

**Product requirement for launch:** define a minimum width (e.g. 360px) and either (a) horizontal scroll with clear affordance, or (b) simplified mobile layouts for flagships.

---

## Theming & dark mode

**Strengths:** three named themes + `themeName` prop on every registry entry (enforced by registry tests). Studio property panel can drive theme.

**Gaps:**
- No automatic `prefers-color-scheme` detection
- JetBrains Mono is referenced by name but **not bundled** in core — host page must load the font or fall back to Courier New
- Light theme exists but dark is the aesthetic default and marketing face
- No CSS custom property bridge for host-site token integration

For blog embeds, **font FOUC** and theme clash with light blogs are real UX bugs.

---

## Animation quality & SimClock usability

**Engine [verified `SimClock.ts`]:**
- `speed` clamped **0.1–10.0**
- `pause` / `resume` / `togglePause`
- Deterministic-ish sim time via real dt × multiplier
- Unit tests cover accumulation, speed, pause

**Product exposure [verified]:**
- StorageComparison accepts `speed` prop and applies to `scene.clock.speed`
- CpuPipeline uses pause + sets speed ~1.5 for play; Step advances
- **No universal SimClock control strip** (0.1× / 1× / 10× slider) across all widgets
- README markets SimClock as a platform feature; UX is **per-widget ad hoc**

**Usability assessment:** Engine is fine for a 0.x ECS. As a **product control**, educators need visible time control on every temporal widget. Without it, “living simulation” often means “autoplay you can’t interrogate,” which is worse than a static diagram for teaching.

**Animation quality [reasonable inference]:** Primitives (`AnimatedRect`, `AnimatedArc`, `Arrow`, `QueueViz`) suggest tweened motion rather than full physics. Storage race uses velocity from latency constants — good pedagogical mapping. Flagship depth claimed in TODOS is not independently re-verified here for every widget.

---

## Visual design quality scorecard (product lens)

| Dimension | Score /10 | Note |
|-----------|-----------|------|
| Token/theme discipline | 8 | Clean, monospace, flat |
| Chrome consistency | 7 | Variants exist; application uneven |
| Flagship craft | 7 | Storage/CPU directionally strong |
| Long-tail widget craft | 4–6 | Needs honest tiering |
| A11y | 2 | Buttons only; canvas opaque |
| Mobile | 3 | Resize yes; reflow no |
| SimClock as UX | 4 | Engine yes; product surface no |
| Brand distinctiveness | 5 | Strong PlanetScale echo; name collisions (see §5/§8) |

---

## Pre-launch design priorities

1. **Accessible chrome contract** for every widget: labelled canvas, summary text node, reduced motion.
2. **Universal time controls** on temporal widgets (pause + speed steps).
3. **Mobile policy** documented and enforced in e2e at a second viewport.
4. **Font packaging** or explicit host-page font snippet in every embed guide.
5. **Honest gallery** on a real public URL (not `vislab.dev` — see domain issue in §4/§5).

---

## Checklist

- [ ] Add `role="img"` + descriptive `aria-label` (or `aria-labelledby` pointing at chrome title) on every canvas
- [ ] Emit a visually-hidden or collapsible **text summary** of current simulation state for SR + SEO
- [ ] Respect `prefers-reduced-motion` (pause autoplay; show static first frame)
- [ ] Ship a shared **SimClock control** component used by all temporal widgets (pause, 0.1×, 1×, 10×)
- [ ] Load or document JetBrains Mono for all four embed paths
- [ ] Define min-width + mobile behavior; add Playwright viewport 375px smoke for top 5 widgets
- [ ] Visual audit pass: screenshot gallery for all 17; mark flagship vs. beta in Studio/docs
- [ ] Ensure light-academic theme contrast meets WCAG for text in chrome (not just canvas)
- [ ] Avoid copying PlanetScale article titles/layout so closely that widgets feel derivative
- [ ] Add keyboard shortcuts help affordance (at least Space = pause where play exists)
- [ ] Consider SVG export path for static/print/a11y twin (post-launch is fine)
