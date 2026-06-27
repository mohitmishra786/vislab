import { expect, test } from "@playwright/test";

test("home page loads storage demo with canvas", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("/");
  const storageCanvas = page
    .locator("section")
    .filter({ hasText: "Storage" })
    .locator("canvas")
    .first();
  await expect(storageCanvas).toBeVisible({ timeout: 15_000 });
  expect(errors.filter((e) => !e.includes("favicon"))).toEqual([]);
});
