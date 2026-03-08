import { test, expect } from '@playwright/test';
import path from 'path';

test('compute hamming on demo page', async ({ page }) => {
  const html = 'file://'+path.resolve('docs/index.html');
  await page.goto(html);
  const a = page.locator('#input-a');
  const b = page.locator('#input-b');
  await a.fill('karolin');
  await b.fill('kathrin');
  await page.click('#compute');
  await expect(page.locator('#result')).toContainText('Distance: 3');
  const highlighted = await page.locator('.highlight').count();
  expect(highlighted).toBeGreaterThan(0);
});
