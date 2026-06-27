import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * Find the monorepo root (directory containing pnpm-workspace.yaml).
 */
export function resolveRepoRoot(startDir = process.cwd()): string {
  let dir = startDir;
  for (;;) {
    if (existsSync(join(dir, "pnpm-workspace.yaml"))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error(
        "Could not find pnpm-workspace.yaml — run vislab from inside the VisLab monorepo.",
      );
    }
    dir = parent;
  }
}
