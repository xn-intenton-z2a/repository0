// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { test, expect } from "@playwright/test";

test("homepage returns 200 and renders", async ({ page }) => {
  const response = await page.goto("/");
  expect(response.status()).toBe(200);

  await expect(page.locator("#lib-name")).toBeVisible();
  await expect(page.locator("#lib-version")).toBeVisible();
  await expect(page.locator("#demo-output")).toBeVisible();

  // Demo output should include fizzBuzz15 result and FizzBuzz token
  const text = await page.locator('#demo-output').innerText();
  expect(text).toContain('fizzBuzz15');
  expect(text).toContain('FizzBuzz');

  await page.screenshot({ path: "SCREENSHOT_INDEX.png", fullPage: true });
});
