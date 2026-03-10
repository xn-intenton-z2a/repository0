import { test, expect } from '@playwright/test';
import path from 'path';

test('site shows demo output and identity', async ({ page }) => {
  await page.goto('/');
  const libName = await page.locator('#lib-name').textContent();
  expect(libName).toBeTruthy();
  const demo = await page.locator('#demo-output').textContent();
  expect(demo).toContain('Next 5 runs');
});
