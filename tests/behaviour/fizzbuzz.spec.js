import { test, expect } from '@playwright/test';

test('demo generates 15 items with FizzBuzz', async ({ page }) => {
  // serve docs via npm start in CI; here assume docs served at http://localhost:3000
  // The test harness for this repo runs `npm run build:web` and Playwright; serve uses default port 3000
  await page.goto('http://localhost:3000');
  const input = await page.locator('#n');
  const btn = await page.locator('#generate');
  await expect(input).toBeVisible();
  await input.fill('15');
  await btn.click();
  await page.waitForSelector('#results li');
  const items = await page.locator('#results li').allTextContents();
  expect(items.length).toBe(15);
  expect(items[14]).toBe('FizzBuzz');
});
