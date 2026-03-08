const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');
const path = require('path');

test.describe('roman demo behaviour', ()=>{
  test.beforeAll(()=>{
    // build site
    execSync('npm run build:web', { stdio: 'inherit' });
  });

  test('number -> roman and roman -> number and errors', async ({ page }) => {
    const url = 'http://localhost:3000/roman.html';
    // start static server
    const serve = execSync('npx serve -s docs -l 3000 &', { stdio: 'ignore' });
    await page.goto(url);
    // number -> roman
    await page.fill('[data-test-id="number-input"]','1994');
    await page.click('[data-test-id="number-convert"]');
    await expect(page.locator('[data-test-id="number-output"]')).toHaveText('MCMXCIV');
    // roman -> number
    await page.fill('[data-test-id="roman-input"]','mcmxciv');
    await page.click('[data-test-id="roman-convert"]');
    await expect(page.locator('[data-test-id="roman-output"]')).toHaveText('1994');
    // invalid number
    await page.fill('[data-test-id="number-input"]','0');
    await page.click('[data-test-id="number-convert"]');
    await expect(page.locator('[data-test-id="number-error"]')).toContainText('RangeError');
    // invalid roman
    await page.fill('[data-test-id="roman-input"]','IIII');
    await page.click('[data-test-id="roman-convert"]');
    await expect(page.locator('[data-test-id="roman-error"]')).toContainText('SyntaxError');
  });
});
