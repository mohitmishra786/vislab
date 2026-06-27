import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";

type Template = "jekyll" | "html" | "astro";

export async function newCmd(
  projectName: string,
  opts: { template?: string },
) {
  const template = (opts.template ?? "jekyll") as Template;
  const dir = join(process.cwd(), projectName);
  await mkdir(dir, { recursive: true });

  if (template === "jekyll") {
    await mkdir(join(dir, "_posts"), { recursive: true });
    await writeFile(
      join(dir, "_posts", "2026-04-12-hello-vislab.md"),
      `---
layout: post
title: "Hello VisLab"
---

{% include vislab.html id="storage1" component="StorageComparison" %}
`,
      "utf8",
    );
    await writeFile(
      join(dir, "README.md"),
      `# ${projectName}\n\nRun \`vislab build -o ./assets/js\` and add vislab-jekyll to your Gemfile.\n`,
      "utf8",
    );
  } else if (template === "html") {
    await writeFile(
      join(dir, "index.html"),
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <script src="./vislab-embed.min.js" defer></script>
</head>
<body>
  <div data-vislab="StorageComparison" style="min-height:420px;width:100%"></div>
</body>
</html>
`,
      "utf8",
    );
    await writeFile(
      join(dir, "README.md"),
      `# ${projectName}\n\nCopy \`vislab-embed.min.js\` here via \`vislab build -o .\`\n`,
      "utf8",
    );
  } else {
    await mkdir(join(dir, "src/pages"), { recursive: true });
    await writeFile(
      join(dir, "package.json"),
      JSON.stringify(
        {
          name: projectName,
          private: true,
          scripts: { dev: "astro dev", build: "astro build" },
          dependencies: {
            astro: "^5.15.8",
            "@astrojs/react": "^4.0.0",
            react: "^18.2.0",
            "react-dom": "^18.2.0",
            "@vislab/react": "^0.0.0",
          },
        },
        null,
        2,
      ),
      "utf8",
    );
    await writeFile(
      join(dir, "src/pages/index.astro"),
      `---
import { StorageComparison } from "@vislab/react";
---
<h1>VisLab Astro starter</h1>
<StorageComparison client:visible />
`,
      "utf8",
    );
    await writeFile(
      join(dir, "README.md"),
      `# ${projectName}\n\n\`pnpm install && pnpm dev\`\n`,
      "utf8",
    );
  }

  console.log(chalk.green(`Scaffolded ${template} project in ${dir}`));
  console.log(chalk.gray(`Template: ${template}`));
}