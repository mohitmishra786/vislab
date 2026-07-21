import { expect, test } from "@playwright/test";

/** Top flagship widgets — smoke at phone width. */
const FLAGSHIP_IDS = [
  "storage-comparison",
  "cpu-pipeline",
  "cache-simulator",
  "process-scheduler",
  "sort-race",
] as const;

test.describe("mobile 375px smoke", () => {
  test.use({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  });

  for (const id of FLAGSHIP_IDS) {
    test(`${id} visible and has canvas + controls at 375px`, async ({
      page,
    }) => {
      await page.goto(`/visual/${id}`);
      const widget = page.locator(`[data-vislab-widget="${id}"]`);
      await expect(widget).toBeVisible({ timeout: 20_000 });
      await expect(widget.locator("canvas").first()).toBeVisible();
      // Shared SimClock strip
      await expect(widget.locator("[data-vislab-simclock]")).toBeVisible();
      // Horizontal overflow is allowed; widget must not collapse to 0 width
      const box = await widget.boundingBox();
      expect(box).toBeTruthy();
      expect(box?.width ?? 0).toBeGreaterThan(200);
      expect(box?.height ?? 0).toBeGreaterThan(80);
    });
  }
});
