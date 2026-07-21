# VisLab Audit §4 — SEO & Discoverability

**Audit date:** 2026-07-21  
**Evidence:** Repo README/topics/package metadata, docs Astro config, live web search for brand + competitor queries, domain probe

---

## Executive verdict

VisLab has **decent GitHub topic hygiene** and a clear README keyword field, but **near-zero external discoverability**: 0 stars, empty homepage field, packages unpublished (no npm SEO), docs site configured for `https://vislab.dev` which **redirects to Northeastern University’s VisLab** (different organization). The project’s own marketing thesis — that video embeds hurt SEO — collides with its implementation: **canvas widgets contribute almost no crawlable text**. Until publish + domain + content strategy land, search engines and humans will not find this tool.

---

## Repo-level SEO (GitHub)

### Strengths [verified via GitHub API]

**Description:**  
> Canvas simulations for CPU pipelines, caches, schedulers, and storage — 17 registry widgets embeddable in Astro, React, Jekyll, or static HTML.

**Topics (16):**  
`astro`, `canvas`, `computer-science`, `cpu-architecture`, `education`, `jekyll`, `monorepo`, `open-source`, `operating-systems`, `pnpm`, `react`, `systems-programming`, `technical-writing`, `turborepo`, `typescript`, `visualization`

This is better than most 0-star repos. Keywords match intended audience.

### Weaknesses [verified]

| Gap | Impact |
|-----|--------|
| `homepageUrl` empty / null | No link to live demo |
| 0 stars / forks / watchers | GitHub social proof algorithms suppress ranking in explore/search |
| No releases | Release notes never indexed as project news |
| README lacks GIF/demo video above fold | Social previews and “try it” friction |
| No `og:image` custom | Default Open Graph |
| Name “VisLab” | Severe brand collision (below) |

---

## Brand / domain collision (critical)

**[verified via web_fetch]** Request to `https://vislab.dev` redirects cross-host to **`https://vis.khoury.northeastern.edu/`** (Northeastern Khoury VisLab — academic visualization lab).

**[verified via web search]** “VisLab” also refers to:
- ACM CHI research system (UW-affiliated “VisLab: Enabling Visualization Designers…”)
- HKUST Visualization Research Lab
- Tsukuba VisLab
- Other scientific visualization labs

**Docs config [verified `apps/docs/astro.config.mjs`]:**
```js
site: "https://vislab.dev",
```

**Impact:** Starlight will emit sitemaps/canonical URLs pointing at a domain the project does **not** control. Deploying docs to that host is impossible without ownership; searching “vislab” will never surface this repo first.

**Action:** Pick a distinct public brand/domain (e.g. `getvislab.dev`, `vislab-widgets.dev`, or rename product). This is an SEO and trademark risk, not a nice-to-have.

---

## npm discoverability

**[verified]** `@vislab/core`, `@vislab/react`, `@vislab/cli` → npm 404.

**[verified]** No package.json `description` or `keywords` fields on publishable packages.

npm SEO best practices (2025–2026 guidance from npm docs and community): unique name, rich description, keywords, README on package, `repository` field, frequent downloads. VisLab has repository fields on some packages, but **zero published surface**. Until publish, npm is a dead channel.

**Scope note:** `@vislab` org name may need npm org creation; verify availability before launch day **[assumption — needs founder input]**.

---

## The canvas SEO irony (called out in README)

README [verified]:
> technical writing is often trapped between … static … diagrams … and heavyweight video embeds that hurt SEO and load times.

**Truth table:**

| Embed type | Crawlable body text | Indexable meaning | LCP risk |
|------------|--------------------|-------------------|----------|
| Static SVG/HTML diagram | High | High | Low |
| Mermaid (renders SVG/DOM) | Medium–high | Medium | Low–med |
| Video | Caption/transcript dependent | Low without transcript | High |
| VisLab canvas | **Near zero** (bitmap) | **Near zero** unless host prose | JS cost |

**[verified]** CONTRIBUTING explicitly treats canvas as visual-only. Chrome titles (`h3`) and buttons do add a little DOM text (“CPU pipeline”, “Pause”) — insufficient for ranking on “how CPU pipeline works.”

**Conclusion:** VisLab **helps host-page SEO relative to autoplay video** (lighter, no YouTube iframe SEO sink) but **does not create SEO content**. Writers still need surrounding prose. Product should ship optional **SSR text fallback / figcaption / schema.org HowTo** helpers so embeds don’t create “empty content” zones.

Modern SEO (2025–2026 consensus from Google’s own guidance and industry practice): prioritize helpful content, page experience, crawlable text; don’t rely on canvas or WebGL for meaning. Interactive enhancements are fine when progressive enhancement exists.

---

## Docs-site SEO

| Item | Status |
|------|--------|
| Starlight base | Present — good defaults for docs SEO |
| `site` URL | **Wrong domain** (vislab.dev collision) |
| Meta description | Starlight + page frontmatter |
| Component pages | ~20 words — **thin content** penalty risk |
| Sitemap | Would emit under wrong canonical if built as configured |
| Structured data | Not custom-implemented (Starlight defaults only) |
| Live public deploy | **Not verified** as publicly hosted project docs |

Thin MDX component pages are anti-SEO. A page titled “CPU pipeline” with one sentence and a canvas will not rank for educational queries; it may not even be worth indexing.

---

## Search-engine positioning vs competitor terms

**Method:** Web search (2026-07-21) for brand and category terms.

| Query | VisLab (this project) appears? | Who wins |
|-------|-------------------------------|----------|
| `VisLab` | **No** (labs + CHI paper) | Academic VisLabs |
| `vislab github mohitmishra` | Likely repo (not top generic) | Niche |
| `cpu pipeline visualization interactive` | **No VisLab** | Teaching simulators, papers, GitHub one-offs |
| `cache hierarchy simulator teaching` | **No VisLab** | EDUCache, course tools |
| `embeddable systems visualization react` | **No VisLab** | Generic viz / D3 / Observable |
| `PlanetScale IO devices latency` | PlanetScale article | Direct inspiration, not VisLab |

**[verified fact]** At zero external content and zero npm, organic search share is effectively **0%** for commercial/intent keywords.

---

## GitHub discovery mechanics (2026 context)

GitHub surfaces projects via: stars, topics, dependent packages, social proof, READMEs with media, and network effects. Research on HN→GitHub (arXiv 2025 “Launch-Day Diffusion”) shows HN exposure yields ~121 stars average in 24h for analyzed launches — **but** that requires a launch and a working demo URL. Topics alone will not overcome 0 stars.

---

## Practical SEO strategy for pre-launch / launch

### P0 — Unblock indexing of *something real*
1. Own a domain; fix `site` in Astro config  
2. Deploy docs + demo gallery with unique titles  
3. Publish npm packages (indexable READMEs)  
4. Add demo GIF/WebM to GitHub README  

### P1 — Content that ranks
5. One long-form post per flagship widget (“Interactive CPU pipeline for your docs”) on a blog you control  
6. Each docs component page: 400+ words of educational copy + props + accessibility text alternative  
7. Target long-tail: `embed cache simulator in mdx`, `react cpu pipeline widget`  

### P2 — Technical SEO for embeds
8. Recommend `<figure><figcaption>` patterns in docs  
9. Optional JSON-LD helper for educational content  
10. Server-render static SVG snapshot option for bots (advanced)

---

## Checklist

- [ ] Abandon or acquire a real domain; **stop using `vislab.dev` in config** until owned
- [ ] Set GitHub repo homepage to live demo/docs URL
- [ ] Deploy public docs with correct `site` + sitemap + robots.txt
- [ ] Publish npm packages with description + keywords + full README
- [ ] Add README demo media (GIF of StorageComparison + CpuPipeline)
- [ ] Expand component MDX pages beyond stubs (thin-content risk)
- [ ] Document figcaption / surrounding prose SEO pattern for embedders
- [ ] Add crawlable text fallback for each widget (even 1–2 sentence summary in DOM)
- [ ] Create unique brand disambiguator in title tags: “VisLab Widgets” or product rename
- [ ] Register Google Search Console on docs domain post-deploy
- [ ] Pitch/guest post on systems blogs (indexes brand mentions)
- [ ] Track rankings for 10 seed queries monthly post-launch
- [ ] Add `llms.txt` / clear docs structure for AI crawlers (emerging 2025–2026 practice) only after real content exists
