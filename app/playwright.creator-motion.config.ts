import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", testMatch: "creator-motion.spec.ts", timeout: 20_000,
  use: { baseURL: "http://127.0.0.1:4173", viewport: { width: 1100, height: 1100 } },
});
