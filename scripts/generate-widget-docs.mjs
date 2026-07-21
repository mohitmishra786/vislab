#!/usr/bin/env node
/**
 * Generate / refresh component MDX pages from @vislab/registry.
 * Flagship pages keep hand-authored pedagogy; this fills beta stubs.
 *
 * Usage (from repo root, after packages built):
 *   node scripts/generate-widget-docs.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

// Load built registry (CJS)
const regPath = join(root, "packages/registry/dist/index.js");
if (!existsSync(regPath)) {
  console.error(
    "Build @vislab/registry first: pnpm --filter @vislab/registry build",
  );
  process.exit(1);
}

const { vislabRegistry } = require(regPath);
const outDir = join(root, "apps/docs/src/content/docs/components");
mkdirSync(outDir, { recursive: true });

const FLAGSHIP = new Set([
  "storage-comparison",
  "cpu-pipeline",
  "cache-simulator",
  "process-scheduler",
  "sort-race",
]);

function propsTable(props = []) {
  if (!props.length) return "_No props._\n";
  const rows = props
    .map(
      (p) =>
        `| \`${p.name}\` | \`${p.type}\` | ${p.optional ? "yes" : "no"} | ${p.description ?? "—"} |`,
    )
    .join("\n");
  return `| Prop | Type | Optional | Description |\n| ---- | ---- | -------- | ----------- |\n${rows}\n`;
}

function page(entry) {
  const maturity = entry.maturity === "flagship" ? "flagship" : "beta";
  const desc =
    entry.description ?? `${entry.displayName} systems visualization widget.`;
  return `---
title: ${entry.displayName}
description: ${desc.replace(/"/g, "'")}
---

import { ${entry.globalName} } from "@vislab/react";

${desc}

**Maturity:** \`${maturity}\`${maturity === "beta" ? " — works end-to-end; pedagogy docs thinner than flagships." : " — full example below."}

## Live demo

<figure>
  <${entry.globalName} client:visible />
  <figcaption>${entry.displayName} interactive simulation.</figcaption>
</figure>

## Props

${propsTable(entry.props)}

## Snippets

### MDX / Astro

\`\`\`astro
---
import { ${entry.globalName} } from "@vislab/react";
---
<figure>
  <${entry.globalName} client:visible />
  <figcaption>${entry.displayName}</figcaption>
</figure>
\`\`\`

### HTML

\`\`\`html
<div data-vislab="${entry.globalName}" style="min-height:320px;width:100%"></div>
\`\`\`

### Jekyll

\`\`\`liquid
{% include vislab.html id="${entry.id}" component="${entry.globalName}" %}
\`\`\`

## Accessibility & SEO

Canvas is visual-only. Use a figcaption and surrounding prose. Controls include SimClock (pause / 0.1× / 1× / 10×) and a **Static** SVG export for a text+snapshot twin.

## Registry

- **id:** \`${entry.id}\`
- **globalName:** \`${entry.globalName}\`
- **category:** \`${entry.category}\`
- **custom element:** \`<${entry.customElementTag}>\`
`;
}

let written = 0;
let skipped = 0;
for (const entry of vislabRegistry) {
  const file = join(outDir, `${entry.id}.mdx`);
  // Preserve hand-authored flagship content if already substantial
  if (FLAGSHIP.has(entry.id) && existsSync(file)) {
    const existing = readFileSync(file, "utf8");
    if (existing.length > 800 && existing.includes("## Pedagogy")) {
      skipped++;
      continue;
    }
  }
  writeFileSync(file, page(entry));
  written++;
  console.log("wrote", entry.id);
}
console.log(`Done: wrote ${written}, preserved flagship ${skipped}`);
