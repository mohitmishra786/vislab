#!/usr/bin/env node
/**
 * Capture a short README demo GIF (and optional WebM) of StorageComparison.
 * Requires: demo-blog build, Playwright chromium, ffmpeg on PATH.
 *
 * Usage (from monorepo root):
 *   pnpm --filter demo-blog run build
 *   node scripts/capture-readme-gif.mjs
 *
 * Outputs:
 *   docs/media/storage-comparison.gif
 *   docs/media/storage-comparison.webm (if encode succeeds)
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "apps/demo-blog/package.json"));
const { chromium } = require("@playwright/test");

const mediaDir = join(root, "docs/media");
mkdirSync(mediaDir, { recursive: true });

const PORT = 4401;
const base = `http://127.0.0.1:${PORT}`;
const frameDir = join(tmpdir(), `vislab-gif-frames-${process.pid}`);
mkdirSync(frameDir, { recursive: true });

function hasFfmpeg() {
  const r = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
  return r.status === 0;
}

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

if (!hasFfmpeg()) {
  console.error("ffmpeg not found on PATH — required to encode GIF/WebM");
  process.exit(1);
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
    viewport: { width: 800, height: 480 },
    deviceScaleFactor: 1,
  });

  await page.goto(`${base}/visual/storage-comparison`, {
    waitUntil: "networkidle",
  });
  const widget = page.locator(`[data-vislab-widget="storage-comparison"]`);
  await widget.waitFor({ state: "visible", timeout: 20_000 });
  await page.waitForTimeout(400);

  // Start the latency race so the GIF shows motion
  const trigger = page.getByRole("button", { name: /Trigger I\/O/i });
  if (await trigger.isVisible().catch(() => false)) {
    await trigger.click();
  }

  const fps = 10;
  const durationSec = 4;
  const total = fps * durationSec;
  for (let i = 0; i < total; i++) {
    const name = `frame-${String(i).padStart(4, "0")}.png`;
    await widget.screenshot({ path: join(frameDir, name) });
    await page.waitForTimeout(1000 / fps);
  }

  await browser.close();

  const gifOut = join(mediaDir, "storage-comparison.gif");
  const webmOut = join(mediaDir, "storage-comparison.webm");
  const pattern = join(frameDir, "frame-%04d.png");

  // Palette-optimized GIF for reasonable size
  const palette = join(frameDir, "palette.png");
  const p1 = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-framerate",
      String(fps),
      "-i",
      pattern,
      "-vf",
      "fps=10,scale=720:-1:flags=lanczos,palettegen=stats_mode=diff",
      palette,
    ],
    { encoding: "utf8" },
  );
  if (p1.status !== 0) {
    console.error(p1.stderr);
    throw new Error("palettegen failed");
  }

  const p2 = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-framerate",
      String(fps),
      "-i",
      pattern,
      "-i",
      palette,
      "-lavfi",
      "fps=10,scale=720:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5",
      "-loop",
      "0",
      gifOut,
    ],
    { encoding: "utf8" },
  );
  if (p2.status !== 0) {
    console.error(p2.stderr);
    throw new Error("gif encode failed");
  }
  console.log("wrote", gifOut);

  const p3 = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-framerate",
      String(fps),
      "-i",
      pattern,
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      "0",
      "-crf",
      "32",
      "-an",
      webmOut,
    ],
    { encoding: "utf8" },
  );
  if (p3.status === 0) {
    console.log("wrote", webmOut);
  } else {
    console.warn("webm encode skipped/failed (GIF still ok)");
  }

  // Marker for docs tooling
  writeFileSync(
    join(mediaDir, ".gif-meta.json"),
    JSON.stringify(
      {
        source: "scripts/capture-readme-gif.mjs",
        widget: "StorageComparison",
        fps,
        durationSec,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  preview.kill("SIGTERM");
  try {
    rmSync(frameDir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

if (!existsSync(join(mediaDir, "storage-comparison.gif"))) {
  process.exit(1);
}
