import { expect, test } from "@playwright/test";

const WIDGET_IDS = [
  "storage-comparison",
  "cpu-pipeline",
  "branch-predictor",
  "tlb-walk",
  "cache-simulator",
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

function collectConsoleErrors(page: import("@playwright/test").Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  return errors;
}

test("home page renders all 17 widgets without console errors", async ({
  page,
}) => {
  const errors = collectConsoleErrors(page);
  await page.goto("/");

  for (const id of WIDGET_IDS) {
    const widget = page.locator(`[data-vislab-widget="${id}"]`);
    await expect(widget).toBeVisible({ timeout: 20_000 });
  }

  expect(errors.filter((e) => !e.includes("favicon"))).toEqual([]);
});

test("storage widget has interactive canvas", async ({ page }) => {
  await page.goto("/");
  const storage = page.locator('[data-vislab-widget="storage-comparison"]');
  await expect(storage).toBeVisible({ timeout: 15_000 });
  const canvas = storage.locator("[data-vislab-canvas] canvas, canvas").first();
  await expect(canvas).toBeVisible();
});
