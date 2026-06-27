#!/usr/bin/env node
/**
 * Capture PNG frames from a standalone VisLab HTML widget (for GIF/MP4 pipelines).
 *
 * Usage:
 *   node dist/cli.js --url file:///path/to/index.html --out ./frames --frames 30
 */

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Command } from "commander";
import puppeteer from "puppeteer";

const program = new Command();

program
  .name("vislab-export")
  .description("Capture PNG frames from a VisLab widget page")
  .requiredOption("--url <url>", "file:// or http(s) URL to the widget page")
  .option("--out <dir>", "output directory for PNG frames", "./vislab-frames")
  .option("--frames <n>", "number of frames", "24")
  .option("--width <px>", "viewport width", "800")
  .option("--height <px>", "viewport height", "600");

async function main() {
  program.parse();
  const opts = program.opts();
  const frames = Math.max(1, Number.parseInt(String(opts.frames), 10) || 24);
  const outDir = resolve(process.cwd(), opts.out);
  await mkdir(outDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({
    width: Number.parseInt(String(opts.width), 10) || 800,
    height: Number.parseInt(String(opts.height), 10) || 600,
    deviceScaleFactor: 1,
  });

  await page.goto(opts.url, { waitUntil: "networkidle0", timeout: 60_000 });

  for (let i = 0; i < frames; i++) {
    const buf = await page.screenshot({ type: "png" });
    await writeFile(
      resolve(outDir, `frame-${String(i).padStart(4, "0")}.png`),
      buf,
    );
    await page.evaluate(
      () =>
        new Promise<void>((r) => {
          requestAnimationFrame(() => r());
        }),
    );
  }

  await browser.close();
  console.log(`Wrote ${frames} PNGs to ${outDir}`);
  console.log("Encode GIF (optional): gifski -o out.gif frame-*.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
