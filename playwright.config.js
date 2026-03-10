// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    timezoneId: "America/New_York",
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
