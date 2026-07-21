# VisLab Audit §7 — Monetization & Sustainability

**Audit date:** 2026-07-21  
**Evidence:** MIT license, repo state (0 traction), package architecture, web research on OSS funding norms 2025–2026

---

## Executive verdict

At **0 stars, 0 downloads, and no users**, every monetization path is **theoretical**. The honest primary goal for the next 6–12 months is **reputation and adoption**, not revenue. MIT is the right license for embed libraries (low friction). Sustainable money, if any, will come later from **services, hosted convenience, or education packs** — not from putting the core engine behind a paywall. Forcing SaaS now would add maintenance without demand.

---

## Current economic reality (verified)

| Factor | State |
|--------|-------|
| License | MIT (permissive) |
| Traction | ~0 |
| Users / design partners | Not evidenced in repo |
| Funding files | No `FUNDING.yml` |
| Hosted product | Studio/docs apps local only |
| Maintainer model | Solo |
| Burn | Time + CI minutes + future hosting |

**[blunt]** Discussing ARR models at this stage is mostly cosplay unless framed as *options after product-market signal*.

---

## Path analysis

### 1. Intentionally unmonetized portfolio / reputation project

**Realism now:** **Highest**  
**Requires growth first:** No  

Ship as showcase of systems + frontend craft. Career ROI can exceed early sponsor dollars. Many excellent OSS tools stay here for years.

**When to choose:** If founder bandwidth is limited and goal is credibility.

---

### 2. GitHub Sponsors / Open Collective (tip jar)

**Realism now:** Near zero dollars  
**After ~1k stars + real embed users:** Low–moderate coffee money  
**Industry context [web 2025–2026]:** GitHub Sponsors has returned $40M+ platform-wide; individual niche libraries often make symbolic amounts unless critical infrastructure. Guides still recommend Sponsors as **first** funding surface because friction is low.

**Action when ready:** Add `FUNDING.yml`, sponsor tiers (logo in README, priority widget request).

**Do not expect:** Salary replacement for a niche education embed kit.

---

### 3. Hosted “Studio” SaaS

**Idea:** Cloud Studio with saved compositions, team libraries, CDN hosting of widget configs, SSO.

**Realism now:** **Low** — no demand proof  
**Requires:** 10×–100× awareness, plus willingness to pay for what npm already gives free  

**Pricing norms [reasonable inference from OSS devtools]:** $0 free OSS; $10–30/mo pro for individuals; $100+/mo team — only if hosted value is clear (CDN, analytics, private widgets).

**Risk:** Becomes a second product (auth, billing, uptime) that distracts from widget quality.

**Verdict:** **Post-traction only**. Self-host Studio remains free.

---

### 4. Paid template / widget packs

**Idea:** Premium widgets (e.g. distributed systems: Raft, Paxos, CRDTs) or course-ready lesson packs under commercial license; core stays MIT.

**Realism after traction:** Medium for **education market**  
**Risk:** Dual licensing complexity; community resentment if core feels starved  

**Better variant:** Free core + paid **curriculum kits** (lesson plans, quizzes, LMS packages) sold to universities — content business, not license gotcha.

---

### 5. Enterprise embed licensing for doc platforms

**Idea:** Charge ReadMe, Mintlify, GitBook-class platforms or large corps for supported embeds, SLA, branded themes.

**Realism:** Requires sales motion and security review readiness (a11y, SBOM, support).  
**At 0 users:** Fantasy.  
**At widespread MDX adoption:** Possible niche contracts.

**MIT implication:** Enterprises can already use the code; they pay for **support, indemnity, and priority features** — not access.

---

### 6. Consulting / custom widgets

**Realism after any visible launch:** **Highest revenue-per-hour path for a solo maintainer**  
Companies and course authors will pay for a custom simulation matching their architecture diagrams.

**Pricing [reasonable market inference]:** project fees from low thousands upward depending on complexity.

**Fit:** Excellent alignment with “17 widgets + registry extension API.”

---

### 7. Export / media tooling premium

GIF/MP4 exporter (Puppeteer) could be free CLI with paid “cloud render” — usually not worth it at this scale. Keep export free as marketing (Twitter/LinkedIn demos).

---

### 8. Grants / education funding

CS education grants, Mozilla/GitHub open source funds, university collaborations. Sporadic but real for education tooling. Requires applications and reporting.

---

## What is *not* realistic

| Idea | Why not |
|------|---------|
| Paywall core MIT package | Trust destruction; forks |
| Ads inside embeds | Toxic for docs; authors will reject |
| Crypto / token funding | Audience mismatch |
| Aggressive “open core” split before users | Complexity without demand |

---

## Recommended sustainability stance (phased)

### Phase 0 — Now (0 traction)
- Stay fully MIT  
- No pricing page  
- Track time invested; treat as portfolio + learning  
- Optional: GitHub Sponsors button after first 50–100 stars (even if $0)

### Phase 1 — Early adoption (dozens of embeds, hundreds of stars)
- Sponsors + “hire me for custom widgets” CTA  
- Free hosted demo (cost: static hosting)  
- One paid pilot only if someone asks

### Phase 2 — Category foothold (thousands of stars or clear education installs)
- Curriculum packs or pro themes  
- Support retainers for doc platforms  
- Revisit hosted Studio only with waitlist demand  

### Phase 3 — If business intent is real
- Form entity, proper support SLAs  
- Never break embed freedom for MIT users  

---

## Cost structure to plan for (even if free product)

| Cost | Notes |
|------|-------|
| Maintainer time | Dominant cost |
| CI (GitHub Actions) | Visual regression + Puppeteer heavy |
| Hosting demo/docs | Low (Cloudflare/Pages/Netlify free tiers) |
| Domain | ~$10–20/yr — **required** (brand) |
| npm org | Free for public packages |
| Chromium in CI | Minutes + cache strategy |

Sustainability first means **reducing maintenance surface**: four embed paths + Puppeteer exporter + three apps is a lot for solo revenue $0.

---

## Strategic recommendation

**Primary:** Portfolio-grade OSS with consulting upside.  
**Secondary:** Sponsors after proof.  
**Tertiary:** Education packs / support.  
**Avoid:** Premature SaaS.

If the founder’s goal is a venture-scale company, VisLab’s TAM (systems-teaching embeds) is **narrow** — better as a **beloved niche tool** or acquisition-by-docs-platform story than as a unicorn narrative. **[reasonable inference]**

---

## Checklist

- [ ] Write a one-sentence founder goal: portfolio vs product business vs education nonprofit
- [ ] Do **not** build billing before publish + launch
- [ ] After ~100 stars, add `FUNDING.yml` + Sponsors
- [ ] Add “Custom widgets / consulting” contact in README when ready for clients
- [ ] Track cost of CI minutes post-launch; optimize visual tests
- [ ] Keep core MIT; document commercial support separately if offered
- [ ] If education packs: validate with 2 instructors before building a store
- [ ] Revisit hosted Studio only with written demand (issues/waitlist)
- [ ] Prefer static hosting free tier for demo sustainability
- [ ] Register domain early (brand asset, not monetization)
- [ ] Avoid license changes that surprise early adopters
- [ ] Re-evaluate monetization in 90 days post-launch with real usage data
