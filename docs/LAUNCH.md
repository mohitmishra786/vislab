# Launch readiness & drafts

**Do not post publicly until the gate below is green and a maintainer explicitly approves.**

## Launch gate

- [ ] CI green on `main`
- [ ] npm `@vislab/*` 0.1.0 installable
- [ ] Public demo + docs URL live
- [ ] README install path works for strangers
- [ ] Maintainer available 24–48h for comments

## Show HN drafts

**Titles:**

1. `Show HN: VisLab Widgets – embeddable CPU/cache/OS simulations for technical blogs`
2. `Show HN: Living systems diagrams for MDX (not screenshots or YouTube embeds)`

**First comment skeleton:**

> VisLab Widgets is an MIT monorepo of 17 canvas simulations (CPU pipeline, cache hierarchy, storage latency race, schedulers, …) embeddable via React/MDX or a ~19KB gzip embed script.
>
> Demo: \<URL\>  
> Install: \<npm or monorepo\>  
> Why: technical posts need temporal intuition without heavy video.
>
> Looking for feedback on: pedagogy accuracy, a11y, and which widgets to deepen first.

## FAQ (pre-write)

1. **Is this WebGL?** No — Canvas 2D.  
2. **vs Mermaid?** Mermaid is structure; we simulate time.  
3. **Accessible?** Buttons + summaries; canvas still needs captions.  
4. **Bundle size?** ~16–19 KB gzip for IIFE kits.  
5. **Production ready?** Pre-1.0; API may change.  
6. **Jekyll?** Supported best-effort.  
7. **Offline?** Yes, self-host the JS.  
8. **Telemetry?** None in embeds.  
9. **Name collision?** Prefer “VisLab Widgets.”  
10. **License?** MIT.

## Reddit title ideas

- r/programming: “Embeddable CPU/cache simulations for technical blogs (OSS)”  
- r/technicalwriting: “Looking for feedback: interactive systems widgets for MDX posts”  
- r/compsci: “Open-source pipeline/cache widgets for course sites”

## Pitch list (systems / CS blogs — seed)

1. PlanetScale eng blog style / interactive systems authors  
2. Ben Dicken / educator interactive posts  
3. Company eng blogs using Astro/MDX (Vercel, Cloudflare-style)  
4. OS course maintainers (public university course sites)  
5. “Crafting Interpreters” adjacent compiler educators  
6. freeCodeCamp news (harder placement)  
7. Dev.to systems tag regulars  
8. Hashnode systems writers  
9. Database internals newsletters  
10. Performance.now() / browser perf educators  
11. CS Field Guide contributors  
12. OSSU / awesome-courses adjacent  
13. Kernel/OS blog authors  
14. Distributed systems explainers (for future Raft widgets)  
15. Compiler Twitter/course accounts  
16. Technical writing communities (Write the Docs adjacent)  
17. Astro blog theme authors  
18. Jekyll academic theme users  
19. Systems Discord/Slack communities  
20. HN “Ask HN: tools for teaching systems” threads  

## Product Hunt

Only after a polished landing gallery exists. Avoid same-day PH + HN unless capacity allows.

## Issue SLA (launch week)

First human response on bugs within **48 hours**.
