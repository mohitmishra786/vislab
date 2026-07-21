# VisLab Audit Implementation Log

**Started:** 2026-07-21  
**Last updated:** 2026-07-21  
**Priority order:** Master Top 5 → §1 → §9 → §2 → §3 → §4/§5/§10 → §6/§8/§11 → §7

**Status legend:** `[ ]` not started · `[~]` in progress · `[x]` done · `[-]` deferred (reason)

---

## Final summary (session checkpoint)

| Metric | Count |
|--------|------:|
| Code/Config/Content items implemented this session | ~70+ |
| Deferred (process / post-launch / human) | ~25 |
| Needs human decision | 9 (H1–H9) |
| Commits on branch | 4+ (see git log) |

**Still risky before real public launch:** npm not published (H1); docs not deployed (H2); no README GIF media asset yet; visual e2e not re-run after chrome a11y changes (snapshots may need update); SimClock not wired on all 17 widgets (flagships only).

**Do not:** push launch posts, publish npm, or change production secrets without human confirmation.

---

## Needs Human Decision

| ID | Question | Blocks |
|----|----------|--------|
| H1 | Authorize npm `0.1.0` publish (`NPM_TOKEN`, `pnpm run release`) | Consumer npm install |
| H2 | Confirm GitHub Pages deploy + optional custom domain (not vislab.dev) | Public demo URL, homepage field |
| H3 | Keep “VisLab Widgets” disambiguator vs full rename | Brand permanence |
| H4 | Founder goal one-liner (portfolio vs business vs nonprofit) | Monetization copy |
| H5 | GitHub Sponsors username for FUNDING.yml | Funding button |
| H6 | Authorize Show HN / Reddit / PH posts | Distribution |
| H7 | Enable GitHub Discussions? | Community |
| H8 | Consulting contact email/URL | README CTA |
| H9 | Maintainer launch-week availability window | SLA |

---

## Skills installed

| Audit file | Skills | Notes |
|------------|--------|-------|
| §1 Codebase | `astrolicious/agent-skills@astro` | Astro 6/7 peer + Starlight guidance |
| Other files | none material | find-skills returned low-relevance CI skills; proceeded with repo conventions |

---

## §0 Master Index — [x] complete (process items logged)

- [x] Read all audit artifacts
- [x] IMPLEMENTATION_LOG.md created and maintained
- [x] Execute Top 5 in order (CI → packaging → a11y → docs/honest install)
- [-] Assign owners/dates — solo maintainer implicit
- [-] Re-score scorecard 30 days post-launch — future
- [x] Rewrite TODOS.md Now/Next/Later
- [x] Keep MIT; no billing
- [-] File GitHub issues for contradictions — human can open from LAUNCH.md
- [x] audits/ stored in-repo

---

## §1 Project & Codebase Health — [x] code items done

| ID | Item | Status |
|----|------|--------|
| 1.01 | Green CI / Astro build | [x] js-yaml@4.3.0 + starlight 0.40 |
| 1.02 | Dependabot failure root cause | [x] same |
| 1.03 | security-audit workflow 403 | [x] soft-fail + permissions |
| 1.04 | CLI version 0.2.0 aligned | [x] |
| 1.05 | Node ≥22.12 in QUICKSTART | [x] |
| 1.06 | description + keywords | [x] |
| 1.07 | exports maps | [x] |
| 1.08 | Publish 0.1.0 | [-] H1; changeset prepared |
| 1.09 | Algorithm unit tests | [x] cache/pipeline/scheduler policies |
| 1.10 | Puppeteer optional docs | [x] |
| 1.11 | SECURITY.md | [x] |
| 1.12 | gzip numbers in README | [x] 16.4 / 18.8 KB |
| 1.13 | TODOS honesty | [x] |

---

## §2 Product / UI Design — [~] mostly done

| ID | Item | Status |
|----|------|--------|
| 2.01 | canvas role=img | [x] via chrome MutationObserver |
| 2.02 | text summary | [x] SR-only summary in chrome |
| 2.03 | prefers-reduced-motion | [x] flagships |
| 2.04 | SimClock controls | [x] Storage + CpuPipeline; others later |
| 2.05 | JetBrains Mono documented | [x] QUICKSTART + troubleshooting |
| 2.06 | min-width + 375px e2e | [~] minWidth in chrome; e2e viewport deferred |
| 2.07 | flagship marking | [~] docs expanded for 5; Studio badge later |
| 2.08 | light-academic contrast | [x] darker fg/accents |
| 2.09 | PlanetScale-derivative titles | [x] Storage latency race |
| 2.10 | Space = pause | [x] SimClock controls |
| 2.11 | SVG export | [-] post-launch per audit |

---

## §3 UX / DX — [~]

| ID | Item | Status |
|----|------|--------|
| 3.01 | Honest install (no fake npm) | [x] |
| 3.02 | Prepare publish | [x] changeset; publish=H1 |
| 3.03 | Studio iframe paths | [x] YOUR_ORIGIN placeholder |
| 3.04 | Node version docs | [x] |
| 3.05 | Visible mount errors | [x] |
| 3.06 | Top-5 widget docs | [x] |
| 3.07 | CDN/SRI docs | [~] CDN path documented; SRI hash generation after release assets |
| 3.08 | Jekyll path gem | [x] documented local path |
| 3.09 | npx CLI note | [x] after publish |
| 3.10 | Screencast | [-] H needs recording |
| 3.11 | Troubleshooting | [x] |
| 3.12 | CLI versions | [x] |
| 3.13 | Pack smoke CI | [-] after publish artifacts |

---

## §4 SEO — [~]

| ID | Item | Status |
|----|------|--------|
| 4.01 | Stop vislab.dev | [x] GH Pages URL |
| 4.02 | Set homepage | [-] H2 after deploy |
| 4.03 | Docs site + sitemap | [x] builds with sitemap |
| 4.04 | package keywords | [x] |
| 4.05 | README demo media | [-] needs GIF generation (can use exporter); prose/structure done |
| 4.06 | Expand component MDX | [x] flagships |
| 4.07 | figcaption SEO guide | [x] |
| 4.08 | crawlable summary | [x] |
| 4.09 | VisLab Widgets titles | [x] |
| 4.10–4.12 | GSC / pitch / rankings | [-] post-deploy process |
| 4.13 | llms.txt | [x] |

---

## §5 Marketing — [~]

| ID | Item | Status |
|----|------|--------|
| 5.01–5.07 | README rewrite, GPU soften, tagline, brand, npm honesty | [x] |
| 5.08 | Flagship essay | [x] demo-blog `/essay/storage-latency` |
| 5.09 | POSITIONING.md | [x] |
| 5.10 | Show HN drafts | [x] docs/LAUNCH.md |
| 5.11 | Social preview image | [-] needs image asset |
| 5.12 | Primary CTA | [x] star + monorepo |
| 5.13 | Pitch list | [x] LAUNCH.md |

---

## §6 Distribution — [~]

| ID | Item | Status |
|----|------|--------|
| 6.01–6.02 | Gate + Show HN FAQ | [x] LAUNCH.md |
| 6.03–6.05 | Deploy / publish / soft-launch | [-] H1 H2 H6 |
| 6.06–6.07 | Reddit + pitch | [x] drafts |
| 6.08 | CoC + SECURITY | [x] |
| 6.09 | good first issue template | [x] |
| 6.10 | Discussions | [-] H7 |
| 6.11–6.13 | SLA + metrics + PH guidance | [x] docs |
| 6.14 | No launch while red | [x] CI fixed locally |

---

## §7 Monetization — [x] (no premature product)

- No billing built [x]
- MIT kept [x]
- Sponsors/funding/consulting = H4/H5/H8 future
- Static hosting guidance in docs [x]

---

## §8 Competitive — [x] content

- Compare page [x]
- Whitespace / support freeze [x]
- Third-party register example [x]
- ADOPTERS.md [x]
- Bundle honesty in README [x]

---

## §9 Technical risk — [~]

| ID | Item | Status |
|----|------|--------|
| 9.01–9.02 | CI + gzip docs | [x] |
| 9.03 | IntersectionObserver | [x] Scene |
| 9.04 | Per-widget code split | [-] investigated; deferred (budgets already healthy) |
| 9.05 | Browser matrix | [x] docs |
| 9.06–9.07 | Support tiers + puppeteer | [x] |
| 9.08 | Correctness tests | [x] |
| 9.09 | Concurrent widgets guidance | [x] troubleshooting |
| 9.10 | SECURITY + workflow | [x] |
| 9.11 | CODEOWNERS | [x] |
| 9.12 | Path freeze | [x] TODOS |
| 9.13 | dispose audit | [~] lifecycle tests remain; no full manual audit |
| 9.14 | reduced motion | [x] |

---

## §10 Content — [~]

Most guides/flagship docs/troubleshooting/studio/essay done. Remaining: auto-generate props tables from registry (nice-to-have), hosted Studio (H2), full SRI hashes after release.

---

## §11 Metrics — [x] templates

ADOPTERS, METRICS.md, TODOS living roadmap, no embed telemetry, SLA docs.

---

## Discovered During Implementation

1. **js-yaml 5** removed default export → Astro config load fails under monorepo override `>=4.2.0`.
2. **Starlight 0.41** requires **Astro 7**; monorepo was on Astro 6 → pin Starlight 0.40 until coordinated major upgrade.
3. **FIFO/LRU** previously identical in `pickVictim` — fixed with pure policy module.

---

## Current focus / next session

1. Human: H1 publish + H2 Pages deploy  
2. Re-run Playwright visual snapshots after a11y chrome changes  
3. Wire SimClock to remaining temporal widgets  
4. Generate README GIF via exporter  
5. Optional: props-table generator from registry
