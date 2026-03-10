// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/behaviour",
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "npx serve docs -l 3000",
    port: 3000,
    reuseExistingServer: true,
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
});
