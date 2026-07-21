# VisLab Audit §3 — UX & Developer Experience

**Audit date:** 2026-07-21  
**“User” defined as:** technical writer / educator / eng-blog author embedding widgets  
**Evidence:** README, docs/QUICKSTART.md, Starlight docs, Studio, CLI, adapters, npm registry status

---

## Executive verdict

On paper, VisLab has one of the better early DX shapes for a niche embed kit: four paths, a Studio with Copy MDX/HTML/Jekyll/iframe tabs, a CLI, and a single registry. **In practice, the critical path is broken for strangers:** packages are not on npm, docs site domain is wrong/colliding, component docs are stubs, and version/Node requirements disagree. Time-to-first-widget is closer to “clone monorepo and build” than “npm install and ship.” That is fatal for the stated audience, who will not run Turbo to drop a cache simulator into a Hashnode post.

---

## Onboarding: README → first working embed

### Path A — React / Astro (documented as primary)

**Documented steps [verified `docs/QUICKSTART.md`]:**
```bash
npm install @vislab/react
```
```tsx
import { StorageComparison } from "@vislab/react";
```

**Actual outcome [verified 2026-07-21]:**
```
npm error 404 Not Found - GET https://registry.npmjs.org/@vislab%2freact
```

**Friction score:** 10/10 blocking. Every happy-path install instruction is currently a lie of omission until first publish.

### Path B — Static HTML

Requires building from monorepo:
```bash
pnpm --filter @vislab/cli exec vislab build -o ./public/vislab
```
Then `data-vislab` + `vislab-embed.min.js`. **[verified]** examples under `examples/html/`. Works only if developer clones repo, has Node ≥ 22.12 (engines), pnpm 10, and successful build. Not a CDN/script-tag story yet (no release artifacts).

### Path C — Jekyll

Gem `vislab-jekyll` documented; gemspec exists at 0.1.0. **Not verified published to RubyGems** in this audit. Includes look correct (`vislab.html`, `vislab_iframe.html`). Bundle copy to `assets/vislab/` is still operator work.

### Path D — Studio → copy snippet

`pnpm --filter studio dev` — StudioWorkbench builds MDX/HTML/Jekyll/iframe snippets from registry props. **[verified]** Good authoring UX **if** local monorepo runs. Iframe snippet hardcodes `/vizlab/...` path which may not match deploy layout — footgun.

---

## Time-to-first-widget (honest estimates)

| Path | Ideal (if published) | Today (verified constraints) |
|------|----------------------|------------------------------|
| React npm | 2–5 min | **Blocked** — package 404 |
| Static HTML from CDN | 2 min | **No CDN/release** |
| Clone + build + HTML | 20–45 min | Feasible for contributors |
| Studio copy MDX | 10–20 min local | Feasible; install still fails for consumers |
| Jekyll gem | 10–15 min | Gem publish status unverified |

**[blunt]** VisLab is currently a **contributor monorepo**, not a **consumer product**. DX audit must score the consumer path near zero until publish + hosted demo.

---

## CLI ergonomics

**Commands [verified `tools/cli/src/index.ts`]:**
| Command | Purpose |
|---------|---------|
| `vislab build` | Copy/build IIFE bundles to output dir |
| `vislab widget -c CpuPipeline` | Standalone iframe HTML |
| `vislab preview` | demo-blog dev server |
| `vislab new` | Scaffold jekyll/html/astro |
| `vislab export` | GIF/MP4 path (via exporter) |

**Issues [verified]:**
- Package version `0.1.0` vs Commander `0.2.0` vs README `0.2.0`
- Invocation is `pnpm --filter @vislab/cli exec vislab …` — painful; no global install story until npm publish of `@vislab/cli`
- Preview targets demo-blog only; cannot preview arbitrary consumer project
- `new` scaffolds are secondary to install-from-npm mental model

**Positive:** widget command is the right primitive for “drop an iframe in Ghost/Substack/CMS that forbids custom JS.”

---

## Studio usability

**Strengths [verified `StudioWorkbench.tsx`]:**
- Registry-driven component picker
- Prop editors from schema (boolean/number/string/string[])
- Export tabs: mdx / html / jekyll / iframe
- Live `VislabMount` preview
- URL `?component=` deep link

**Weaknesses:**
- No hosted Studio URL — local only
- Iframe export path may be wrong for production hosting
- No “download zip of standalone widget” button (CLI does this separately)
- No auth/share/cloud — fine for OSS, but then local DX must be trivial

---

## Documentation completeness

| Asset | Quality | Notes |
|-------|---------|-------|
| Root README | Good positioning, weak install truth | Value prop clear; packages unusable |
| `docs/QUICKSTART.md` | Solid structure | Node 18+ wrong vs engines 22.12; npm paths dead |
| Starlight `apps/docs` | Scaffold only for components | ~20 words per widget MDX |
| Docs quickstart page | Thin | Defers HTML/Jekyll to GitHub QUICKSTART |
| Guides (astro/html/jekyll) | Present | Not re-audited line-by-line; structure OK |
| API core | Present | JSDoc-level |
| CONTRIBUTING | Clear widget-add steps | Good for contributors |
| Examples | Minimal HTML | Explicitly “after first release” for npm examples |

**Component docs failure mode:** Live gallery import is valuable, but without props tables, pedagogy notes, or performance guidance, Studio becomes the real docs — and Studio isn’t public.

---

## Error messages

**[verified]** `createVislabComponent` throws `Unknown VisLab component: ${globalName}` — clear.

**[reasonable inference]** Canvas getContext failure throws hard. Prop parse helpers may silently drop bad values rather than warn (depends on `parseNumber` etc.). No structured error UI in embeds when `data-vislab` name is wrong — empty div risk.

**DX bar for embeds:** unknown component should render a visible HTML error in the mount node in non-production, not silent blank.

---

## Framework-adapter parity

| Capability | React | Web components / data-vislab | Jekyll |
|------------|-------|------------------------------|--------|
| Registry-driven | Yes | Yes | Yes (via embed script) |
| Named exports | Yes (catalog) | Custom element tags | include params |
| Props | JSX props | `data-props` JSON | Liquid props string |
| Lifecycle destroy | useEffect cleanup | CE disconnect (verify) | page unload |
| Tree-shaking | Possible if ESM | Full IIFE typical | Full IIFE |
| Docs quality | Primary | Secondary | Tertiary |
| Works offline monorepo | Yes | Yes | Yes |
| Works from registry today | **No** | **No** (no release JS) | **No** |

**Parity claim:** Architecture parity is high; **product parity is not** — React is best-documented, static HTML is second, Jekyll is “also supported.” Astro is React-island based, not a first-class Astro component package.

**React adapter note [verified]:** `VislabMount` JSON-stringifies props for effect deps — works for serializable props only; functions/callbacks unsupported (acceptable).

---

## Mental model fit for technical writers

Writers want:
1. Copy snippet  
2. Paste into MDX/Markdown  
3. Deploy  

VisLab wants them to:
1. Choose adapter  
2. Possibly run CLI  
3. Host JS assets  
4. Learn registry names  

Studio closes that gap **if hosted**. Without hosted Studio + npm/CDN, the tool competes poorly with Mermaid (one fenced code block) and Excalidraw (image export).

**Competitive DX [web 2026]:** Mermaid has ~89k GitHub stars and native GitHub rendering — zero embed JS for many hosts. Excalidraw wins on freeform drawing. VisLab’s only viable DX bet is **“specialized systems simulations in one line of MDX”** after install works.

---

## Pre-launch DX unblock list (ordered)

1. Publish `@vislab/react`, `@vislab/web-components`, `@vislab/registry`, `@vislab/core`, `@vislab/components`, `@vislab/cli` at 0.1.0  
2. Attach release assets: `vislab-embed.min.js` + integrity hash  
3. Host docs + Studio on a non-colliding domain  
4. Rewrite README install section with working commands only  
5. Expand 5 flagship component pages to real docs (props, examples, pedagogy)  
6. Global `npm i -g @vislab/cli` path or `npx @vislab/cli`

---

## Checklist

- [ ] **Do not market npm install** until packages resolve on registry.npmjs.org
- [ ] Publish 0.1.0 packages + GitHub Release with embed JS assets
- [ ] Host public Studio with Copy snippet that matches production CDN URLs
- [ ] Fix Node version docs (engines vs QUICKSTART)
- [ ] Add visible mount error for unknown `data-vislab` / React component names
- [ ] Expand top-5 widget docs beyond one-sentence MDX stubs
- [ ] Document CDN usage with SRI hashes
- [ ] Verify Jekyll gem install on a clean Jekyll 4.3 site; publish gem if missing
- [ ] Fix Studio iframe path defaults for real deploys
- [ ] Add `npx @vislab/cli widget` happy path to README (after publish)
- [ ] Record a 90-second “first embed” screencast for README
- [ ] Add troubleshooting page: hydration, SSR (Astro `client:visible`), CORS for file://
- [ ] Align CLI package version numbers
- [ ] Smoke-test all four paths in CI as consumer-style integration tests (install from packed tarball)
