import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const docsIndex = path.join(process.cwd(), 'docs', 'index.html');

test('playwright fizzbuzz demo (from tests/unit location)', async ({ page }) => {
  if (!fs.existsSync(docsIndex)) {
    throw new Error('docs/index.html not found; ensure build:web ran before behaviour tests');
  }
  const url = 'file://' + docsIndex;
  await page.goto(url);
  const output = page.locator('#fizz-buzz-output');
  await expect(output).toHaveCount(1);
  await expect(output.locator('li')).toHaveCount(15);
  const texts = await output.locator('li').allTextContents();
  expect(texts.some(t => t.includes('FizzBuzz'))).toBeTruthy();

  await page.fill('#fizz-buzz-input', '5');
  await page.click('#fizz-buzz-run');
  await expect(output.locator('li')).toHaveCount(5);
  const fifth = await output.locator('li').nth(4).textContent();
  expect(fifth).toContain('Buzz');
});
