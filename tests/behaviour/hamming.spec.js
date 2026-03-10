import { test, expect } from '@playwright/test';

test('demo page shows hamming distances', async ({ page }) => {
  await page.goto('/');
  const name = await page.locator('#lib-name').textContent();
  expect(name).toBeTruthy();

  const demoText = await page.locator('#demo-output').textContent();
  expect(demoText).toBeTruthy();
  const results = JSON.parse(demoText || '{}');

  expect(results.example1.distance).toBe(3);
  expect(results.bits1.distance).toBe(2);
});
