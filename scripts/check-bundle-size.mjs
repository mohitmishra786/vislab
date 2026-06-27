#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
/**
 * Post-build bundle size budget check (#31)
 */
import { gzipSync } from "node:zlib";

const ROOT = resolve(import.meta.dirname, "..");

const BUDGETS = [
  {
    path: "packages/components/dist/index.global.js",
    label: "VisLab IIFE",
    maxGzipKb: 85,
  },
  {
    path: "packages/web-components/dist/index.global.js",
    label: "VisLabEmbeds IIFE",
    maxGzipKb: 95,
  },
];

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

process.exit(failed ? 1 : 0);
