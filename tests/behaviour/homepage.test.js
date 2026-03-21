// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { test, expect } from "@playwright/test";
import { getIdentity } from "../../src/lib/main.js";

test("homepage returns 200 and renders", async ({ page }) => {
  const response = await page.goto("./", { waitUntil: "networkidle" });
  expect(response.status()).toBe(200);

  await expect(page.locator("#lib-name")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("#lib-version")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("#demo-output")).toBeVisible({ timeout: 10000 });

  // assert fizzBuzz outputs are rendered correctly
  const demoText = await page.locator('#demo-output').textContent();
  const demo = JSON.parse(demoText);
  expect(demo.fizzBuzz15).toHaveLength(15);
  expect(demo.fizzBuzz15[14]).toBe('FizzBuzz');
  const singles = Object.fromEntries(demo.fizzBuzzSingle.map(s => [String(s.n), s.out]));
  expect(singles['3']).toBe('Fizz');
  expect(singles['5']).toBe('Buzz');
  expect(singles['15']).toBe('FizzBuzz');
  expect(singles['7']).toBe('7');

  await page.screenshot({ path: "SCREENSHOT_INDEX.png", fullPage: true });
});

test("page displays the library version from src/lib/main.js", async ({ page }) => {
  const { version } = getIdentity();
  await page.goto("./", { waitUntil: "networkidle" });
  const pageVersion = await page.locator("#lib-version").textContent();
  expect(pageVersion).toContain(version);
});
