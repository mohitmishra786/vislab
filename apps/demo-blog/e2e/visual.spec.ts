import { expect, test } from "@playwright/test";

test.describe("visual regression", () => {
  test("storage widget snapshot", async ({ page }) => {
    await page.goto("/");
    const storage = page.locator('[data-vislab-widget="storage-comparison"]');
    await expect(storage).toBeVisible({ timeout: 20_000 });
    await expect(storage).toHaveScreenshot("storage-comparison.png", {
      maxDiffPixelRatio: 0.05,
    });
  });

  test("cpu pipeline widget snapshot", async ({ page }) => {
    await page.goto("/");
    const cpu = page.locator('[data-vislab-widget="cpu-pipeline"]');
    await expect(cpu).toBeVisible({ timeout: 20_000 });
    await page.waitForTimeout(500);
    await expect(cpu).toHaveScreenshot("cpu-pipeline.png", {
      maxDiffPixelRatio: 0.08,
    });
  });
});
