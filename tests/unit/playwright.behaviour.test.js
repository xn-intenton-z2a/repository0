import { test, expect } from '@playwright/test';
import path from 'path';

test('demo converts number to roman and back and shows error', async ({ page }) => {
  const file = path.resolve(process.cwd(), 'docs', 'index.html');
  await page.goto('file://' + file);
  await page.fill('#num-input', '1994');
  await page.click('#to-roman');
  await expect(page.locator('#result')).toHaveText('1994 → MCMXCIV');
  await page.fill('#roman-input', 'MCMXCIV');
  await page.click('#from-roman');
  await expect(page.locator('#result')).toHaveText('MCMXCIV → 1994');
  await page.fill('#roman-input', 'IIII');
  await page.click('#from-roman');
  await expect(page.locator('#result')).toContainText('SyntaxError');
});
