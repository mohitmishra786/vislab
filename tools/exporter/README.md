# @vislab/exporter

Headless frame capture for VisLab widgets using [Puppeteer](https://pptr.dev).

## Build

```bash
pnpm --filter @vislab/exporter build
```

## Workflow

1. Generate a standalone page: `pnpm --filter @vislab/cli exec vislab widget -c StorageComparison -o /tmp/viz`
2. Capture frames:

```bash
pnpm --filter @vislab/exporter exec node dist/cli.js \
  --url file:///tmp/viz/storagecomparison/index.html \
  --out ./frames \
  --frames 48
```

3. Optionally encode with [gifski](https://gif.ski): `gifski -o demo.gif frames/frame-*.png`

## Requirements

- Node 18+
- Chromium (downloaded by Puppeteer on first run)
