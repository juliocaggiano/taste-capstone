import { defineConfig } from "@playwright/test";

// Verify the same production build served by the project's persistent preview.
// The main runtime suite keeps its separate fixture and development server.
export default defineConfig({
  testDir: "./tests",
  testMatch: "today-viewer.spec.ts",
  timeout: 20_000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 1100, height: 1100 },
  },
});
