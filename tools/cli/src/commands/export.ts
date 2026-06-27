import { mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { spawn } from "node:child_process";
import chalk from "chalk";
import { widgetCmd } from "./widget";
import { resolveRepoRoot } from "../util/repoRoot";

function run(cmd: string, args: string[]): Promise<void> {
  return new Promise((res, rej) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("close", (code) =>
      code === 0 ? res() : rej(new Error(`${cmd} exited ${code}`)),
    );
  });
}

export async function exportCmd(opts: {
  component: string;
  format: string;
  out: string;
  frames?: string;
  fps?: string;
}) {
  const root = resolveRepoRoot();
  const tmpDir = resolve(process.cwd(), ".vislab-export-tmp");
  const component = opts.component;

  console.log(chalk.cyan(`Building widget HTML for ${component}…`));
  await widgetCmd({
    component,
    out: tmpDir,
    props: "{}",
    skipCopy: false,
  });

  const htmlUrl = `file://${join(tmpDir, "index.html")}`;
  const framesDir = join(tmpDir, "frames");
  await mkdir(framesDir, { recursive: true });

  const exporterCli = join(root, "tools/exporter/dist/cli.js");
  const frames = opts.frames ?? "48";
  await run("node", [
    exporterCli,
    "--url",
    htmlUrl,
    "--out",
    framesDir,
    "--frames",
    frames,
  ]);

  const format = opts.format.toLowerCase();
  const outPath = resolve(process.cwd(), opts.out);

  if (format === "gif" || format === "mp4") {
    const fps = opts.fps ?? "12";
    const pattern = join(framesDir, "frame-%04d.png");
    if (format === "gif") {
      await run("ffmpeg", [
        "-y",
        "-framerate",
        fps,
        "-i",
        pattern,
        "-vf",
        "palettegen=stats_mode=diff",
        join(framesDir, "palette.png"),
      ]).catch(() => {
        console.warn(
          chalk.yellow(
            "ffmpeg palettegen failed — install ffmpeg or use PNG frames only",
          ),
        );
      });
      await run("ffmpeg", [
        "-y",
        "-framerate",
        fps,
        "-i",
        pattern,
        "-i",
        join(framesDir, "palette.png"),
        "-lavfi",
        "paletteuse",
        outPath,
      ]).catch(() => {
        throw new Error("GIF export requires ffmpeg on PATH");
      });
    } else {
      await run("ffmpeg", [
        "-y",
        "-framerate",
        fps,
        "-i",
        pattern,
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        outPath,
      ]).catch(() => {
        throw new Error("MP4 export requires ffmpeg on PATH");
      });
    }
    console.log(chalk.green(`✓ Wrote ${outPath}`));
    return;
  }

  await writeFile(
    outPath,
    JSON.stringify({ framesDir, htmlUrl, component }, null, 2),
    "utf8",
  );
  console.log(chalk.green(`✓ Frame manifest: ${outPath}`));
}