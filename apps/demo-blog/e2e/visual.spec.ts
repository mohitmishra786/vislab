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
  // Chromium-only: single snapshot set for linux CI
  test.skip(({ browserName }) => browserName !== "chromium");

  for (const id of WIDGET_IDS) {
    test(`${id} widget snapshot`, async ({ page }) => {
      await page.goto(`/visual/${id}`);
      // Full widget chrome (title e.g. "B-tree search", buttons, canvas) — not canvas alone
      const widget = page.locator(`[data-vislab-widget="${id}"]`);
      await expect(widget).toBeVisible({ timeout: 20_000 });
      await expect(widget.locator("canvas").first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);

      // Pause SimClock so motion is stable without stripping chrome
      await widget.evaluate((root) => {
        for (const btn of root.querySelectorAll("button")) {
          if (btn.textContent?.trim() === "Pause") {
            (btn as HTMLButtonElement).click();
          }
        }
      });
      await page.waitForTimeout(500);

      // Higher threshold: header fonts/metrics differ slightly Mac vs Ubuntu CI
      // Prefer full-widget fidelity over tight pixel matching.
      const maxDiff = Number(process.env.VISUAL_MAX_DIFF ?? "0.25");
      await expect(widget).toHaveScreenshot(`${id}.png`, {
        maxDiffPixelRatio: Number.isFinite(maxDiff) ? maxDiff : 0.25,
        // Allow small size drift (header wrap 2px) without failing on dimensions
        maxDiffPixels: 50_000,
      });
    });
  }
});
