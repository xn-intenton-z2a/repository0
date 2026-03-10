import { test, expect } from '@playwright/test';
import path from 'path';

test('site shows demo output and identity', async ({ page }) => {
  const docsIndex = path.resolve('docs/index.html');
  await page.goto('file://' + docsIndex);
  const libName = await page.locator('#lib-name').textContent();
  expect(libName).toBeTruthy();
  const demo = await page.locator('#demo-output').textContent();
  expect(demo).toContain('Next 7 daily runs');
});
