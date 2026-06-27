import { expect, test } from "@playwright/test";

/** All 17 registry widget ids — must match packages/registry/src/registry.ts */
const WIDGET_IDS = [
  "storage-comparison",
  "cpu-pipeline",
  "cache-simulator",
  "branch-predictor",
  "tlb-walk",
  "process-scheduler",
  "virtual-memory",
  "syscall-trace",
  "inode-tree",
  "sort-race",
  "btree-ops",
  "graph-traversal",
  "hash-collision",
  "lexer",
  "parser",
  "cfg-builder",
  "register-allocator",
] as const;

test.describe("visual regression", () => {
  for (const id of WIDGET_IDS) {
    test(`${id} widget snapshot`, async ({ page }) => {
      await page.goto(`/visual/${id}`);
      const widget = page.locator(`[data-vislab-widget="${id}"]`);
      await expect(widget).toBeVisible({ timeout: 20_000 });
      await expect(widget.locator("canvas").first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      // Let canvas layout and first paint settle
      await page.waitForTimeout(400);
      await expect(widget).toHaveScreenshot(`${id}.png`, {
        maxDiffPixelRatio: 0.05,
      });
    });
  }
});
