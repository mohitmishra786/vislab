# VisLab Audit §8 — Competitive Landscape

**Audit date:** 2026-07-21  
**Evidence:** Repo feature set + web search for 2025–2026 tools, education visualizers, and positioning comparables

---

## Executive verdict

VisLab does **not** compete for “general diagramming” against Mermaid or Excalidraw — it would lose on ubiquity and DX. Its real arena is **specialized systems/CS temporal visualizations embeddable in third-party sites**. There, competitors are fragmented: university simulators (often not embeddable), one-off blog canvases (PlanetScale), heavy notebooks (Observable), and algorithm sites (VisuAlgo). The whitespace is real: **npm-installable, registry-based, multi-framework systems widgets with a shared clock**. The moat is **not** the ECS engine (replicable); it is **catalog quality + embed reliability + content flywheel**. Today that moat is unbuilt in market terms (0 distribution).

---

## Competitor map

### A. General diagram / embed platforms

| Product | What it is | Stars / scale (approx., web 2026) | Overlap with VisLab |
|---------|------------|-----------------------------------|---------------------|
| **Mermaid.js** | Diagrams as code (flow, sequence, etc.) | ~89k GitHub stars | Low–medium: docs embeds; no systems sim |
| **Excalidraw** | Hand-drawn whiteboard | Massive adoption | Low: freeform, not curriculum sims |
| **D3.js** | Low-level viz toolkit | Ubiquitous | Indirect: people build custom sims |
| **Observable** | Reactive notebooks + embeds | Strong data-viz community | Medium: interactive essays; heavier runtime |
| **CodeSandbox / CodePen** | Runnable code embeds | Huge | Medium as *hosting* for custom demos, not a widget kit |
| **tldraw** | Infinite canvas SDK | Growing OSS | Low for CS systems pedagogy |

### B. Inspiration / aesthetic reference

| Product | Notes |
|---------|-------|
| **PlanetScale blog interactives** (IO latency Mar 2025, caching Jul 2025) | Explicit aesthetic inspiration; not a reusable open library for third parties |
| **Ben Dicken / educator interactive blogs** | Same genre; custom per article |

### C. CS education visualizers

| Product / class | Notes | Embed-in-your-blog? |
|-----------------|-------|---------------------|
| **VisuAlgo** | Classic algorithm visualizations | Generally portal-bound |
| **CS Field Guide**-style tools | Curriculum-integrated interactives | Often site-specific |
| **EDUCache / CPU pipeline teaching sims** | Academic simulators (papers, Java/desktop/web course tools) | Rarely npm packages for MDX |
| **GitHub one-off pipeline simulators** | e.g. multi-core pipeline GUI projects | Not productized embeds |
| **RISC-V / MIPS educational web sims** | Strong pedagogy, narrow architecture | Not a multi-widget registry for writers |

### D. Name collision “competitors” (brand, not product)

Multiple academic **VisLab**s and a CHI research system named VisLab. These don’t ship your widgets but **steal search and domain trust** (see §4).

---

## Feature / positioning comparison

| Capability | VisLab | Mermaid | Excalidraw | Observable embed | VisuAlgo-class | Custom canvas post |
|------------|--------|---------|------------|------------------|----------------|--------------------|
| Systems temporal sim | **Yes (focus)** | No | No | DIY | Partial | DIY |
| npm React component | **Designed** (unreleased) | Yes | Yes (libs) | Different model | No | No |
| Jekyll / static HTML | **Yes** | Yes | Image export | iframe | iframe site | ad hoc |
| Authoring for writers | Studio/CLI | Markdown fence | Draw UI | Notebook | N/A | Code |
| Aesthetic systems terminal | **Yes** | Generic | Sketchy | Custom | Academic UI | Custom |
| Zero install on GitHub README | No | **Native on GH** | Image | No | No | Image |
| Catalog of 17 CS widgets | **Yes** | N/A | N/A | N/A | Broad algos | 1 |
| A11y of content | Weak (canvas) | Better (SVG/DOM) | Mixed | Mixed | Mixed | Mixed |
| SEO of figure | Weak | Better | Image alt | Mixed | Portal SEO | Prose |
| Market traction | **0** | Dominant | Dominant | Strong | Niche famous | Viral posts |

---

## Differentiation (honest)

### Genuinely differentiated
1. **Domain pack:** CPU/OS/storage/compiler widgets as one registry  
2. **Writer-oriented adapters:** React MDX + Jekyll includes + `data-vislab`  
3. **SimClock** concept for scrubbing pedagogical time  
4. **Shared PlanetScale-like visual language** across widgets  

### Not differentiated / weak
1. Canvas ECS engine — weekend-replicable for a strong FE engineer  
2. “Interactive blog viz” genre — PlanetScale already won mindshare  
3. Algorithm widgets (sort, graph) — VisuAlgo and countless demos exist  
4. Brand name — occupied  

### Redundant if mispositioned
If marketed as “diagram library,” Mermaid wins.  
If marketed as “whiteboard,” Excalidraw wins.  
If marketed as “data viz,” D3/Observable win.

**Positioning must stay:** embeddable **systems simulations** for docs and teaching.

---

## Moat analysis

| Moat type | Strength today | Notes |
|-----------|----------------|-------|
| Technology (ECS) | **Weak** | Clean but not hard to clone |
| Widget catalog | **Medium potential** | 17 is a start; depth matters more than count |
| Framework integrations | **Medium** | Real work to match React+CE+Jekyll+CLI |
| Brand / community | **None** | 0 stars |
| Content / SEO | **None** | No public demos ranking |
| Data network effects | **None** | No user-generated widget network yet |
| Standards lock-in | **None** | |

**[blunt]** A well-funded docs company or a popular educator could replicate the *idea* quickly. They are less likely to maintain **17 consistent embeds + multi-framework packaging** unless the category is proven. VisLab’s race is to become the **default named solution** before someone else productizes the PlanetScale-interactive pattern.

**Third-party registration API** (`registerVislabWidget`) is a seed for ecosystem moat — only matters if external widgets appear.

---

## Whitespace VisLab could own

1. **“Systems MDX components” standard** — the shadcn of CS education widgets  
2. **Latency-accurate teaching kit** used by eng blogs (cache, IO, scheduling)  
3. **Export-to-GIF for social** while keeping live embed on the article  
4. **Accessible systems sims** — if VisLab solves canvas a11y, it leaps academic tools  
5. **Course pack integrations** (Moodle/Canvas LMS) — few OSS options are embed-quality  

Whitespace that is **not** worth chasing: general diagramming, freeform design, BI dashboards.

---

## Competitive threats (2026)

| Threat | Likelihood | Mitigation |
|--------|------------|------------|
| Educators keep using custom CodePen | High | Lower install friction below custom code |
| Mermaid adds more diagram types | Medium | Don’t compete on static diagrams |
| Docs platforms ship native interactive blocks | Medium | Become the content partner / embed provider |
| PlanetScale or similar open-sources their viz kit | Low–medium | Move faster on catalog + MIT brand |
| AI generates one-off canvases per post | Rising | Win on consistency, testing, registry |

---

## Strategic recommendations

1. **Publish and name the category** (“systems simulation embeds”) in every README sentence.  
2. **Depth over breadth** for next widgets — one best-in-class Raft or TCP sim beats five shallow toys.  
3. **Public comparison page** vs Mermaid/Excalidraw/video (honest).  
4. **Partner narrative** with technical writers, not “D3 alternative.”  
5. **Consider rename** if SEO brand war with universities is unwinnable.

---

## Checklist

- [ ] Write a public “Compare” docs page (Mermaid / Excalidraw / video / VisLab)
- [ ] Pick 3 whitespace bets; say no to general diagramming features
- [ ] Audit each of 17 widgets for unique value vs free web demos
- [ ] Prioritize flagship systems widgets over generic algorithm clones
- [ ] Showcase third-party `registerVislabWidget` with one external example
- [ ] Monitor PlanetScale/education interactive posts for co-marketing or differentiation
- [ ] Resolve brand collision (rename or disambiguate) as competitive SEO move
- [ ] Collect embed URLs of any adopters as social proof vs competitors
- [ ] Benchmark bundle size vs a minimal D3 custom demo (honest README)
- [ ] Track VisuAlgo/academic simulators only for pedagogy ideas, not feature parity races
