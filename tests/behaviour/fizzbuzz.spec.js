import { test, expect } from '@playwright/test';
import { readFile } from 'fs/promises';
import path from 'path';

test('demo page fizzbuzzSingle and range work', async ({ page }) => {
  const file = path.resolve('docs/index.html');
  await page.goto('file://' + file);
  // single
  await page.fill('#single-input', '15');
  await page.click('#single-button');
  await expect(page.locator('#single-output')).toHaveText('fizzbuzz');
  // range
  await page.fill('#range-start', '1');
  await page.fill('#range-end', '5');
  await page.click('#range-button');
  const items = page.locator('#range-output li');
  await expect(items).toHaveCount(5);
  await expect(items.nth(0)).toHaveText('1');
  await expect(items.nth(2)).toHaveText('fizz');
});
