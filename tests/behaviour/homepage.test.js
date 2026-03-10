// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { test, expect } from "@playwright/test";

test("homepage returns 200 and renders", async ({ page }) => {
  const response = await page.goto("/", { waitUntil: "networkidle" });
  expect(response.status()).toBe(200);

  // Check that library identity elements are visible
  await expect(page.locator("#lib-name")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("#lib-version")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("#lib-description")).toBeVisible({ timeout: 10000 });

  // Check that the demo sections are visible
  await expect(page.locator("#string-result")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("#bit-result")).toBeVisible({ timeout: 10000 });

  // Check that default calculations are shown
  await expect(page.locator("#string-result")).toContainText("Result:");
  await expect(page.locator("#bit-result")).toContainText("Result:");

  await page.screenshot({ path: "SCREENSHOT_INDEX.png", fullPage: true });
});
