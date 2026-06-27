import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";

export async function newCmd(projectName: string) {
  const dir = join(process.cwd(), projectName);
  await mkdir(join(dir, "_posts"), { recursive: true });

  const sample = `---
layout: post
title: "Hello VisLab"
---

# Storage latency

<div data-vislab="StorageComparison" style="min-height:420px"></div>

<script src="{{ '/assets/js/vislab-embed.min.js' | relative_url }}"></script>
`;

  await writeFile(
    join(dir, "_posts", "2026-04-12-hello-vislab.md"),
    sample,
    "utf8",
  );
  console.log(chalk.green(`Scaffolded Jekyll-style sample in ${dir}`));
  console.log(
    chalk.gray(
      "Run `vislab build -o " +
        join(projectName, "assets/js") +
        "` then copy artifacts into assets/js.",
    ),
  );
}
