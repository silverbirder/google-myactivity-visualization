import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/e2e/**/*.test.ts"],
    hookTimeout: 100_000,
    testTimeout: 100_000,
  },
});
