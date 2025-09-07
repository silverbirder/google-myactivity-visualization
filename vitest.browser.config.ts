import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: "playwright",
      // https://vitest.dev/guide/browser/playwright
      instances: [{ browser: "chromium" }],
      headless: true,
    },
    exclude: ["**\/node_modules/**", "src/e2e/**/*.test.ts"],
  },
  optimizeDeps: {
    include: ["d3", "d3-cloud"],
  },
});
