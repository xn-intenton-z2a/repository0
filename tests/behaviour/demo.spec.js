import { test, expect } from '@playwright/test';

test('fizzbuzz demo negative range renders expected tokens', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('#start', '-5');
  await page.fill('#end', '-1');
  await page.click('#generate');
  const items = await page.locator('#results li').allTextContents();
  expect(items).toEqual(['Buzz','-4','Fizz','-2','-1']);
});

test('mixed range -2..2 renders correct order', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('#start','-2');
  await page.fill('#end','2');
  await page.click('#generate');
  const items = await page.locator('#results li').allTextContents();
  expect(items).toEqual(['-2','-1','Fizz','1','2']);
});
