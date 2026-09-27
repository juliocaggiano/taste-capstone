import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "explore-study.spec.ts",
  timeout: 45_000,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 1500, height: 1100 },
  },
});
