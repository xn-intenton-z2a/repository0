// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { test, expect } from "@playwright/test";

test("homepage returns 200 and renders", async ({ page }) => {
  const response = await page.goto("/");
  expect(response.status()).toBe(200);

  await expect(page.locator("#lib-name")).toBeVisible();
  await expect(page.locator("#fizzbuzz-demo")).toBeVisible();
  await expect(page.locator("#fizzbuzz-render")).toBeVisible();

  // optional screenshot for debugging in CI
  await page.screenshot({ path: "SCREENSHOT_INDEX.png", fullPage: true });
});
