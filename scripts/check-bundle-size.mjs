#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
/**
 * Post-build bundle size budget check (#31, #51)
 */
import { gzipSync } from "node:zlib";

const ROOT = resolve(import.meta.dirname, "..");

const BUDGETS = [
  {
    path: "packages/components/dist/index.global.js",
    label: "VisLab IIFE (full catalog)",
    maxGzipKb: 95,
  },
  {
    path: "packages/web-components/dist/index.global.js",
    label: "VisLabEmbeds IIFE",
    maxGzipKb: 110,
  },
];

/**
 * Per-widget ESM graph budget (entry + transitive local chunks).
 * Core stays external, so this is widget + shared chrome only.
 */
const WIDGET_GRAPH_MAX_GZIP_KB = 36;

let failed = false;

for (const { path, label, maxGzipKb } of BUDGETS) {
  const full = resolve(ROOT, path);
  if (!existsSync(full)) {
    console.error(`Missing bundle: ${path} (run pnpm run build first)`);
    failed = true;
    continue;
  }
  const raw = readFileSync(full);
  const gzipKb = gzipSync(raw).length / 1024;
  const rawKb = raw.length / 1024;
  const ok = gzipKb <= maxGzipKb;
  console.log(
    `${ok ? "✓" : "✗"} ${label}: ${gzipKb.toFixed(1)} KB gzip (${rawKb.toFixed(1)} KB raw) — budget ${maxGzipKb} KB gzip`,
  );
  if (!ok) failed = true;
}

/**
 * Resolve local relative imports/exports from an ESM file and sum gzip size.
 * Stops at package boundaries (no node_modules / @vislab/core).
 */
function collectLocalGraph(entryPath, seen = new Set()) {
  const abs = resolve(entryPath);
  if (seen.has(abs) || !existsSync(abs)) return seen;
  seen.add(abs);
  const src = readFileSync(abs, "utf8");
  const re =
    /(?:from|import)\s*['"](\.\.?\/[^'"]+)['"]|export\s+[^'"]*from\s*['"](\.\.?\/[^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src))) {
    const rel = m[1] || m[2];
    if (!rel) continue;
    let next = resolve(dirname(abs), rel);
    if (!existsSync(next) && existsSync(`${next}.mjs`)) next = `${next}.mjs`;
    if (!existsSync(next) && existsSync(`${next}.js`)) next = `${next}.js`;
    if (
      existsSync(next) &&
      next.includes(`${join("packages", "components", "dist")}`)
    ) {
      collectLocalGraph(next, seen);
    }
  }
  return seen;
}

const widgetsDir = resolve(ROOT, "packages/components/dist/widgets");
if (existsSync(widgetsDir)) {
  const files = readdirSync(widgetsDir).filter((f) => f.endsWith(".mjs"));
  let worst = { name: "", kb: 0 };
  for (const f of files) {
    const entry = join(widgetsDir, f);
    const graph = collectLocalGraph(entry);
    let rawTotal = 0;
    for (const p of graph) rawTotal += readFileSync(p).length;
    const gzipKb =
      gzipSync(Buffer.concat([...graph].map((p) => readFileSync(p)))).length /
      1024;
    if (gzipKb > worst.kb) worst = { name: f, kb: gzipKb };
    if (gzipKb > WIDGET_GRAPH_MAX_GZIP_KB) {
      console.error(
        `✗ Widget graph ${f}: ${gzipKb.toFixed(1)} KB gzip (${graph.size} files) > ${WIDGET_GRAPH_MAX_GZIP_KB} KB`,
      );
      failed = true;
    }
  }
  console.log(
    `✓ Widget ESM graphs: ${files.length} entries; largest ${worst.name} ${worst.kb.toFixed(1)} KB gzip (budget ${WIDGET_GRAPH_MAX_GZIP_KB} KB)`,
  );
} else {
  console.error(
    "✗ No packages/components/dist/widgets — per-widget split build missing",
  );
  failed = true;
}

process.exit(failed ? 1 : 0);
