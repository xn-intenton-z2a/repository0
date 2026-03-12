// SPDX-License-Identifier: MIT
// Behaviour-style Playwright test placed under tests/unit so CI can run it where writable.
import { test, expect } from '@playwright/test';

test('site shows fizzbuzz demo', async ({ page, baseURL }) => {
  await page.goto(baseURL || '/');
  const demo = await page.locator('#demo-output').textContent();
  expect(demo).toBeTruthy();
  let parsed;
  try {
    parsed = JSON.parse(demo);
  } catch (e) {
    parsed = null;
  }
  expect(parsed).not.toBeNull();
  expect(parsed.fizzBuzz).toBeInstanceOf(Array);
  expect(parsed.fizzBuzz.length).toBe(15);
  expect(parsed.fizzBuzz[14]).toBe('FizzBuzz');
});
