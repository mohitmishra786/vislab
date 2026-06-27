import { expect, test } from "@playwright/test";

test("home page loads storage demo with canvas", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("/");
  await expect(page.locator("canvas")).toBeVisible({ timeout: 15_000 });
  expect(errors.filter((e) => !e.includes("favicon"))).toEqual([]);
});
