import { test, expect } from '@playwright/test';

test('fizzbuzz demo page shows expected output and interactivity', async ({ page }) => {
  await page.goto('/fizzbuzz.html');
  // ensure initial empty state or instructions present
  const output = await page.locator('#fizzbuzz-output');
  await expect(output).toBeVisible();

  // Generate for N=15
  await page.fill('#fizzbuzz-n', '15');
  await page.click('#fizzbuzz-gen');

  const text = await output.textContent();
  // should contain key tokens in order
  expect(text).toContain('1');
  expect(text).toContain('Fizz');
  expect(text).toContain('Buzz');
  expect(text).toContain('FizzBuzz');

  // Spot check sequence order: first few entries
  const lines = text.split(/\s+/).filter(Boolean);
  expect(lines[0]).toBe('1');
  expect(lines[1]).toBe('2');
  expect(lines[2]).toBe('Fizz');
});
