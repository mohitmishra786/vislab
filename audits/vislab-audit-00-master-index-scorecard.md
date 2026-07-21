# VisLab 360° Audit — Master Index & Scorecard

**Audit date:** 2026-07-21  
**Project:** [mohitmishra786/vislab](https://github.com/mohitmishra786/vislab) (local clone + GitHub/npm/web verification)  
**Auditor stance:** Fractional Head of Product + Growth + Staff Engineer — evidence over flattery

---

## Method (executed)

- Inspected monorepo: README, TODOS, CONTRIBUTING, package manifests, registry, core engine, widgets, Studio, docs, CLI, CI workflows, tests, license  
- Queried GitHub API: stars/forks/watchers, issues/PRs, releases, Actions history  
- Verified npm: `@vislab/*` unpublished (404)  
- Probed `vislab.dev` → redirects to Northeastern VisLab (not this project)  
- Web-searched competitors, OSS launch benchmarks, SEO/a11y norms, monetization, PlanetScale inspiration (through July 2026)  
- Local `pnpm install` + package build: **unit tests 27/27 pass**; **bundle budgets pass** (16.4 / 18.8 KB gzip); **Astro apps fail** (`js-yaml` default export / Vite 8) confirming red CI  
- Built scorecard from verified facts; tagged inferences in per-section docs  

---

## Artifact index (11 sections)

| # | File | One-line summary |
|---|------|------------------|
| 1 | [vislab-audit-01-project-codebase-health.md](./vislab-audit-01-project-codebase-health.md) | Solid monorepo/registry design and real CI ambition, undermined by red main, 0.0.0/unpublished packages, and version drift |
| 2 | [vislab-audit-02-product-ui-design.md](./vislab-audit-02-product-ui-design.md) | Coherent PlanetScale-ish tokens and chrome; canvas a11y/mobile and uneven SimClock UX are product-level risks |
| 3 | [vislab-audit-03-ux-developer-experience.md](./vislab-audit-03-ux-developer-experience.md) | Studio/CLI/registry DX is promising for contributors; consumer path is dead until npm + hosted demo exist |
| 4 | [vislab-audit-04-seo-discoverability.md](./vislab-audit-04-seo-discoverability.md) | Good GitHub topics, zero search presence; brand/domain collision; canvas vs SEO irony unresolved |
| 5 | [vislab-audit-05-marketing-positioning.md](./vislab-audit-05-marketing-positioning.md) | Clear value prop on README; no landing/demo/content engine; tone down GPU claims; narrow to systems/CS |
| 6 | [vislab-audit-06-distribution-community-launch.md](./vislab-audit-06-distribution-community-launch.md) | True pre-launch (0★); sequenced Show HN plan gated on CI/install/demo; seed systems blogs |
| 7 | [vislab-audit-07-monetization-sustainability.md](./vislab-audit-07-monetization-sustainability.md) | Revenue is fantasy at 0 users; stay MIT; portfolio + later consulting/sponsors; no premature SaaS |
| 8 | [vislab-audit-08-competitive-landscape.md](./vislab-audit-08-competitive-landscape.md) | Don’t fight Mermaid/Excalidraw; own embeddable systems sims; moat is catalog+distribution not ECS |
| 9 | [vislab-audit-09-technical-risk-scalability.md](./vislab-audit-09-technical-risk-scalability.md) | Bundle budgets exist; multi-path + solo bus factor + Astro CI fragility dominate risk |
| 10 | [vislab-audit-10-content-documentation-strategy.md](./vislab-audit-10-content-documentation-strategy.md) | Docs IA good, component pages are stubs; interactive essays should be the content strategy |
| 11 | [vislab-audit-11-post-launch-metrics-iteration.md](./vislab-audit-11-post-launch-metrics-iteration.md) | Instrument stars/downloads/docs analytics ethically; 30/60/90 targets; revive living roadmap |

---

## Maturity scorecard (0 = nonexistent, 10 = best-in-class)

| Angle | Score | One-sentence justification |
|-------|------:|----------------------------|
| 1. Project & codebase health | **6.5** | Architecture, tests, and tooling are above-average for 0.x; red main CI and unreleased packages cap the score |
| 2. Product / UI design | **5.0** | Design system direction is real; a11y, mobile reflow, and universal SimClock UX are weak |
| 3. UX & developer experience | **3.5** | Contributor monorepo DX exists; stranger install path fails (npm 404) |
| 4. SEO & discoverability | **1.5** | Topics help slightly; no deploy, wrong domain target, no rankings, brand collision |
| 5. Marketing & positioning | **4.0** | README message is clear; proof (demo/site/content) and brand hygiene are missing |
| 6. Distribution & community | **1.0** | Zero stars/releases/community surface; launch not attempted |
| 7. Monetization & sustainability | **2.0** | Appropriately unmonetized; no funding setup; sustainability = maintainer time only |
| 8. Competitive position | **5.5** | Differentiated niche on paper; zero market presence means position is theoretical |
| 9. Technical risk posture | **5.0** | Engine/budgets thoughtful; sprawl, bus factor, CI fragility, untested pedagogy |
| 10. Content & documentation | **3.0** | Skeleton of Starlight + QUICKSTART; component docs and public content nearly empty |
| 11. Metrics & iteration readiness | **2.5** | No instrumentation or living roadmap process; plan only exists in this audit |

**Unweighted average: ~3.6 / 10** — calibrated as **strong pre-launch engineering spike, weak product-market exposure**.

**Weighted product readiness (engineering 30% / GTM 40% / docs 20% / ops 10%): ~3.2 / 10**

---

## Top 5 cross-cutting priorities

Ranked by **impact × urgency** (launch-unblocking first).

### 1. Make the consumer path real (publish + demo + domain)
**Impact × urgency: Critical**  
Green path for a stranger: install `@vislab/react` or load release `vislab-embed.min.js`, open a public gallery URL on a domain you own.  
Unblocks: DX, SEO, marketing, launch, metrics.  
**Sources:** §1, §3, §4, §5, §6

### 2. Restore green CI on `main` and stop shipping broken Dependabot merges
**Impact × urgency: Critical**  
Main CI failed since 2026-06-29; Astro app builds flake/fail; security-audit job 403s. Launching on red CI destroys trust.  
**Sources:** §1, §9, §6

### 3. Ship a Show HN–ready proof (flagship interactive page + README media)
**Impact × urgency: High**  
Visual product cannot grow from text. One stunning multi-widget article + GIF beats monorepo architecture essays. Gate amplification on priority 1–2.  
**Sources:** §5, §6, §10, §8

### 4. Fix brand/domain collision and canvas SEO/a11y honesty
**Impact × urgency: High**  
`vislab.dev` is not yours; name fights universities; canvas is not crawlable/accessible without prose/fallbacks. Resolve naming + progressive enhancement or accept niche forever.  
**Sources:** §2, §4, §5, §8

### 5. Depth over breadth: five flagship docs + correctness, freeze path sprawl
**Impact × urgency: High (post-unblock)**  
17 stub pages and four embed paths exhaust a solo maintainer. Make five widgets undeniably good (docs, a11y chrome, SimClock UI, tests); tier-2 the rest; Jekyll/exporter best-effort.  
**Sources:** §2, §3, §9, §10, §7

---

## Contradictions between sections / claims vs reality

| Contradiction | Detail |
|---------------|--------|
| README `npm install` vs registry | Install snippets assume published packages; npm returns 404 for `@vislab/*` |
| TODOS “Pre-release ready” vs CI | Roadmap celebrates readiness; `main` CI red; Dependabot PRs failing |
| Docs `site: vislab.dev` vs real web | Config points at domain that redirects to Northeastern VisLab |
| Docs index “not on npm” vs README Quickstart | Docs are more honest than README |
| CLI version 0.1.0 / 0.2.0 / README 0.2.0 | Three sources disagree |
| Node engines ≥22.12 vs QUICKSTART “Node 18+” | Onboarding lies about prerequisites |
| “GPU-accelerated” vs Canvas 2D | Marketing implies GPU; implementation is 2D canvas context |
| SimClock 0.1×–10× as platform UX vs widgets | Engine clamps speed; few widgets expose universal time controls |
| “Video hurts SEO” vs canvas embeds | True that video is heavy; canvas also fails crawlable-text SEO without prose |
| 17 “high-fidelity” widgets vs stub docs + lifecycle-only tests | Catalog count overstates pedagogical depth |
| Accessibility “done” (TODOS #30) vs canvas opacity | ARIA on buttons only; content still visual-only by policy |
| Zero community vs closed 35 issues | Looks active historically; today no open community conversation |
| Multi-framework parity claim vs docs weight | React path documented; others secondary; none work from npm |
| Jekyll gem 0.1.0 “prepared” vs unverified RubyGems publish | Same vapor pattern as npm |

---

## Single-page verdict

VisLab is a **credible engineering prototype of a niche category** (embeddable systems simulations for technical writing) with **no market existence yet**. The monorepo, registry, tests, and aesthetic direction are real work — not a README-only project. The failure mode is classic pre-launch OSS: **building past the point of first user contact**.  

Do not add widgets, SaaS, or monetization. **Publish, demo, green CI, one flagship story, then Show HN.** Everything else in these 11 artifacts is secondary until a stranger can succeed in five minutes.

---

## Checklist (master)

- [ ] Read all 11 section artifacts before prioritizing work
- [ ] Execute Top 5 priorities in order (do not skip to launch marketing)
- [ ] Assign owners/dates to each Top 5 item (even if owner is solo)
- [ ] Re-score this scorecard 30 days after first public launch
- [ ] Delete or rewrite stale “pre-release ready” language in TODOS.md
- [ ] Keep MIT; defer monetization (§7)
- [ ] File issues for each contradiction row you accept as true
- [ ] Store this `audits/` folder in-repo or wiki for future contributors
