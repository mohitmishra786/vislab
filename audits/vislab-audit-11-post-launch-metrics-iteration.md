# VisLab Audit §11 — Post-Launch Metrics & Iteration Plan

**Audit date:** 2026-07-21  
**Evidence:** Current zero baseline metrics; web research on HN/GitHub launch trajectories (2025–2026); repo process files (TODOS, CONTRIBUTING, issues)

---

## Executive verdict

You cannot manage what you do not instrument. VisLab today has **no public analytics, no npm pulse, no star history, and a roadmap that looks finished while distribution has not started**. Post-launch, measure a **short funnel**: awareness → install → successful embed → return/contribution. Use OSS-appropriate ethics: **no invasive embed telemetry by default**. Calibrate goals against research averages (HN→stars) while remembering medians are lower. Iteration cadence should reopen a living roadmap rather than checkbox theater in TODOS.md.

---

## What to instrument

### A. Awareness & distribution (weekly)

| Metric | Source | Why |
|--------|--------|-----|
| GitHub stars | API / star-history | Top-line OSS health |
| Forks / watchers | API | Contributor intent |
| Unique repo clones | GitHub Insights (Traffic) | Stronger than stars |
| Referrers | GitHub Traffic | Which launch channel worked |
| Docs site pageviews | Plausible/Fathom/Cloudflare (privacy-friendly) | Content performance |
| Demo gallery CTR | Same | Hero conversion |
| Social mentions | Manual / brand search | Qualitative |

### B. Adoption (weekly after publish)

| Metric | Source | Why |
|--------|--------|-----|
| npm downloads `@vislab/react` etc. | npm | Install intent |
| Download split by package | npm | Which adapter wins |
| CDN hits on `vislab-embed.min.js` | if self-hosted on release CDN | Static embed usage |
| Dependent repos | GitHub / libraries.io later | Real integration |

### C. Product quality

| Metric | Source | Why |
|--------|--------|-----|
| CI pass rate on main | GitHub Actions | Trust |
| Open issues by label | GitHub | Pain themes |
| Time-to-first response | Manual / bot | Community health |
| Visual regression flake rate | CI | Maintenance cost |
| Bundle size trend | `check-bundle-size` CI artifact | Perf regression |

### D. Embed telemetry — ethical scope

**Default: off.** Authors embedding VisLab in docs should not phone home.

**Acceptable optional patterns:**
- Docs site analytics only  
- Explicit opt-in “usage ping” for CLI (`vislab stats --opt-in`) — usually not worth it early  
- Public “add your blog to ADOPTERS.md” honor system  

**Avoid:** silent beacons in `vislab-embed.min.js`, fingerprinting, per-page tracking of reader behavior inside widgets.

---

## Healthy 30 / 60 / 90-day trajectories

### Benchmarks from research / playbooks [web 2025–2026]

- arXiv 2025 analysis of HN-linked GitHub launches (AI tools sample): average **~121 stars / 24h**, **~189 / 48h**, **~289 / week**; **medians substantially lower** (viral outliers inflate means).  
- Multi-channel OSS guides (2026) cite examples of **1,200 stars in ~3 months** with Reddit prep + Show HN + content — upper success case, not baseline.  
- Product Hunt can move GitHub stars for devtools but is less predictable for education niche libraries.

### Suggested VisLab targets (niche systems/education tool)

These are **planning targets**, not promises.

| Horizon | Stars | npm weekly downloads (all @vislab) | Qualitative |
|---------|-------|-------------------------------------|-------------|
| **Day 0** | 0 | 0 | Launch assets live |
| **30 days** | 80–250 | 200–1,000 | ≥3 external embeds found; issues from strangers |
| **60 days** | 150–400 | 500–2,500 | 1–2 community PRs; docs feedback |
| **90 days** | 250–700 | 1,000–5,000 | Clear top-2 widgets by demand; roadmap reopened |

**Weak launch signal:** <30 stars at day 30 **and** no install attempts → message/demo failed; do not spam more launch sites until product story fixed.

**Strong launch signal:** >200 stars week one **or** multiple unprompted eng-blog embeds → invest in docs + flagship depth.

---

## Funnel model

```
Show HN / blog / Reddit
        ↓
   Demo gallery visit
        ↓
   GitHub star OR npm install
        ↓
   First successful embed (local)
        ↓
   Production publish of article
        ↓
   Issue/PR or second embed
```

Instrument each step with **proxy metrics** (you cannot see production embeds easily without adopters list).

**Proxy for production embeds:** Google `vislab-embed` / `@vislab/react` search; request ADOPTERS; GitHub code search after popularity.

---

## Feedback-loop plan

### Issue triage cadence

| Cadence | Action |
|---------|--------|
| Daily (launch week) | Triage new issues; label `bug` / `question` / `enhancement` |
| 48h SLA | First human response on bugs |
| Weekly | Close/dupe sweep; update project board |
| Biweekly | Publish short “what we shipped” in Discussions |

### Roadmap transparency

**Problem [verified]:** TODOS.md marks almost everything done; open issues empty; looks abandoned-finished rather than living.

**Fix:**
- Replace TODOS with **Now / Next / Later** (3–7 items max)  
- Keep GitHub milestones for 0.2, 0.3  
- Publicly state support tiers  

### Contribution funnel

CONTRIBUTING already explains widget registration — good.

Add:
1. `good first issue` (docs typos, prop descriptions, tests)  
2. Widget wishlist voting (Discussions poll)  
3. Design notes for flagship correctness  
4. CODE_OF_CONDUCT for safety at scale  

**Reject early:** drive-by dependency bumps that break CI (already a theme).

---

## Iteration themes by phase

### 0–30 days: stabilize & learn
- Fix install friction reported in HN comments  
- Patch top 3 bugs  
- Double down on whichever adapter gets downloads  

### 31–60 days: deepen flagships
- Pedagogy + a11y for top widgets  
- One major content piece from community feedback  
- Possibly drop or freeze low-value surface (exporter polish)  

### 61–90 days: ecosystem
- Third-party widget example  
- awesome-list presence  
- Consider PH only if landing quality is high  
- Revisit monetization lightly (Sponsors)  

---

## Dashboards (lightweight)

Solo-maintainer stack:
1. GitHub Traffic screenshot weekly  
2. npm package page downloads  
3. Plausible on docs (1 script)  
4. Spreadsheet: date, stars, downloads, notes, top issue  

Skip expensive product analytics suites.

---

## Risks to metric interpretation

| Trap | Reality |
|------|---------|
| Stars ≠ usage | Track downloads + embeds |
| HN spike then flatline | Normal; plan content cadence |
| Dependabot issue noise | Don’t count as community |
| Vanity widget count | Prefer depth metrics (issues on CpuPipeline) |

---

## Checklist

- [ ] Establish baseline spreadsheet on launch day zero
- [ ] Enable GitHub repo Traffic monitoring (Insights)
- [ ] Add privacy-friendly analytics to docs/demo only
- [ ] Publish npm packages so download metrics exist
- [ ] Create ADOPTERS.md and ask early users to PR
- [ ] Define launch-week issue SLA (48h)
- [ ] Rewrite TODOS.md as living Now/Next/Later
- [ ] Open Discussions for Q&A vs using issues as chat
- [ ] Label `good first issue` for 3 real tasks
- [ ] Review metrics at day 7, 30, 60, 90 with go/no-go on more launch channels
- [ ] Do not add default embed telemetry
- [ ] Archive failed experiments (e.g. if Jekyll usage ~0, freeze gem features)
- [ ] Celebrate qualitative wins (first external blog embed) as leading indicators
