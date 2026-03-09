import { test, expect } from '@playwright/test';
import path from 'path';

// This behaviour test is placed in tests/unit to match adjusted playwright.config.js
test('fizz-buzz demo page shows fizz/buzz/fizzbuzz and interactive render', async ({ page }) => {
  const file = path.join(process.cwd(), 'docs', 'index.html');
  await page.goto('file://' + file);
  await page.waitForSelector('#fizzbuzz-demo');

  const demoText = await page.locator('#fizzbuzz-demo').innerText();
  expect(demoText).toContain('fizz');
  expect(demoText).toContain('buzz');
  expect(demoText).toContain('fizzbuzz');

  // Interact: request n=15 and verify specific items (3 -> fizz, 5 -> buzz, 15 -> fizzbuzz)
  await page.fill('#fizzbuzz-n', '15');
  await page.click('#fizzbuzz-render');
  await page.waitForSelector('#fizzbuzz-demo li');

  const items = page.locator('#fizzbuzz-demo li');
  // zero-based indices: 2 => 3, 4 => 5, 14 => 15
  await expect(items.nth(2)).toHaveText('fizz');
  await expect(items.nth(4)).toHaveText('buzz');
  await expect(items.nth(14)).toHaveText('fizzbuzz');
});
