// tests/behaviour/hamming.spec.js

import { test, expect } from '@playwright/test';
import { getIdentity } from '../../src/lib/main.js';

test.describe('Hamming Distance Web Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays library identity correctly', async ({ page }) => {
    const identity = getIdentity();
    
    // Check if the page displays the library name and version
    const libName = await page.textContent('#lib-name');
    const libVersion = await page.textContent('#lib-version');
    const libDescription = await page.textContent('#lib-description');

    expect(libName).toBeTruthy();
    expect(libVersion).toBeTruthy();
    expect(libDescription).toBeTruthy();
    
    // The version should match what the library reports
    // (allowing for fallbacks when lib-meta.js is not available)
    if (!libVersion.includes('build required')) {
      expect(libVersion).toContain(identity.version);
    }
  });

  test('string distance calculation works', async ({ page }) => {
    // Use the default values (karolin, kathrin)
    await page.click('button:has-text("Calculate"):near(#string1)');
    
    const output = await page.textContent('#string-demo');
    expect(output).toContain('Result: 3');
    expect(output).toContain('karolin');
    expect(output).toContain('kathrin');
  });

  test('bit distance calculation works', async ({ page }) => {
    // Use the default values (1, 4)
    await page.click('button:has-text("Calculate"):near(#int1)');
    
    const output = await page.textContent('#bit-demo');
    expect(output).toContain('Result: 2');
    expect(output).toContain('Inputs: 1, 4');
  });

  test('string distance handles user input', async ({ page }) => {
    await page.fill('#string1', 'hello');
    await page.fill('#string2', 'hallo');
    await page.click('button:has-text("Calculate"):near(#string1)');
    
    const output = await page.textContent('#string-demo');
    expect(output).toContain('Result: 1');
    expect(output).toContain('hello');
    expect(output).toContain('hallo');
  });

  test('bit distance handles user input', async ({ page }) => {
    await page.fill('#int1', '7');
    await page.fill('#int2', '4');
    await page.click('button:has-text("Calculate"):near(#int1)');
    
    const output = await page.textContent('#bit-demo');
    expect(output).toContain('Result: 2'); // 111 vs 100
    expect(output).toContain('Inputs: 7, 4');
  });

  test('displays error messages for invalid string input', async ({ page }) => {
    await page.fill('#string1', 'abc');
    await page.fill('#string2', 'abcd');
    await page.click('button:has-text("Calculate"):near(#string1)');
    
    const output = await page.textContent('#string-demo');
    expect(output).toContain('Error:');
    expect(output).toContain('equal length');
  });

  test('visual differences are highlighted', async ({ page }) => {
    await page.fill('#string1', 'abc');
    await page.fill('#string2', 'axc');
    await page.click('button:has-text("Calculate"):near(#string1)');
    
    const output = await page.textContent('#string-demo');
    expect(output).toContain('Visual comparison');
    expect(output).toContain('≠'); // Difference marker
  });

  test('binary representation is shown for bit distance', async ({ page }) => {
    await page.fill('#int1', '5');
    await page.fill('#int2', '3');
    await page.click('button:has-text("Calculate"):near(#int1)');
    
    const output = await page.textContent('#bit-demo');
    expect(output).toContain('Binary:');
    expect(output).toContain('101'); // 5 in binary
    expect(output).toContain('011'); // 3 in binary
  });

  test('handles empty strings correctly', async ({ page }) => {
    await page.fill('#string1', '');
    await page.fill('#string2', '');
    await page.click('button:has-text("Calculate"):near(#string1)');
    
    const output = await page.textContent('#string-demo');
    expect(output).toContain('Result: 0');
  });

  test('handles zero values correctly', async ({ page }) => {
    await page.fill('#int1', '0');
    await page.fill('#int2', '0');
    await page.click('button:has-text("Calculate"):near(#int1)');
    
    const output = await page.textContent('#bit-demo');
    expect(output).toContain('Result: 0');
  });

  test('page structure and navigation', async ({ page }) => {
    // Check main headings are present
    await expect(page.locator('h1')).toContainText('Hamming');
    await expect(page.locator('h2')).toHaveCount(3); // String, Bit, About sections

    // Check input fields are visible and functional
    await expect(page.locator('#string1')).toBeVisible();
    await expect(page.locator('#string2')).toBeVisible();
    await expect(page.locator('#int1')).toBeVisible();
    await expect(page.locator('#int2')).toBeVisible();

    // Check output areas exist
    await expect(page.locator('#string-demo')).toBeVisible();
    await expect(page.locator('#bit-demo')).toBeVisible();
  });

  test('responsive design elements', async ({ page, isMobile }) => {
    // Basic responsiveness check - elements should be visible on mobile
    await expect(page.locator('#string1')).toBeVisible();
    await expect(page.locator('#int1')).toBeVisible();
    
    if (isMobile) {
      // On mobile, check that inputs are appropriately sized
      const string1 = page.locator('#string1');
      const boundingBox = await string1.boundingBox();
      expect(boundingBox?.width).toBeGreaterThan(100);
    }
  });
});