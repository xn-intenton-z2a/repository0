import { test, expect } from '@playwright/test';

test.describe('FizzBuzz demo', ()=>{
  test.beforeEach(async ({ page }) => {
    // build step is performed by npm test:behaviour script; assume docs served at http://localhost:3000
    await page.goto('http://localhost:3000');
  });

  test('renders 1..15 correctly', async ({ page }) => {
    await page.fill('#start', '1');
    await page.fill('#end', '15');
    await page.click('#generate');
    await page.waitForSelector('#results li');
    const items = await page.locator('#results li').allTextContents();
    expect(items.join(' ')).toBe('1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz');
  });

  test('renders -3..3 correctly', async ({ page }) => {
    await page.fill('#start', '-3');
    await page.fill('#end', '3');
    await page.click('#generate');
    await page.waitForSelector('#results li');
    const items = await page.locator('#results li').allTextContents();
    expect(items).toEqual(['Fizz','-2','-1','FizzBuzz','1','2','Fizz']);
  });
});
