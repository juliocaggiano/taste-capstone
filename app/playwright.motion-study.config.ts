import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "creator-motion-study.spec.ts",
  timeout: 20_000,
  workers: 1,
  outputDir: "../qa/creator-motion-variations-2026-09-23/browser-results",
  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 1100, height: 1100 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
