#!/usr/bin/env node
import { Command } from "commander";
import { buildCmd } from "./commands/build";
import { newCmd } from "./commands/new";
import { previewCmd } from "./commands/preview";
import { widgetCmd } from "./commands/widget";
import { exportCmd } from "./commands/export";

const program = new Command();

program
  .name("vislab")
  .description(
    "CLI to generate, preview, and build VisLab visualization projects",
  )
  .version("0.2.0");

program
  .command("new")
  .argument("<project-name>", "directory name for sample content")
  .description("Scaffold a starter project (jekyll, html, or astro)")
  .option(
    "-t, --template <name>",
    "jekyll | html | astro",
    "jekyll",
  )
  .action(newCmd);

program
  .command("preview")
  .description("Run the Astro demo-blog dev server")
  .option("-t, --target <name>", "pnpm workspace package name", "demo-blog")
  .action(previewCmd);

program
  .command("build")
  .description("Build IIFE bundles into ./dist/vislab (or --output)")
  .option("-o, --output <dir>", "output directory", "dist/vislab")
  .action(buildCmd);

program
  .command("widget")
  .description(
    "Emit a standalone index.html + vislab-embed.min.js for iframe embeds",
  )
  .requiredOption("-c, --component <name>", "PascalCase name, e.g. CpuPipeline")
  .option(
    "-o, --out <dir>",
    "output directory (default: public/vizlab/<component>/)",
  )
  .option("-p, --props <json>", "JSON props for data-props", "{}")
  .option("--skip-copy", "do not copy vislab-embed.min.js (reuse existing)")
  .action(widgetCmd);

program
  .command("export")
  .description("Capture widget animation as GIF or MP4 (requires ffmpeg)")
  .requiredOption("-c, --component <name>", "PascalCase widget name")
  .requiredOption("-f, --format <type>", "gif | mp4 | frames")
  .requiredOption("-o, --out <path>", "output file path")
  .option("--frames <n>", "PNG frames to capture", "48")
  .option("--fps <n>", "output framerate", "12")
  .action(exportCmd);

program.parse(process.argv);
