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
  // Chromium-only full-widget chrome (titles + controls + canvas)
  test.skip(({ browserName }) => browserName !== "chromium");

  for (const id of WIDGET_IDS) {
    test(`${id} widget snapshot`, async ({ page }) => {
      await page.goto(`/visual/${id}`);
      const widget = page.locator(`[data-vislab-widget="${id}"]`);
      await expect(widget).toBeVisible({ timeout: 20_000 });
      await expect(widget.locator("canvas").first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);

      // Pause SimClock so motion is stable; keep full chrome + titles
      await widget.evaluate((root) => {
        for (const btn of root.querySelectorAll("button")) {
          if (btn.textContent?.trim() === "Pause") {
            (btn as HTMLButtonElement).click();
          }
        }
      });
      await page.waitForTimeout(500);

      // Slight tolerance for antialiasing; sizes are stabilized via fixed header heights.
      // Platform-specific files (*-linux / *-darwin) keep quality without cross-OS blur.
      const maxDiff = Number(process.env.VISUAL_MAX_DIFF ?? "0.08");
      await expect(widget).toHaveScreenshot(`${id}.png`, {
        maxDiffPixelRatio: Number.isFinite(maxDiff) ? maxDiff : 0.08,
      });
    });
  }
});
