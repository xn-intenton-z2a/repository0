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

test("displays Hamming distance demonstrations", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  
  // Check that demo sections are visible
  await expect(page.locator("text=String Hamming Distance")).toBeVisible();
  await expect(page.locator("text=Bit Hamming Distance")).toBeVisible();
  
  // Check that example results are computed and displayed
  await expect(page.locator("#string-demo-1")).toContainText("Result: 3");
  await expect(page.locator("#bits-demo-1")).toContainText("Result: 2");
});

test("interactive string distance calculator works", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  
  // Test the interactive string distance calculator
  await page.fill("#str1", "test");
  await page.fill("#str2", "best");
  await page.click("button:has-text('Calculate Distance')");
  
  await expect(page.locator("#string-result")).toContainText("Distance: 1");
});

test("interactive bits distance calculator works", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  
  // Test the interactive bits distance calculator
  await page.fill("#num1", "5");
  await page.fill("#num2", "3");
  
  // Click the second button (the one for bits calculation)
  const buttons = await page.locator("button:has-text('Calculate Distance')").all();
  await buttons[1].click();
  
  await expect(page.locator("#bits-result")).toContainText("Distance: 2");
  await expect(page.locator("#bits-result")).toContainText("5=101₂, 3=11₂");
});

test("error handling works for invalid inputs", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  
  // Test string length mismatch error
  await page.fill("#str1", "short");
  await page.fill("#str2", "longer string");
  await page.click("button:has-text('Calculate Distance')");
  
  await expect(page.locator("#string-result")).toContainText("Error:");
  await expect(page.locator("#string-result")).toContainText("equal length");
});
