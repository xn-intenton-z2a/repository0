import { test, expect } from '@playwright/test';
import { name, version } from '../../src/lib/main.js';

const pagePath = new URL('../../src/web/index.html', import.meta.url).href;

test('site shows demo output and identity', async ({ page }) => {
  await page.goto(pagePath);
  await expect(page.locator('#lib-name')).toHaveText(name, { timeout: 5000 });
  await expect(page.locator('#lib-version')).toHaveText(version, { timeout: 5000 });
  await page.waitForSelector('#demo-output');
  const text = await page.locator('#demo-output').textContent();
  // demo-output contains JSON produced by the page script
  const obj = JSON.parse(text);
  expect(obj.identity.name).toBe(name);
  expect(Array.isArray(obj.fizzBuzz)).toBe(true);
  expect(obj.fizzBuzz.length).toBe(15);
  expect(obj.fizzBuzz[14]).toBe('FizzBuzz');
});
