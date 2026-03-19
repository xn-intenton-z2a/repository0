// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { test, expect } from "@playwright/test";
import { getIdentity } from "../../src/lib/main.js";

const expectedFizz15 = [
  "1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"
].join(', ');

test("homepage returns 200 and renders", async ({ page }) => {
  const response = await page.goto("./", { waitUntil: "networkidle" });
  expect(response.status()).toBe(200);

  await expect(page.locator("#lib-name")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("#lib-version")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("#demo-output")).toBeVisible({ timeout: 10000 });

  // Check that fizzBuzz(15) demo output is present and correct
  await expect(page.locator('#fizz-15')).toBeVisible();
  const fizz15Text = (await page.locator('#fizz-15').textContent())?.trim();
  expect(fizz15Text).toBe(expectedFizz15);

  // Check single examples
  expect((await page.locator('#single-3').textContent())).toBe('Fizz');
  expect((await page.locator('#single-5').textContent())).toBe('Buzz');
  expect((await page.locator('#single-15').textContent())).toBe('FizzBuzz');
  expect((await page.locator('#single-7').textContent())).toBe('7');

  await page.screenshot({ path: "SCREENSHOT_INDEX.png", fullPage: true });
});

test("page displays the library version from src/lib/main.js", async ({ page }) => {
  const { version } = getIdentity();
  await page.goto("./", { waitUntil: "networkidle" });
  const pageVersion = await page.locator("#lib-version").textContent();
  expect(pageVersion).toContain(version);
});
