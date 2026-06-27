#!/usr/bin/env bash
# One-time roadmap issue bootstrap. Safe to re-run only for new titles (duplicates are manual).
set -euo pipefail

create() {
  local title="$1"
  local labels="$2"
  local body="$3"
  gh issue create --title "$title" --label "$labels" --body "$body"
}

# ─── CI / Infrastructure ───────────────────────────────────────────────────

create "fix(ci): resolve pnpm version conflict in GitHub Actions" \
  "bug,area:ci,priority:critical,phase:pre-release" \
 "$(cat <<'EOF'
## Problem

CI fails on every PR before any step runs. `pnpm/action-setup@v4` errors:

```
Error: Multiple versions of pnpm specified:
  - version 10 in the GitHub Action config
  - version pnpm@10.33.0+sha512... in package.json packageManager
```

Seen on PR #2: https://github.com/mohitmishra786/vislab/actions/runs/28300854648

## Proposed solution

Remove the explicit `version: 10` from `.github/workflows/ci.yml` and let `packageManager` in root `package.json` drive the pnpm version (Corepack).

## Acceptance criteria

- [ ] `pnpm install --frozen-lockfile` succeeds in CI
- [ ] Full pipeline passes: lint → test → build → Playwright e2e
- [ ] No duplicate pnpm version sources in workflow

## Notes

This blocks all other CI-dependent work. Fix before merging registry PR.
EOF
)"

create "feat(ci): add TypeScript typecheck job across all packages" \
  "enhancement,area:ci,priority:high,phase:pre-release" \
 "$(cat <<'EOF'
## Problem

CI runs lint, test, and build but never runs `tsc --noEmit`. Type errors can slip through if tsup does not catch them.

## Proposed solution

- Add `"typecheck": "tsc --noEmit"` script to each TypeScript package
- Add turbo `typecheck` task with `dependsOn: ["^typecheck"]`
- Run `pnpm run typecheck` in CI before build

## Acceptance criteria

- [ ] All packages in scope typecheck in CI
- [ ] Turbo caches typecheck where applicable
- [ ] Fails CI on type errors without building

## Dependencies

- Requires CI pnpm fix (#TBD)
EOF
)"

create "feat(ci): add visual regression tests for all registry widgets" \
  "enhancement,area:ci,area:components,priority:medium,phase:beta" \
 "$(cat <<'EOF'
## Problem

Only one Playwright smoke test exists (demo-blog canvas visible). Widget rendering regressions are not caught.

## Proposed solution

- Add e2e spec per widget category or per widget (17 total)
- Capture screenshot baseline per widget on mount
- Compare on PR; allow `--update-snapshots` workflow for intentional changes
- Consider Percy/Chromatic or local pixel diff

## Acceptance criteria

- [ ] Each registry widget has a mount + screenshot test
- [ ] CI fails on unintended visual diff
- [ ] Document how to update baselines in CONTRIBUTING.md

## Dependencies

- demo-blog or docs must expose all 17 widgets
EOF
)"

create "feat(ci): add component lifecycle unit tests" \
  "enhancement,area:ci,area:components,priority:high,phase:beta" \
 "$(cat <<'EOF'
## Problem

Only `@vislab/core` has tests (SimClock, Scheduler — 5 tests). No tests verify widget mount/destroy, prop parsing, or registry `create()`.

## Proposed solution

- Add vitest + jsdom (or happy-dom) to `@vislab/components` or `@vislab/registry`
- Test each widget: constructor mounts canvas/DOM, `destroy()` cleans up
- Test registry prop parsing (e.g. CpuPipeline `stages`)
- Test `createVislabComponent` throws on unknown name

## Acceptance criteria

- [ ] Mount/destroy test for all 17 registry entries
- [ ] Prop parsing tests for widgets with `props` schema
- [ ] Tests run in CI via turbo `test`
EOF
)"

create "feat(release): setup Changesets and automated npm publish workflow" \
  "enhancement,area:release,area:ci,priority:high,phase:beta" \
 "$(cat <<'EOF'
## Problem

All packages are `0.0.0` / `0.1.0` with no CHANGELOG, no publish script, and no release automation.

## Proposed solution

- Add `@changesets/cli` at repo root
- Configure which packages publish (`@vislab/*`, not private apps)
- GitHub Actions workflow: on `changeset-release/*` or manual dispatch → version bump → publish to npm
- Add `CHANGELOG.md` per public package or root aggregated changelog

## Acceptance criteria

- [ ] `pnpm changeset` workflow documented in CONTRIBUTING.md
- [ ] CI publishes on tagged release (with `NPM_TOKEN` secret)
- [ ] Internal packages (`demo-blog`, `studio`, `docs`) stay private

## Notes

Hold actual publish until pre-release criteria met. Workflow can land earlier.
EOF
)"

create "chore: resolve Dependabot security alerts (47 vulnerabilities)" \
  "dependencies,area:ci,priority:critical,phase:pre-release" \
 "$(cat <<'EOF'
## Problem

GitHub reports **47 vulnerabilities** on the default branch (10 high, 26 moderate, 11 low). This undermines trust before any public release.

## Proposed solution

- Review Dependabot alerts dashboard
- Bump vulnerable transitive deps via `pnpm update` / overrides
- Enable Dependabot auto-merge for patch bumps where safe
- Document any accepted risks with justification

## Acceptance criteria

- [ ] Zero high-severity alerts (or documented exceptions)
- [ ] Moderate alerts reduced or scheduled
- [ ] `pnpm audit` passes or has documented suppressions
EOF
)"

# ─── Distribution / Release ───────────────────────────────────────────────

create "feat(release): publish @vislab/* packages to npm (pre-release channel)" \
  "enhancement,area:release,priority:high,phase:beta" \
 "$(cat <<'EOF'
## Problem

Packages only work inside the monorepo. External users cannot `npm install @vislab/react`.

## Proposed solution

Publish with `next` or `beta` dist-tag first:
- `@vislab/core`
- `@vislab/components`
- `@vislab/registry`
- `@vislab/react`
- `@vislab/web-components`
- `@vislab/cli`

## Acceptance criteria

- [ ] `npm install @vislab/react@beta` works in a fresh project
- [ ] README on each package has install + minimal usage
- [ ] IIFE bundles (`vislab.min.js`, `vislab-embed.min.js`) available via unpkg/jsdelivr or documented copy path

## Dependencies

- Changesets workflow
- Quickstart docs
- CI green
- Widget fidelity minimum bar
EOF
)"

create "feat(release): publish vislab-jekyll gem to RubyGems" \
  "enhancement,area:release,area:jekyll,priority:medium,phase:beta" \
 "$(cat <<'EOF'
## Problem

Jekyll theme exists locally but is not installable via `gem install vislab-jekyll`.

## Proposed solution

- Verify `vislab-jekyll.gemspec` metadata (version, deps, files)
- Add RubyGems publish step to release workflow
- Test embed in a minimal Jekyll site in CI or docs

## Acceptance criteria

- [ ] `gem install vislab-jekyll` works
- [ ] README in `packages/jekyll-theme` has full setup guide
- [ ] `vislab.html` and `vislab_iframe.html` documented with examples
EOF
)"

create "docs: add copy-paste quickstart for React, data-vislab, and Jekyll" \
  "documentation,area:docs,priority:critical,phase:pre-release" \
 "$(cat <<'EOF'
## Problem

README describes architecture but lacks a **5-minute quickstart** for external users. No one can adopt VisLab without reading the monorepo.

## Proposed solution

Add three minimal quickstarts to README (or linked `docs/quickstart/`):

1. **React / Astro MDX** — `npm i @vislab/react`, `<StorageComparison client:visible />`
2. **Static HTML** — `<div data-vislab="StorageComparison">` + `vislab-embed.min.js`
3. **Jekyll** — `{% include vislab.html component="StorageComparison" %}`

Each quickstart must be copy-paste runnable.

## Acceptance criteria

- [ ] Three paths documented with full file contents
- [ ] Tested in clean directories outside monorepo
- [ ] Links to built IIFE bundle locations
EOF
)"

# ─── Documentation ──────────────────────────────────────────────────────────

create "feat(docs): migrate apps/docs to Starlight with sidebar navigation" \
  "enhancement,area:docs,priority:high,phase:beta" \
 "$(cat <<'EOF'
## Problem

`apps/docs` is a single static HTML page listing registry entries. No navigation, search, or guides.

## Proposed solution

- Adopt [Astro Starlight](https://starlight.astro.build/) in `apps/docs`
- Sections: Getting Started, Components, API, CLI, Integrations, Theming
- Deploy to GitHub Pages or Vercel

## Acceptance criteria

- [ ] Sidebar nav with all sections
- [ ] Search works
- [ ] Deployed public URL linked from root README
EOF
)"

create "feat(docs): build live component gallery for all 17 registry widgets" \
  "enhancement,area:docs,area:components,priority:high,phase:beta" \
 "$(cat <<'EOF'
## Problem

demo-blog shows 7 of 17 widgets. Docs list names only — no live previews, no embed examples.

## Proposed solution

- One docs page per widget with live `VislabMount` preview
- Show: description, props table from registry, chrome variant, embed snippets (MDX / HTML / Jekyll)
- Copy-to-clipboard buttons for each snippet format

## Acceptance criteria

- [ ] 17 component pages with live embeds
- [ ] Props documented from registry `props` schema
- [ ] Category index pages (cpu, os, compiler, algorithms, storage)
EOF
)"

create "feat(docs): generate API reference from JSDoc for @vislab/core" \
  "documentation,area:docs,area:core,priority:medium,phase:beta" \
 "$(cat <<'EOF'
## Problem

No API docs for `Scene`, `SimClock`, `Scheduler`, `Entity`, or primitives. Widget authors must read source.

## Proposed solution

- Add JSDoc to public APIs in `@vislab/core`
- Generate docs via TypeDoc or Starlight typedoc plugin
- Publish under docs site `/api/core/`

## Acceptance criteria

- [ ] All exported core symbols documented
- [ ] Examples for Scene lifecycle and SimClock speed control
- [ ] Linked from CONTRIBUTING.md widget authoring section
EOF
)"

create "docs: write integration guides for Astro, Next.js, and plain HTML" \
  "documentation,area:docs,area:react,area:web-components,priority:high,phase:beta" \
 "$(cat <<'EOF'
## Problem

Authors use different frameworks. Only Astro demo-blog exists; no Next.js App Router guide, no SSR caveats.

## Proposed solution

Guides covering:
- Astro islands (`client:load` vs `client:visible`)
- Next.js dynamic import + `"use client"` wrapper
- Plain HTML + IIFE script tags
- SSR/hydration pitfalls (canvas only client-side)

## Acceptance criteria

- [ ] Three integration guides in docs site
- [ ] Working minimal examples in `examples/` folder or docs code blocks
- [ ] Common errors troubleshooting section
EOF
)"

# ─── Registry / Platform ────────────────────────────────────────────────────

create "feat(registry): define props schema for all 17 widgets" \
  "enhancement,area:registry,area:components,priority:high,phase:beta" \
 "$(cat <<'EOF'
## Problem

Only `CpuPipeline` has registry `props`. Studio cannot auto-generate property forms. Docs cannot show prop tables.

## Proposed solution

- Extend `VislabComponentProp` types if needed (number, boolean, enum, string[])
- Add `props` array to every registry entry with sensible defaults
- Wire prop parsing in each widget constructor

## Acceptance criteria

- [ ] All 17 entries have `props` documented in registry
- [ ] Widgets respect passed props
- [ ] Breaking prop renames documented in CHANGELOG
EOF
)"

create "feat(studio): registry-driven property editor panel" \
  "enhancement,area:studio,area:registry,priority:high,phase:beta" \
 "$(cat <<'EOF'
## Problem

Studio property panel only edits CpuPipeline `stages` via hardcoded UI. Adding props requires code changes.

## Proposed solution

- Read `entry.props` from registry
- Render inputs by type: text, number, boolean toggle, enum select, comma-separated array
- Live-update preview on change
- Show custom element tag + all export formats

## Acceptance criteria

- [ ] Property form auto-generated for any registry entry with props
- [ ] Preview updates without page reload
- [ ] Copy MDX reflects current prop values

## Dependencies

- Registry props schema for all widgets
EOF
)"

create "feat(studio): add embed preview tabs (React / HTML / Jekyll / iframe)" \
  "enhancement,area:studio,priority:medium,phase:beta" \
 "$(cat <<'EOF'
## Problem

Studio only copies MDX. Authors on Jekyll or static HTML must manually construct embeds.

## Proposed solution

- Tabbed export panel: MDX, React JSX, `data-vislab` HTML, Jekyll liquid, iframe URL
- Preview iframe tab using `vislab widget` output pattern
- URL share state: `?component=CpuPipeline&stages=IF,ID,EX`

## Acceptance criteria

- [ ] Four+ export formats with copy buttons
- [ ] Shareable URL restores component + props
- [ ] iframe preview renders correctly
EOF
)"

# ─── Widget Fidelity (flagship) ─────────────────────────────────────────────

create "feat(components): bring CpuPipeline to flagship fidelity" \
  "enhancement,area:components,priority:high,phase:beta" \
 "$(cat <<'EOF'
## Problem

CpuPipeline is a static stage diagram (~80 lines). No instruction flow, hazards, stalls, or controls.

## Proposed solution

- Animated instruction bubbles moving through IF/ID/EX/MEM/WB
- Hazard detection (data hazard stalls, bubble insertion)
- Play/pause/step controls via SimClock
- Optional forwarding arrows
- Configurable stages via registry props (already partial)

## Acceptance criteria

- [ ] Instructions animate through pipeline at SimClock rate
- [ ] At least one hazard scenario demonstrated
- [ ] Play/pause controls in toolbar chrome
- [ ] demo-blog and docs gallery showcase it
EOF
)"

create "feat(components): bring CacheSimulator to flagship fidelity" \
  "enhancement,area:components,priority:high,phase:beta" \
 "$(cat <<'EOF'
## Problem

CacheSimulator lacks L1/L2/L3 hierarchy visualization, hit/miss animation, and replacement policy controls.

## Proposed solution

- Multi-level cache blocks with address tag visualization
- Animated hit (green) / miss (red) / eviction events
- LRU vs FIFO toggle
- Address stream input or preset patterns
- Stats panel: hit rate, miss rate

## Acceptance criteria

- [ ] Three cache levels visible and interactive
- [ ] Replacement policy affects eviction behavior
- [ ] Hit rate displayed and updates live
EOF
)"

create "feat(components): bring ProcessScheduler to flagship fidelity" \
  "enhancement,area:components,priority:high,phase:beta" \
 "$(cat <<'EOF'
## Problem

ProcessScheduler needs CFS-style Gantt chart, context switch animation, and priority queue visualization.

## Proposed solution

- Gantt timeline with process bars
- Context switch markers and CPU utilization meter
- Priority / round-robin mode toggle
- Add/remove processes interactively

## Acceptance criteria

- [ ] Gantt chart animates scheduling decisions
- [ ] Context switches visually marked
- [ ] At least two scheduling algorithms selectable
EOF
)"

create "feat(components): bring VirtualMemory and TLBWalk to flagship fidelity" \
  "enhancement,area:components,priority:medium,phase:beta" \
 "$(cat <<'EOF'
## Problem

VirtualMemory and TLBWalk are schematic. No page table walk, TLB hit/miss, or demand paging demo.

## Proposed solution

- Page table → TLB → physical frame mapping animation
- TLB hit vs page walk (slow path) timing difference
- Page fault and swap-in sequence
- Tie TLBWalk and VirtualMemory narratives together

## Acceptance criteria

- [ ] Page walk animated step-by-step
- [ ] TLB hit/miss visually distinct with latency indication
- [ ] Controls to trigger page fault scenario
EOF
)"

create "feat(components): bring SortRace to flagship fidelity" \
  "enhancement,area:components,priority:medium,phase:beta" \
 "$(cat <<'EOF'
## Problem

SortRace should compare bubble, quick, merge, and heap sorts racing in parallel with real relative speeds.

## Proposed solution

- Four lanes racing on same input array
- SimClock-synced step counts reflecting algorithm complexity
- Algorithm selector and array size control
- Winner announcement with comparison/swap stats

## Acceptance criteria

- [ ] At least 3 algorithms race simultaneously
- [ ] Speed reflects actual step counts (merge faster than bubble)
- [ ] User can reset and change input size
EOF
)"

create "feat(components): depth pass on remaining 10 widgets" \
  "enhancement,area:components,priority:medium,phase:1.0" \
 "$(cat <<'EOF'
## Problem

After flagship widgets, these remain thin schematics:
BranchPredictor, SyscallTrace, InodeTree, Lexer, Parser, CFGBuilder, RegisterAllocator, BTreeOps, GraphTraversal, HashCollision

## Proposed solution

Per-widget minimum bar:
- Interactive play/pause or step
- At least one configurable prop via registry
- Meaningful simulation tied to real CS concepts
- Shared articleChrome variant assigned consistently

## Acceptance criteria

- [ ] Each of 10 widgets meets minimum bar
- [ ] demo-blog or docs exposes all 10
- [ ] Each has e2e smoke test
EOF
)"

create "feat(components): unify StorageComparison on shared articleChrome" \
  "enhancement,area:components,priority:low,phase:beta" \
 "$(cat <<'EOF'
## Problem

StorageComparison uses hand-rolled header/layout while other widgets use `createArticleChrome`. Visual inconsistency and duplicated layout code.

## Proposed solution

- Refactor StorageComparison to use `createArticleChrome({ variant: "article" })`
- Preserve all existing controls (speed slider, Time IO, queue viz)
- Ensure no visual regression in latency race animation

## Acceptance criteria

- [ ] Uses shared chrome helper
- [ ] All controls still work
- [ ] Visual parity with current flagship (or improvement documented)
EOF
)"

# ─── CLI / Exporter ─────────────────────────────────────────────────────────

create "feat(cli): improve vislab new to scaffold complete starter projects" \
  "enhancement,area:cli,priority:high,phase:beta" \
 "$(cat <<'EOF'
## Problem

`vislab new` emits a minimal Jekyll snippet only. No full Astro/MDX project scaffold.

## Proposed solution

- `vislab new my-blog --template astro` scaffolds Astro + @vislab/react + sample page
- `vislab new my-site --template jekyll` scaffolds Gemfile + layout + sample post
- `vislab new my-page --template html` scaffolds standalone index.html

## Acceptance criteria

- [ ] Three templates available
- [ ] Scaffolded project builds and shows StorageComparison
- [ ] Documented in CLI `--help` and docs site
EOF
)"

create "feat(exporter): add vislab export command for GIF output" \
  "enhancement,area:exporter,area:cli,priority:medium,phase:1.0" \
 "$(cat <<'EOF'
## Problem

`@vislab/exporter` captures PNG frames only. No end-to-end GIF for social/slides.

## Proposed solution

- `vislab export -c StorageComparison -f gif -o race.gif --duration 10s`
- Pipeline: `vislab widget` → Puppeteer frames → gifski or ffmpeg palettegen
- Document system dependencies (ffmpeg, gifski)

## Acceptance criteria

- [ ] GIF command produces usable animation
- [ ] Configurable fps, duration, resolution
- [ ] README in tools/exporter with examples
EOF
)"

create "feat(exporter): add MP4 export via ffmpeg" \
  "enhancement,area:exporter,area:cli,priority:medium,phase:1.0" \
 "$(cat <<'EOF'
## Problem

No MP4 export for presentations or YouTube embeds.

## Proposed solution

- `vislab export -c CpuPipeline -f mp4 -o pipeline.mp4`
- ffmpeg H.264 from captured frame sequence
- Optional title card via Remotion (stretch goal)

## Acceptance criteria

- [ ] MP4 plays in standard players
- [ ] Reasonable file size at 800×600 default
- [ ] Skipped in CI (too heavy); unit test frame count logic only
EOF
)"

# ─── Quality / Ecosystem ────────────────────────────────────────────────────

create "feat(demo-blog): showcase all 17 registry widgets with chrome variants" \
  "enhancement,area:components,area:docs,priority:high,phase:beta" \
 "$(cat <<'EOF'
## Problem

demo-blog shows 7 widgets. Remaining 10 are invisible to anyone evaluating the project.

## Proposed solution

- Expand index.astro grid to all 17 widgets
- Assign chrome variants per category (as current lead paragraph describes)
- Paginate or categorize if page too long

## Acceptance criteria

- [ ] All 17 widgets render on demo-blog
- [ ] No console errors
- [ ] Playwright smoke extended to spot-check 3+ categories
EOF
)"

create "feat(a11y): add keyboard controls and ARIA labels to widget chrome" \
  "enhancement,area:components,priority:medium,phase:1.0" \
 "$(cat <<'EOF'
## Problem

Chrome buttons (play, pause, speed) lack ARIA labels and keyboard navigation.

## Proposed solution

- `vislabButtons` helpers emit accessible button elements
- Tab order through controls
- `aria-label` on canvas regions describing widget purpose
- Document a11y limitations of canvas content

## Acceptance criteria

- [ ] All chrome buttons keyboard operable
- [ ] Screen reader announces widget title and primary action
- [ ] a11y section in docs
EOF
)"

create "feat(core): add bundle size budget check in CI" \
  "enhancement,area:core,area:ci,priority:medium,phase:beta" \
 "$(cat <<'EOF'
## Problem

IIFE bundles (`vislab.min.js` ~60KB, `vislab-embed.min.js` ~69KB) have no size guard. Growth hurts blog embed performance.

## Proposed solution

- Add `size-limit` or custom script post-build
- Budget: e.g. components IIFE < 80KB gzip, embeds IIFE < 90KB gzip
- Fail CI on regression; allow intentional bump with changelog note

## Acceptance criteria

- [ ] CI reports bundle sizes on PR
- [ ] Fails when over budget
- [ ] Sizes documented in README
EOF
)"

create "feat(registry): public third-party widget registration API" \
  "enhancement,area:registry,priority:low,phase:1.0" \
 "$(cat <<'EOF'
## Problem

External authors cannot add custom widgets without forking the monorepo.

## Proposed solution

- `registerVislabWidget(entry: VislabComponentEntry)` runtime API
- Document widget contract: `(container) => { destroy() }`
- Optional: community registry repo pattern

## Acceptance criteria

- [ ] Runtime registration works with React and data-vislab
- [ ] Documented in CONTRIBUTING.md and docs
- [ ] Example third-party widget in examples/
EOF
)"

create "chore: archive or rewrite stale TODOS.md to match registry architecture" \
  "documentation,priority:medium,phase:pre-release" \
 "$(cat <<'EOF'
## Problem

`TODOS.md` lists week-by-week tasks from April 2026, all unchecked, referencing deleted files (`viz-cpu-pipeline.ts`, per-component React wrappers). Misleading for contributors.

## Proposed solution

- Replace with phased roadmap linked to GitHub issues/milestones
- Or delete TODOS.md and point to GitHub Projects + CONTRIBUTING.md

## Acceptance criteria

- [ ] No references to removed architecture
- [ ] Links to open GitHub issues by phase
- [ ] Reflects current registry-first design
EOF
)"

create "feat(examples): create vislab-examples repo with Astro, Jekyll, and HTML sites" \
  "enhancement,area:docs,priority:low,phase:1.0" \
 "$(cat <<'EOF'
## Problem

No standalone example repos users can clone. Monorepo is intimidating for blog authors.

## Proposed solution

Separate repo (or `examples/` in monorepo) with:
- `astro-mdx-blog/` — minimal Astro + @vislab/react
- `jekyll-post/` — single post with vislab-jekyll
- `static-embed/` — one HTML file + CDN scripts

## Acceptance criteria

- [ ] Each example runs with README steps only
- [ ] Linked from main README and docs
- [ ] Uses published npm packages (when available)
EOF
)"

echo "Done creating roadmap issues."