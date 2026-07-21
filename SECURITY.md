# Security Policy

## Supported versions

VisLab is pre-1.0 (`0.x`). Security fixes land on `main` only.

| Version | Supported |
| ------- | --------- |
| 0.x (main) | Yes |
| Unreleased monorepo clones | Best effort |

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Email the maintainer via the GitHub profile contact on
[mohitmishra786/vislab](https://github.com/mohitmishra786/vislab), or use
[GitHub Security Advisories](https://github.com/mohitmishra786/vislab/security/advisories/new)
if enabled for this repository.

Please include:

- Affected package(s) (`@vislab/core`, embed script, CLI, exporter, apps)
- Description and impact
- Reproduction steps or a proof of concept
- Whether a fix is already known

We aim to acknowledge reports within **7 days** and to provide a remediation plan or patch timeline for confirmed issues.

## Dependency triage cadence

| Cadence | Action |
| ------- | ------ |
| Daily | GitHub Dependabot security alerts (workflow + Advisory DB) |
| Weekly | Dependabot version-update PRs (grouped; majors ignored) |
| On each PR | `pnpm audit --prod --audit-level=high` (CI security-audit job) |
| On each PR | CodeQL + dependency-review workflows |

Maintainers should not merge Dependabot PRs that leave CI red. Prefer
`pnpm audit` and Dependabot security groups over broad major upgrades
without a local green build.

## Scope notes

- **Embeds** (`@vislab/react`, `@vislab/web-components`, IIFE bundles) run
  in the host page origin. Treat untrusted `data-props` JSON as untrusted
  input (parsed safely; never `eval`).
- **`@vislab/exporter`** uses Puppeteer/Chromium and is **optional**.
  Do not install it for production blog embeds. Keep Chromium off the
  default consumer install path.
- **No hosted multi-tenant service** ships in this monorepo by default.
  If you deploy Studio/docs, configure your own CSP, HTTPS, and analytics.

## Hardening checklist (operators)

- [ ] Serve embed scripts over HTTPS with integrity hashes when possible
- [ ] Do not pass untrusted user content into widget prop JSON without validation
- [ ] Keep Node ≥ 22.12 for builds; refresh lockfile after security overrides
- [ ] Review `pnpm.overrides` in root `package.json` when bumping tooling
