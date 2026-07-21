# VisLab Audit §5 — Marketing & Positioning

**Audit date:** 2026-07-21  
**Evidence:** README, docs, TODOS, GitHub description, web search for presence + comparable OSS go-to-market patterns

---

## Executive verdict

The **core value prop is clear on first README read**: living systems simulations for technical writing, neither dead diagrams nor heavy video, PlanetScale-style aesthetic. That is good positioning work for a pre-launch repo. Everything around it is missing: no public landing page, no demo URL, no social proof, no content engine, brand name collisions, and zero distribution. VisLab currently markets like a finished platform in TODOS.md while the world sees an unknown GitHub folder. Fix the **proof** (demo) and **name** (disambiguation) before amplifying the message.

---

## Value proposition analysis

### What the README says [verified]

1. **Problem:** Writers stuck between static diagrams and SEO-hostile video  
2. **Solution:** Lightweight GPU-accelerated (canvas) simulations at 60fps  
3. **Domain:** Systems engineering — CPU, cache, storage, OS  
4. **Aesthetic:** PlanetScale-style, flat, monospace  
5. **Delivery:** Embed via React, Astro, Jekyll, static HTML; CLI + Studio  

### Clarity score: **8/10** for a technical reader  
You understand what it is in under 60 seconds.

### Differentiation score: **6/10**  
Differentiated vs Mermaid/Excalidraw on *domain specialization* and *temporal simulation*. Weakly differentiated vs “just write a custom D3/canvas demo” and vs PlanetScale’s own one-off visuals (which set the taste bar). Not yet differentiated on **distribution** (Mermaid is everywhere).

### Risk: overclaim  
- “GPU-accelerated” — canvas 2D is typically CPU rasterized unless using WebGL; VisLab uses Canvas 2D context **[verified Scene.ts]**. Marketing language is slightly inflated.  
- “High-fidelity” — uneven across 17 widgets.  
- “60fps” — aspirational depending on device and widget count.

**Recommendation:** Prefer “deterministic canvas simulations” over “GPU-accelerated” unless WebGL is actually used.

---

## Target audience clarity

| Segment | Fit | Why |
|---------|-----|-----|
| Technical bloggers (systems/infra) | **Primary** | Matches PlanetScale-style inspiration; MDX/React path |
| CS educators / course sites | **Primary** | Widget catalog maps to OS/architecture syllabi |
| Company eng blogs | **Secondary** | Need legal/a11y/brand review; slower adoption |
| Textbook authors | **Tertiary** | Long sales cycle; export GIF/MP4 helps |
| Frontend generalists | Poor | Will pick Excalidraw/Mermaid |
| Data viz scientists | Poor | Will pick Observable/D3 |

**Messaging gap:** README speaks to “technical writing” broadly but widgets are **narrowly systems/CS**. That is fine — **narrow is good** — but headlines should say “systems & CS education visuals,” not generic “modern web visualizations.”

---

## Messaging consistency

| Surface | Message quality |
|---------|-----------------|
| README | Strong problem/solution; install path currently false |
| GitHub description | Accurate, concise |
| TODOS.md | Internal roadmap tone; “pre-release ready” overconfident |
| Docs index | Honest “not yet published to npm” **[verified]** |
| Starlight description | Generic “Systems engineering visualizations for the web” |
| Package.json | **No descriptions** — silent on npm |

**Inconsistency:** Docs admit unpublished; README Quickstart still shows `npm install` as if live. Pick one truth.

---

## Landing page / demo presence

**[verified web search]** Generic “VisLab” searches do **not** surface this project; they surface academic labs and a CHI paper.

**[verified]** `vislab.dev` → Northeastern VisLab, not this product.

**[verified]** GitHub `homepageUrl` empty; no Product Hunt / marketing site found for `mohitmishra786/vislab`.

**Conclusion:** There is **no marketing site**. Demo-blog and Studio exist only as monorepo apps. For a product whose value is visual, this is the single largest marketing failure.

Comparable tools:
- **Mermaid** — docs site + live editor  
- **Excalidraw** — app.excalidraw.com as the marketing engine  
- **PlanetScale blogs** — the interactive post *is* the acquisition channel  

VisLab needs a single URL: gallery of all 17 widgets, install CTA, Show HN-ready.

---

## Content marketing opportunities (underexploited)

The product is **inherently demo-able**. That is the entire GTM advantage.

**Not used today [verified absence of public content]:**
- No flagship blog post built *with* VisLab widgets  
- No “rewrite of PlanetScale IO post using VisLab” comparison  
- No YouTube short of SimClock 0.1× on a pipeline  
- No dev.to / Hashnode series  
- No educator lesson plans  

**Highest-leverage content (recommended):**
1. **“Interactive systems diagrams for MDX blogs”** — how-to + 3 embeds  
2. **Per-widget explainers** that rank for course keywords  
3. **Side-by-side:** static image vs Mermaid vs VisLab embed (load, a11y, SEO)  
4. **Open-source “CS Field Guide” style page** powered by VisLab  

Content *is* the product demo. Without it, launch posts will be text about a visual tool — weak.

---

## How comparable OSS tools built awareness

| Tool | Early awareness engine (historical / documented) | Lesson for VisLab |
|------|--------------------------------------------------|-------------------|
| **Mermaid** | Markdown-native DX; eventually GitHub native render; ~89k stars by 2026 | Zero-friction embed beats features |
| **Excalidraw** | Instant web app; virality of hand-drawn aesthetic; OSS + hosted | Interactive playground first |
| **D3** | Mike Bostock essays + blocks/Observable ecosystem | Elite demos + essays |
| **Observable** | Notebooks as shareable demos | Share links matter |
| **PlanetScale IO post** | One stunning article on HN (Mar 2025) | Single flagship narrative |

**VisLab implication:** Do not lead with monorepo architecture. Lead with **one breathtaking demo URL** and a Show HN that embeds or links it. Architecture is contributor marketing, not user marketing.

---

## Positioning options (choose one primary)

### Option A — “PlanetScale-style widgets for your blog” (current)
- Pro: Instant taste recognition  
- Con: Derivative; depends on PlanetScale goodwill; narrow aesthetic  

### Option B — “The embeddable CS systems lab” (recommended)
- Pro: Owns education + eng-blog systems niche; catalog is the moat  
- Con: Sounds academic; need pedagogy quality  

### Option C — “Simulation components for MDX” (platform)
- Pro: Extensible registry story  
- Con: Too abstract; loses systems identity  

**Recommendation:** **B as category, A as aesthetic reference.** Tagline candidate:  
> Embed live CPU, cache, and OS simulations in your docs — not screenshots.

---

## Competitive messaging matrix (short)

| Against | Say |
|---------|-----|
| Mermaid | “Mermaid draws structure; VisLab simulates time.” |
| Excalidraw | “Freeform sketching vs curriculum-grade systems widgets.” |
| Video | “Scrubbable, interactive, lighter than a 40MB MP4.” |
| Custom canvas | “Registry + React/Jekyll embeds so you don’t rebuild the pipeline every post.” |
| VisuAlgo-class tools | “Built for *your* site’s MDX, not a closed teaching portal.” |

---

## Pre-launch messaging checklist (honest)

Before any paid or loud amplification:
1. Working install  
2. Public demo  
3. Name/domain that doesn’t resolve to another university  
4. One flagship story post  
5. Tone down GPU/high-fidelity claims  

---

## Checklist

- [ ] Ship a single **public demo URL** with all 17 widgets (or flagship 5)
- [ ] Set GitHub homepage to that URL
- [ ] Rewrite README hero: problem → 15s GIF → install (working) → demo link
- [ ] Soften “GPU-accelerated” unless WebGL is real
- [ ] Narrow tagline to systems/CS education embeds
- [ ] Resolve brand: rename or strongly disambiguate from academic VisLabs
- [ ] Align README with docs on npm publish status
- [ ] Produce one flagship interactive article as marketing asset
- [ ] Create a one-page positioning doc (internal) with audience + anti-audience
- [ ] Prepare Show HN title variants and first-comment demo links
- [ ] Add social preview image (widget collage)
- [ ] Decide primary CTA: “Star + try demo” vs “npm install” (both need to work)
- [ ] List 20 target blogs/newsletters for seeding (see §6)
