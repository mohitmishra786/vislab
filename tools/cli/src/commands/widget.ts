import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getVislabEntryByGlobalName } from "@vislab/registry";
import chalk from "chalk";
import { resolveRepoRoot } from "../util/repoRoot";

export async function widgetCmd(opts: {
  component: string;
  out?: string;
  props?: string;
  skipCopy?: boolean;
}) {
  const entry = getVislabEntryByGlobalName(opts.component);
  if (!entry) {
    console.error(chalk.red(`Unknown component: ${opts.component}`));
    process.exit(1);
  }

  const root = resolveRepoRoot();
  const outDir = join(
    process.cwd(),
    opts.out ?? "public/vizlab",
    opts.component.toLowerCase(),
  );
  await mkdir(outDir, { recursive: true });

  const embedSrc = join(root, "packages/web-components/dist/index.global.js");
  if (!opts.skipCopy) {
    await copyFile(embedSrc, join(outDir, "vislab-embed.min.js"));
  }

  let propsAttr = "";
  if (opts.props && opts.props !== "{}") {
    propsAttr = ` data-props='${opts.props.replace(/'/g, "&#39;")}'`;
  }

  const stagesNote =
    entry.globalName === "CpuPipeline" ? ` stages="IF,ID,EX,MEM,WB"` : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>VisLab — ${entry.displayName}</title>
  <script src="./vislab-embed.min.js"></script>
</head>
<body style="margin:0;background:#111;color:#e4e4e7;font-family:system-ui,sans-serif;">
  <${entry.customElementTag}${stagesNote}${propsAttr}></${entry.customElementTag}>
</body>
</html>
`;

  await writeFile(join(outDir, "index.html"), html, "utf8");
  console.log(
    chalk.green(`✓ Standalone widget written to ${join(outDir, "index.html")}`),
  );
}
