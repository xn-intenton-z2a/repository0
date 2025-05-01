import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@dist": "/dist",
      "@src": "/src",
      "@tests": "/tests",
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/*.test.js", "sandbox/tests/*.test.js"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.js", "sandbox/source/*.js"],
      exclude: ["**/dist/**", "**/entrypoint/**", "**/tests/**", "**/node_modules/**", "src/index.js", "**/exports/**"],
      threshold: {
        statements: 85,
        branches: 80,
        functions: 75,
        lines: 85,
        perFile: {
          statements: 70,
          branches: 60,
          functions: 40,
          lines: 70,
        },
      },
    },
  },
});
