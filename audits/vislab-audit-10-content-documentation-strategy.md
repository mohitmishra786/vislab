# VisLab Audit §10 — Content & Documentation Strategy

**Audit date:** 2026-07-21  
**Evidence:** `docs/`, `apps/docs` Starlight content, README, CONTRIBUTING, Studio export UX, examples/

---

## Executive verdict

Documentation is **structurally promising and substantively thin**. The skeleton of a good docs product exists (Starlight sidebar: Start / Components / Guides / API; monorepo QUICKSTART; CONTRIBUTING for authors). The flesh does not: each of 17 component pages is ~20 words, docs quickstart defers HTML/Jekyll back to GitHub, and the product’s best onboarding surface (Studio Copy MDX) is undocumented for non-experts and not hosted. Content marketing using the widgets themselves — the obvious strategy — has not started. Treat docs as a **launch blocker**, not a post-1.0 polish item.

---

## Gap analysis: `docs/` and `apps/docs`

### What exists [verified]

| Asset | Role |
|-------|------|
| `docs/QUICKSTART.md` | Best consumer guide (3 paths + CLI) |
| `apps/docs` Starlight | Formal docs app, `site: https://vislab.dev` (bad domain) |
| `content/docs/index.mdx` | Intro; admits not on npm |
| `content/docs/quickstart.mdx` | Thin React-only + live StorageComparison |
| `content/docs/components/*.mdx` | 17 stubs + index |
| `content/docs/guides/{astro,html,jekyll}.mdx` | Integration guides |
| `content/docs/api/core.mdx` | Core API |
| `RegistryGallery.astro` | Live gallery component |
| `examples/html` | Minimal static example |
| `CONTRIBUTING.md` | Widget authoring |
| `TODOS.md` | Roadmap (internal) |

### Word-count reality [verified]

All component MDX files sum to **~359 words total** including frontmatter noise — roughly **18–26 words each**. Example (`cpu-pipeline.mdx`):

```mdx
---
title: CPU pipeline
---
import { CpuPipeline } from "@vislab/react";

Instruction flow with hazard detection.

<CpuPipeline client:visible autoPlay={true} />
```

That is a **gallery card**, not documentation.

---

## Per-widget documentation standard (proposed)

Each of the 17 pages should eventually include:

1. **One-sentence purpose** (audience-facing)  
2. **Live embed** (exists)  
3. **When to use** in an article  
4. **Props table** generated from registry schema  
5. **MDX + HTML + Jekyll snippets** (Studio already builds these)  
6. **Pedagogy notes / simplifications** (what the sim lies about)  
7. **A11y text alternative**  
8. **Related reading** (links to papers or textbook chapters)  

**MVP for launch:** do this fully for **5 flagships** (StorageComparison, CpuPipeline, CacheSimulator, ProcessScheduler, SortRace); leave others as gallery+props until later.

---

## “Copy MDX” workflow for non-experts

**What Studio does [verified]:**  
Registry picker → prop fields → tabs (mdx/html/jekyll/iframe) → copy.

**What docs fail to explain:**
- How to open Studio (`pnpm --filter studio dev`)  
- Prerequisites (monorepo clone today; hosted Studio tomorrow)  
- What `client:visible` means in Astro  
- Where to put `vislab-embed.min.js` for HTML  
- Prop types and validation errors  
- Theming (`themeName` values)  

**Non-expert path today:** read QUICKSTART → hit npm 404 → bounce.

**Target path:** docs.example.com → pick widget → copy → paste → works.

Until Studio is hosted and packages publish, document the **tarball/clone** path explicitly as temporary.

---

## Tutorial / guide needs (priority ordered)

| Guide | Why |
|-------|-----|
| Install & first embed (truthful) | Conversion |
| Astro content collections + MDX | Primary writer stack |
| Static blog (Hugo/11ty) via script tag | Broader than Jekyll |
| Jekyll include deep dive | Stated audience |
| Theming & fonts | Visual polish |
| Accessibility for authors | Compliance |
| Export GIF for Twitter | Growth |
| Writing a third-party widget | Ecosystem |
| Performance: many widgets | Scale |

Missing entirely: troubleshooting, SSR/hydration, CSP, bundler config, comparison page.

---

## API docs

`api/core.mdx` exists; registry props are the real public API for most users. Prefer **generated prop docs from `vislabRegistry`** over hand-written drift. JSDoc on classes helps contributors more than writers.

---

## Content as marketing (widgets doubling as demos)

**Opportunity:** VisLab’s marketing *is* interactive essays.

**Suggested series (ship as apps/demo-blog posts or external blog):**
1. “IO latency you can feel” — StorageComparison  
2. “A day in the life of an L1 miss” — CacheSimulator  
3. “Why your process starved” — ProcessScheduler  
4. “Five-stage pipeline hazards” — CpuPipeline  
5. “Sorting race for the impatient” — SortRace  

Each post: 800–1500 words + 1–2 widgets + CTA to GitHub/npm.

**Cross-post** to dev.to/Hashnode with canonical link. This feeds SEO (§4), launch (§6), and education credibility (§8).

**[verified absence]** No such series exists publicly under this project’s brand today.

---

## Documentation quality scorecard

| Area | Score /10 | Note |
|------|-----------|------|
| Information architecture | 7 | Starlight sidebar sensible |
| Install accuracy | 1 | npm 404; Node version drift |
| Component reference | 2 | Stubs |
| Guides depth | 4 | Structure yes, depth unproven/short |
| Contributor docs | 7 | CONTRIBUTING clear |
| API docs | 4 | Minimal |
| Examples repo | 3 | One HTML example |
| Hosted searchable docs | 0–1 | Domain wrong; deploy unverified |
| i18n | 0 | Not needed yet |

---

## Process recommendations

1. **Single source of truth:** registry props → generated MDX tables in CI  
2. **Docs deploy on every main** to correct domain  
3. **Do not claim “live gallery for all 17” as docs completeness** — gallery ≠ docs  
4. **Version docs** with package 0.1.0  
5. **Record GIF** capture of Studio copy flow for README  

---

## Checklist

- [ ] Fix docs `site` URL to owned domain; deploy publicly
- [ ] Rewrite install docs only with working commands
- [ ] Expand 5 flagship component pages to full template (props, snippets, pedagogy)
- [ ] Auto-generate props tables from `@vislab/registry`
- [ ] Document Studio workflow end-to-end (with screenshots)
- [ ] Host Studio or document Codespaces one-click
- [ ] Add troubleshooting guide (blank canvas, SSR, fonts)
- [ ] Add accessibility authoring guide
- [ ] Publish at least one flagship interactive blog post using VisLab
- [ ] Align monorepo QUICKSTART and Starlight quickstart (no deferral loops)
- [ ] Add examples for Hugo/11ty or generic script tag
- [ ] Link each widget page to a “copy snippets” anchor
- [ ] Keep CONTRIBUTING updated when registry API changes
- [ ] After launch, accept docs PRs as highest-value contributions
