// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { test, expect } from "@playwright/test";

test("homepage returns 200 and renders", async ({ page }) => {
  const response = await page.goto("/", { waitUntil: "networkidle" });
  expect(response.status()).toBe(200);

  await expect(page.locator("#lib-name")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("#lib-version")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("#demo-output")).toBeVisible({ timeout: 10000 });

  await page.screenshot({ path: "SCREENSHOT_INDEX.png", fullPage: true });
});
