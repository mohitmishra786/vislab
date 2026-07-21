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
  // Chromium-only: single snapshot set for linux CI (avoid multi-browser baselining)
  test.skip(({ browserName }) => browserName !== "chromium");

  for (const id of WIDGET_IDS) {
    test(`${id} widget snapshot`, async ({ page }) => {
      await page.goto(`/visual/${id}`);
      const widget = page.locator(`[data-vislab-widget="${id}"]`);
      await expect(widget).toBeVisible({ timeout: 20_000 });
      // Snapshot the canvas surface only — chrome/button fonts differ Mac vs Ubuntu
      // (e.g. header wrap caused 282 vs 280px height on branch-predictor).
      const canvas = widget.locator("canvas").first();
      await expect(canvas).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      // Pause SimClock so animation frames are stable
      await widget.evaluate((root) => {
        for (const btn of root.querySelectorAll("button")) {
          if (btn.textContent?.trim() === "Pause") {
            (btn as HTMLButtonElement).click();
          }
        }
      });
      await page.waitForTimeout(500);
      const maxDiff = Number(process.env.VISUAL_MAX_DIFF ?? "0.15");
      await expect(canvas).toHaveScreenshot(`${id}.png`, {
        maxDiffPixelRatio: Number.isFinite(maxDiff) ? maxDiff : 0.15,
      });
    });
  }
});
