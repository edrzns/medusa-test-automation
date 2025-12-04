import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Only include API tests, exclude e2e
    include: ["**/*.test.ts"],
    exclude: ["**/e2e/**", "**/node_modules/**"],

    // Run tests sequentially for now
    sequence: {
      concurrent: false,
    },

    // Timeout for API tests
    testTimeout: 10000,

    // Environment
    environment: "node",

    // Global setup/teardown
    // globalSetup: './setup.ts',

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      exclude: ["node_modules/", "vitest.config.ts"],
    },
  },
});
