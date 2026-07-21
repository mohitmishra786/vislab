#!/usr/bin/env node
import { spawn } from "node:child_process";
/**
 * Capture README/demo stills via Playwright (no video).
 * Requires: pnpm --filter demo-blog build && playwright install chromium.
 *
 * Outputs under docs/media/
 */
import { existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "apps/demo-blog/package.json"));
const { chromium } = require("@playwright/test");

const mediaDir = join(root, "docs/media");
mkdirSync(mediaDir, { recursive: true });

const PORT = 4399;
const base = `http://127.0.0.1:${PORT}`;

async function waitForServer(url, ms = 90_000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error("preview server did not start");
}

const preview = spawn(
  "pnpm",
  ["exec", "astro", "preview", "--host", "127.0.0.1", "--port", String(PORT)],
  {
    cwd: join(root, "apps/demo-blog"),
    stdio: "pipe",
    env: { ...process.env },
  },
);

try {
  await waitForServer(base);
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 960, height: 540 },
    deviceScaleFactor: 2,
  });

  const shots = [
    { id: "storage-comparison", file: "storage-comparison.png" },
    { id: "cpu-pipeline", file: "cpu-pipeline.png" },
  ];

  for (const s of shots) {
    await page.goto(`${base}/visual/${s.id}`, { waitUntil: "networkidle" });
    const widget = page.locator(`[data-vislab-widget="${s.id}"]`);
    await widget.waitFor({ state: "visible", timeout: 20_000 });
    await page.waitForTimeout(600);
    await widget.screenshot({ path: join(mediaDir, s.file) });
    console.log("wrote", s.file);
  }

  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto(`${base}/visual/storage-comparison`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(700);
  await page.screenshot({
    path: join(mediaDir, "og-preview.png"),
    fullPage: false,
  });
  console.log("wrote og-preview.png");

  await browser.close();
} finally {
  preview.kill("SIGTERM");
}

if (!existsSync(join(mediaDir, "og-preview.png"))) {
  process.exit(1);
}
