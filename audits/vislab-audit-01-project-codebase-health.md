# VisLab Audit §1 — Project & Codebase Health

**Audit date:** 2026-07-21  
**Scope:** Monorepo architecture, dependencies, tests, CI/CD, TypeScript, debt, versioning, packaging  
**Evidence standard:** Verified against local clone + GitHub API unless tagged otherwise

---

## Executive verdict

VisLab is a **technically serious pre-1.0 monorepo** with real engineering discipline (Turbo, Biome, Changesets, vitest, Playwright visual regression, bundle budgets, Dependabot, CodeQL) — and simultaneously a **launch-blocked product**: packages are unreleased (`0.0.0` / not on npm), `main` CI has been red since 2026-06-29, and community surface area (sponsors, CoC, security policy) is empty. The codebase is healthier than its traction implies; the release and ops layer is weaker than `TODOS.md` claims.

---

## Architecture soundness (verified)

**Structure [verified fact]:**
- Root: `pnpm-workspace.yaml` + `turbo.json` + root `package.json` (`vislab-monorepo@0.0.0`, private)
- Packages: `core`, `components`, `registry`, `react`, `web-components`, `jekyll-theme`
- Tools: `cli`, `exporter`
- Apps: `docs` (Starlight), `studio`, `demo-blog` (Playwright e2e)
- Package manager pinned: `pnpm@10.33.0`; engines `node >= 22.12.0`
- ~5.3k lines of TypeScript across packages/tools/apps (excluding node_modules)

**Dependency graph [verified fact]:**
```
@vislab/core (no runtime deps)
    ↑
@vislab/components
    ↑
@vislab/registry  →  @vislab/react, @vislab/web-components, @vislab/cli
```
Registry-first design is sound: one manifest (`registry.ts`, 17 widgets) drives React, custom elements, `[data-vislab]`, Studio, and CLI. Adding a widget is documented as a 5-step path in `CONTRIBUTING.md`.

**Assessment:** Architecture is appropriate for a multi-adapter visualization kit. It is **not** over-engineered for the problem (shared ECS + registry is the right abstraction). Risk is breadth: four embed paths + three apps + exporter before any public install path works.

---

## Dependency risk

| Area | Status | Notes |
|------|--------|-------|
| `@vislab/core` runtime | **Clean** | Empty `dependencies` — zero-deps claim holds |
| Components | Low | Only workspace `@vislab/core` |
| React adapter | Peer React 18 | Reasonable; no React 19 explicit peer yet |
| CLI | Medium | `commander`, `zx`, `chalk` |
| Exporter | **High for CI/local** | `puppeteer@^24` pulls Chromium |
| Apps | Medium-high | Astro 6 stack; root has many `pnpm.overrides` for security |
| Patches | Present | `@astrojs/internal-helpers@0.10.0` patch |

**[verified fact]** Root `package.json` contains a long `pnpm.overrides` list (babel, esbuild, vite, vitest, ws, postcss, etc.) — signal of active security triage, not of a greenfield clean tree.

**[verified fact]** Security audit workflow on main failed 2026-07-20 with `gh: Resource not accessible by integration (HTTP 403)` when listing Dependabot alerts — process broken, not necessarily open vulns.

---

## Test coverage (or absence)

**What exists [verified fact]:**
| Layer | Files | Coverage shape |
|-------|-------|----------------|
| Unit (core) | `SimClock.test.ts`, `Scheduler.test.ts` | Clock pause/speed/tick; scheduler basics |
| Unit (registry) | `registry.test.ts` | 17 entries uniqueness; **lifecycle mount/destroy for every widget**; prop smoke for CpuPipeline + CacheSimulator |
| E2E | `smoke.spec.ts`, `visual.spec.ts` | demo-blog; 17 Playwright visual snapshots |

**What is missing [verified fact / reasonable inference]:**
- No unit tests under `packages/components` for simulation correctness (pipeline hazards, LRU vs FIFO, scheduler fairness)
- No React/web-components adapter unit tests
- No CLI/exporter tests
- Visual snapshots prove **pixels**, not **pedagogical accuracy**

Coverage is **strong for a 0.x registry product**, weak for a “systems engineering fidelity” claim. Lifecycle tests are the right pre-1.0 investment; algorithmic tests should be next.

---

## CI/CD status

**Workflows present [verified fact]:**
- `ci.yml` — lint → typecheck → test → build → bundle budget → Playwright e2e
- `release.yml` — Changesets publish on push to main (needs `NPM_TOKEN`)
- `codeql.yml`, `dependency-review.yml`, `security-audit.yml`
- `dependabot.yml` — weekly grouped updates, majors ignored

**Health [verified fact]:**
- Last **successful** CI on a main merge: ~2026-06-27 (`fix/dependabot-production-deps`)
- Last **main push** CI: **failure** 2026-06-29 after dependabot merge #45
- Open Dependabot PRs (#47, #48) also fail CI (Astro config load errors in docs/studio/demo-blog builds)

**Blunt assessment:** The project *has* CI, and for a while it worked. It does **not** currently have a green main. Shipping while red is reckless; launch readiness fails this gate alone.

---

## TypeScript strictness & build reliability

- Root `tsconfig.json`: `"strict": true` **[verified]**
- Package builds via `tsup` (cjs/esm; components also IIFE `VisLab`; web-components IIFE `VisLabEmbeds`)
- Bundle budgets: VisLab IIFE ≤ **85 KB gzip**, VisLabEmbeds ≤ **95 KB gzip** (`scripts/check-bundle-size.mjs`)
- **Measured locally 2026-07-21 (packages build succeeded):** VisLab IIFE **16.4 KB gzip / 86.8 KB raw**; VisLabEmbeds IIFE **18.8 KB gzip / 100.0 KB raw** — both within budget
- Full monorepo `pnpm run build` **fails** on apps (`demo-blog`/`docs`/`studio`): `js-yaml` does not provide export named `default` under current Vite/Astro stack — matches red CI

**Debt signals [verified]:**
- No `exports` map on most packages (only `@vislab/registry` has modern `exports`)
- No `keywords` / `description` on any publishable package.json
- Version drift: README claims CLI `0.2.0`; `tools/cli/package.json` is `0.1.0`; CLI binary `.version("0.2.0")`
- Quickstart says Node 18+; engines require Node ≥ 22.12
- `TODOS.md` says “Pre-release ready” and Astro 6 remaining advisories; main is already on Astro-era tooling but CI broken

---

## TODOS.md vs. reality gap

| Claim in TODOS (June 2026) | Reality (July 2026) |
|----------------------------|---------------------|
| CI: lint, typecheck, test, build, e2e, visual, bundle | Workflows exist; **main CI red** |
| npm publish prepared, not tagged | **Confirmed** — npm 404 for `@vislab/*` |
| 17 widgets, registry, Studio, docs | Present in tree |
| “Pre-release ready” | **Overstated** while CI fails and packages untagged |
| Astro 6 upgrade unchecked as remaining pre-release item | Partially stale; focus should be green CI + first publish |

Roadmap hygiene is better than most early OSS (closed issues #3–#35, phases pre-release/beta/1.0 marked done). The gap is **ops truthfulness**: roadmap celebrates completeness; repository state is “built but not shippable.”

---

## Versioning & release discipline

**Why everything is 0.0.0 [reasonable inference + verified process]:**
- README explicitly: all npm packages stay `0.x` until API stabilizes
- Changesets configured (`.changeset/config.json`), `ignore` includes apps + exporter + jekyll npm stub
- Release workflow present but **zero GitHub releases**, **zero npm packages**
- Without a first Changeset + successful publish, versions remain placeholders

**Recommendation:** Cut `0.1.0` as a coordinated first release once CI is green — not wait for mythical “API frozen.” 0.x already signals instability; zero published artifacts signals vaporware to evaluators.

---

## Packaging quality

| Claim | Verdict |
|-------|---------|
| `@vislab/core` zero-dependency | **True** (runtime) |
| Lightweight embed | **Budget-enforced**; actual gzip size needs green build to quote |
| Multi-format packages | Partial — missing `exports`, descriptions, keywords, `sideEffects` |
| Jekyll gem | `vislab-jekyll` gemspec 0.1.0 exists; not verified published to RubyGems |
| Install from README | **Broken path** — `npm install @vislab/react` 404s today |

---

## Bus factor & contributor reality

**[verified fact]** Commit authors: Mohit Mishra (46), chessMan (9), dependabot (5), ImgBot (1). Effectively **solo maintainer**. 59 commits total; first commit 2026-04-12, last human merge ~2026-06-29, then Dependabot noise through 2026-07-20.

---

## Checklist

- [ ] Restore **green CI on `main`** (block all launches until this is true)
- [ ] Fix Dependabot PR failures (Astro config load / workspace build order)
- [ ] Fix security-audit workflow token permissions (403 on Dependabot alerts API)
- [ ] Align CLI version: package.json vs Commander `.version()` vs README
- [ ] Align Quickstart Node version with `engines.node`
- [ ] Add `description` + `keywords` to every `@vislab/*` package.json before first publish
- [ ] Add modern `exports` maps to core/components/react/web-components
- [ ] Publish first coordinated **0.1.0** via Changesets + GitHub Release
- [ ] Add algorithm-level unit tests for flagship widgets (pipeline, cache, scheduler)
- [ ] Document Puppeteer/Chromium as optional/dev-only path; keep it out of default install story
- [ ] Add `SECURITY.md` and pin Dependabot alert triage cadence
- [ ] Re-run `pnpm run check:bundle-size` after green build and publish real gzip numbers in README
- [ ] Update `TODOS.md` “Pre-release ready” to reflect CI/publish blockers honestly
