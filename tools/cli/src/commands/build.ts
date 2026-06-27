import { copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import { $ } from "zx";
import { resolveRepoRoot } from "../util/repoRoot";

export async function buildCmd(opts: { output?: string }) {
  const root = resolveRepoRoot();
  const outDir = join(process.cwd(), opts.output ?? "dist/vislab");

  console.log(
    chalk.yellow(
      "Building @vislab/components and @vislab/web-components via turbo…",
    ),
  );
  await $({
    cwd: root,
  })`pnpm exec turbo run build --filter=@vislab/components --filter=@vislab/web-components`;

  await mkdir(outDir, { recursive: true });

  const compIife = join(root, "packages/components/dist/index.global.js");
  const embedIife = join(root, "packages/web-components/dist/index.global.js");

  await copyFile(compIife, join(outDir, "vislab.min.js"));
  await copyFile(embedIife, join(outDir, "vislab-embed.min.js"));

  console.log(chalk.green("✓ Wrote:"));
  console.log(
    `  ${join(outDir, "vislab.min.js")}  ${chalk.gray("(global VisLab)")}`,
  );
  console.log(
    `  ${join(outDir, "vislab-embed.min.js")}  ${chalk.gray("(VisLabEmbeds + custom elements + data-vislab)")}`,
  );
}
