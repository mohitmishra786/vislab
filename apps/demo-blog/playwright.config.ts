import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  // Platform-specific baselines: full-widget chrome matches host fonts (darwin vs linux).
  // Generate with: playwright test e2e/visual.spec.ts --update-snapshots
  // CI (ubuntu) needs *-linux.png; local Mac uses *-darwin.png.
  snapshotPathTemplate:
    "{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}-{platform}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4322",
    trace: "on-first-retry",
    deviceScaleFactor: 1,
    locale: "en-US",
    reducedMotion: "reduce",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // WebKit for cross-engine smoke (visual snapshots still chromium-only paths)
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testMatch: /smoke\.spec\.ts|mobile\.spec\.ts/,
    },
  ],
  webServer: {
    command: "pnpm exec astro preview --host 127.0.0.1 --port 4322",
    cwd: __dirname,
    url: "http://127.0.0.1:4322",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
