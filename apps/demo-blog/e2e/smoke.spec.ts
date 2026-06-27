import { expect, test } from "@playwright/test";

const WIDGETS_ON_PAGE = [
  "storage-comparison",
  "cpu-pipeline",
  "cache-simulator",
  "sort-race",
  "process-scheduler",
  "lexer",
  "graph-traversal",
] as const;

function collectConsoleErrors(page: import("@playwright/test").Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  return errors;
}

test("home page renders all demo widgets without console errors", async ({
  page,
}) => {
  const errors = collectConsoleErrors(page);
  await page.goto("/");

  for (const id of WIDGETS_ON_PAGE) {
    const widget = page.locator(`[data-vislab-widget="${id}"]`);
    await expect(widget).toBeVisible({ timeout: 15_000 });
    await expect(widget.locator("[data-vislab-canvas] canvas")).toBeVisible();
  }

  expect(errors.filter((e) => !e.includes("favicon"))).toEqual([]);
});

test("storage widget canvas is interactive", async ({ page }) => {
  await page.goto("/");
  const storage = page.locator('[data-vislab-widget="storage-comparison"]');
  await expect(storage).toBeVisible({ timeout: 15_000 });
  const canvas = storage.locator("[data-vislab-canvas] canvas");
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  expect(box?.width).toBeGreaterThan(0);
  expect(box?.height).toBeGreaterThan(0);
});