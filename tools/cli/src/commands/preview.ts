import chalk from "chalk";
import { $ } from "zx";
import { resolveRepoRoot } from "../util/repoRoot";

export async function previewCmd(opts: { target?: string }) {
  const root = resolveRepoRoot();
  const target = opts.target ?? "demo-blog";

  console.log(chalk.cyan(`Starting ${target} dev server…`));
  $.cwd = root;
  await $`pnpm --filter ${target} dev`;
}
