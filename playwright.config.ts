import { defineConfig, devices } from "@playwright/test";
import { E2E_BASE_URL, e2eEnvironment } from "./tests/e2e/environment";

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: E2E_BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
  webServer: {
    command: "node node_modules/next/dist/bin/next start --port 3100",
    url: E2E_BASE_URL,
    env: e2eEnvironment,
    reuseExistingServer: false,
    timeout: 120000,
  },
});
