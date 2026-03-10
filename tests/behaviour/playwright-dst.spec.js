import { test, expect } from '@playwright/test';

test('behaviour: repeated times across fall-back', async ({ page }) => {
  await page.goto('/');
  await page.fill('#cron-input', '30 1 * * *');
  await page.fill('#start-input', '2021-11-07T00:00:00-04:00');
  await page.fill('#count-input', '2');
  await page.click('#generate-button');
  const output = await page.textContent('#demo-output');
  expect(output).toContain('2021-11-07T05:30:00.000Z');
  expect(output).toContain('2021-11-07T06:30:00.000Z');
  expect(output.toLowerCase()).toContain('repeated');
});
