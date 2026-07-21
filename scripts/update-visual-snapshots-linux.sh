#!/usr/bin/env bash
# Generate full-widget visual baselines for Linux (CI host).
# Requires Docker. Run from monorepo root:
#   bash scripts/update-visual-snapshots-linux.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMAGE="${PLAYWRIGHT_IMAGE:-mcr.microsoft.com/playwright:v1.61.1-jammy}"

# Use an anonymous volume for node_modules so Linux optional deps do not
# clobber the host machine's install after the container exits.
docker run --rm \
  -v "$ROOT:/work" \
  -v /work/node_modules \
  -w /work \
  -e CI=true \
  -e VISUAL_MAX_DIFF=0.10 \
  "$IMAGE" \
  bash -lc '
    set -euo pipefail
    corepack enable
    corepack prepare pnpm@10.33.0 --activate
    pnpm install --frozen-lockfile
    pnpm run build
    pnpm --filter demo-blog exec playwright test e2e/visual.spec.ts --project=chromium --update-snapshots
  '

echo "Linux snapshots written under apps/demo-blog/e2e/visual.spec.ts-snapshots/*-linux.png"
