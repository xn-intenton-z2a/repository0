import { test, expect } from '@playwright/test';

test('demo page shows fizzbuzz output and interactive button works', async ({ page, baseURL }) => {
  await page.goto('/');
  await expect(page.locator('#lib-name')).toHaveText(/FizzBuzz Demo/);
  // input default is 15 in our demo building; check that list renders
  await expect(page.locator('#fizzbuzz-demo li')).toHaveCount(15);
  await expect(page.locator('#fizzbuzz-demo li').nth(14)).toHaveText('FizzBuzz');

  // change to 5 and click render
  await page.fill('#fizzbuzz-n', '5');
  await page.click('#fizzbuzz-render');
  await expect(page.locator('#fizzbuzz-demo li')).toHaveCount(5);
  await expect(page.locator('#fizzbuzz-demo li').nth(2)).toHaveText('Fizz');
});
