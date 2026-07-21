# VisLab Audit §6 — Distribution, Community & Launch Strategy

**Audit date:** 2026-07-21  
**Evidence:** GitHub traction metrics, issue/PR state, release absence, web research on Show HN / PH / OSS launch playbooks (2025–2026)

---

## Executive verdict

VisLab is in a **true pre-launch state**: 0 stars, 0 forks, 0 watchers, 0 releases, packages not on npm, no public demo URL, no open community issues (roadmap issues closed en masse). Engineering burst (Apr–Jun 2026) produced a real monorepo; distribution work has not started. That is fixable, but only with a **sequenced launch** that prioritizes proof (demo + install) before amplification. Launching to HN with a red CI and `npm install` 404 is how you burn the only first impression.

---

## Pre-launch state assessment (verified)

| Metric | Value | Source |
|--------|-------|--------|
| Stars | **0** | GitHub API 2026-07-21 |
| Forks | **0** | same |
| Watchers | **0** | same |
| Releases | **0** | same |
| npm `@vislab/*` | **404** | npm registry |
| Open issues | **0** (only Dependabot PRs open) | gh |
| Closed issues | 35 (roadmap bulk) | gh |
| Homepage | empty | gh |
| Contributors | effectively 1 | git shortlog |
| Commit window | 2026-04-12 → ~2026-06-29 human activity | git |
| CI on main | **failing** since 2026-06-29 | gh runs |

**Interpretation:** This is not “quiet success.” This is **unlaunched**. Zero traction with zero launch attempt is not a product-market signal yet — there is no market exposure.

Community files missing: no `CODE_OF_CONDUCT.md`, no `SECURITY.md`, no `FUNDING.yml`, no Discussions enabled assessment beyond defaults.

---

## Launch readiness gate (must pass before Show HN)

- [ ] Green CI on `main`
- [ ] npm packages installable
- [ ] Public demo + docs on owned domain (not colliding `vislab.dev`)
- [ ] README GIF + working install
- [ ] Known good path for HTML script embed (release asset)
- [ ] Maintainer available 24–48h for comments

Until then: **silent** prep only (build in public threads OK; don’t drive traffic).

---

## Channel strategy

### 1. Hacker News — Show HN (primary)

**Fit:** High. Audience loves systems posts, PlanetScale-style interactivity, and OSS tools for writers/devs. The inspiration post (PlanetScale IO latency, Mar 2025) already trained HN on this aesthetic.

**Title patterns (draft):**
- `Show HN: VisLab – embeddable CPU/cache/OS simulations for technical blogs`
- `Show HN: Living systems diagrams for MDX (not screenshots or YouTube embeds)`

**Preparation [2025–2026 launch guidance synthesis]:**
- Tue–Thu morning US time commonly recommended in OSS launch guides; arXiv 2025 analysis of HN→GitHub found **timing matters more than “Show HN” tag alone**
- Average analyzed launch: ~**121 stars / 24h**, ~**289 / week** — median lower; don’t expect averages
- First comment within minutes: problem, demo URL, install, stack, what you want feedback on
- Host demo that works without npm (CDN script) for click-throughs

**Risks:** Name collision; “yet another canvas demo”; broken links; academic thinness if widgets feel toy-like under scrutiny.

### 2. Product Hunt

**Fit:** Medium. Devtools do launch on PH; OSS solo tools can win (2025–2026 examples discussed in PH community threads). PH audience is less “CPU pipeline” native than HN.

**Use PH if:** polished landing page + gallery + maker story exist. Skip PH if only a bare GitHub README — it will underperform and consume a launch slot psychologically.

### 3. Reddit

| Subreddit | Fit |
|-----------|-----|
| r/programming | Medium-high for Show-style link |
| r/ExperiencedDevs | Discussion angle: teaching systems at work |
| r/compsci | Education angle |
| r/javascript / r/reactjs | Embed DX angle |
| r/technicalwriting | **Direct audience** — often overlooked |

Follow each sub’s self-promo rules; prefer value post (“How we embedded a cache simulator in MDX”) over dump link.

### 4. dev.to / Hashnode / personal blog

**Fit:** Excellent — audience is technical writers. Cross-post the flagship tutorial 1–2 days before HN (indexing + secondary traffic), per 2026 launch playbooks that cite multi-channel prep.

### 5. npm discoverability

After publish: keywords, quality README, `vislab` binary, weekly download badge on GitHub README. npm is not a launch spike channel; it is **long-tail install conversion**.

### 6. Awesome-lists

**Candidate lists [web search 2026]:**
- [BolajiAyodeji/awesome-technical-writing](https://github.com/BolajiAyodeji/awesome-technical-writing)
- [wongyah/awesome-technical-writing-learning](https://github.com/wongyah/awesome-technical-writing-learning)
- [raphamorim/awesome-canvas](https://github.com/raphamorim/awesome-canvas) (via sindresorhus/awesome)
- CS education lists / awesome-courses adjacent resources
- Possibly visualization tool lists

PR only **after** public demo + license clarity + non-zero usage signal (even small). Empty 0-star spam PRs get closed.

### 7. GitHub topics + social

Topics already strong. Add demo video to repo. Optional: Discussions for Q&A; label `good first issue` only when tasks are real.

---

## Seeding via technical blogs & newsletters (candidates)

**Method:** Search + known systems-education publishers. **Pitch angle:** free embed widgets that match their existing topics; offer a guest interactive figure.

**Candidate categories [mix of verified search hits + reasonable inference]:**

| Outlet / person type | Why pitch |
|----------------------|-----------|
| PlanetScale blog style authors / Ben Dicken-type educator blogs | Aesthetic alignment; IO/cache content |
| Systems newsletters (e.g. high-scale infra writers) | Visual assets for posts |
| CS course maintainers (public course sites) | Lab widgets |
| “Crafting Interpreters” / compiler-education adjacent authors | Lexer/parser/CFG widgets |
| Company eng blogs that already use MDX/Astro | Lowest embed friction |
| freeCodeCamp / CSS-Tricks-class publishers | Reach (harder to place) |

**[assumption — needs founder input]** Warm intros vs cold email capacity.

**Pitch kit:** 3 screenshot GIFs, one paragraph value, MIT license, install 3 lines, offer to help integrate.

---

## Community building (post first 100 stars)

1. **Re-open a living roadmap** — TODOS.md is closed-checkbox theater; use GitHub Projects + 5 open “help wanted” issues  
2. **CONTRIBUTING is good** — add “good first issue” for new widget templates  
3. **Do not over-automate issues** — 35 closed issues in one day looks synthetic to contributors  
4. **Discord only if** you will moderate; otherwise GitHub Discussions  

---

## Concrete 30-day launch plan

### Days −14 to −7 (silent)
- Green CI, 0.1.0 publish, domain, demo deploy  
- Flagship blog draft with live embeds  
- Show HN assets (title, first comment, FAQ on a11y/bundle size)

### Days −6 to −1
- Soft share to 5 friends/educators for feedback  
- Publish blog on own domain + dev.to  
- Submit awesome-list PRs only if demo is live  

### Launch day
- Show HN morning  
- Cross-post Reddit (rules-aware) + relevant Discords  
- Stay online for technical questions  

### Days +1 to +14
- Triage issues within 48h  
- Ship one highly requested fix/widget tweak  
- Thank early adopters; collect embed URLs for social proof  

### Days +15 to +30
- Second content piece (deeper widget)  
- Consider PH if landing page quality is high  
- Write “what we learned from launch” for compounding attention  

---

## Success thresholds (calibrated)

Given HN research averages vs medians (averages pulled by viral outliers):

| Outcome | 7-day stars | Meaning |
|---------|-------------|---------|
| Weak | <30 | Message/demo failed; iterate before more launches |
| OK | 50–150 | Niche interest; content marketing next |
| Strong | 200–500 | Good Show HN; double down on docs |
| Viral | 500+ | Protect maintainer time; pin contribution paths |

Downloads may lag stars for embed libraries; track both.

---

## Checklist

- [ ] Pass launch readiness gate (CI, npm, demo, domain)
- [ ] Write Show HN first comment + 10 FAQ answers offline
- [ ] Deploy demo gallery URL; set as GitHub homepage
- [ ] Publish 0.1.0 + Release assets (`vislab-embed.min.js`)
- [ ] Soft-launch content on dev.to/Hashnode 24–48h before HN
- [ ] Prepare Reddit titles tailored per sub
- [ ] Build pitch list of 20 systems/CS blogs
- [ ] Add CODE_OF_CONDUCT + SECURITY.md before traffic
- [ ] Open 3–5 genuine `good first issue` tickets
- [ ] Enable Discussions or decide explicitly against
- [ ] Plan launch-week on-call (issue SLA 48h)
- [ ] Track stars/forks/npm daily for 30 days (see §11)
- [ ] Avoid simultaneous PH + HN same day unless capacity allows
- [ ] Do not launch while Dependabot-broken main is red
