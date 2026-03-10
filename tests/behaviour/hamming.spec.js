import { test, expect } from '@playwright/test';

test.describe('Hamming Distance Library Website', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000'); // Assumes served on port 3000
  });

  test('displays library identity and title', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('#lib-name');
    
    // Check that library name and version are displayed
    const libName = await page.locator('#lib-name').textContent();
    const libVersion = await page.locator('#lib-version').textContent();
    
    expect(libName).toContain('Hamming Distance Library');
    expect(libVersion).toMatch(/repo@/); // Should show package name and version
    
    // Check page title
    await expect(page).toHaveTitle(/Hamming Distance Library|repo/);
  });

  test('string distance calculator works with default values', async ({ page }) => {
    // Wait for the demo section to be ready
    await page.waitForSelector('#string-result');
    
    // Check default values are set
    const string1 = await page.locator('#string1').inputValue();
    const string2 = await page.locator('#string2').inputValue();
    
    expect(string1).toBe('karolin');
    expect(string2).toBe('kathrin');
    
    // Click calculate button
    await page.click('button:has-text("Calculate"):near(#string1)');
    
    // Check that result appears
    const result = await page.locator('#string-result').textContent();
    expect(result).toContain('Distance: 3');
  });

  test('bits distance calculator works with default values', async ({ page }) => {
    // Wait for the demo section to be ready  
    await page.waitForSelector('#bits-result');
    
    // Check default values
    const int1 = await page.locator('#int1').inputValue();
    const int2 = await page.locator('#int2').inputValue();
    
    expect(int1).toBe('1');
    expect(int2).toBe('4');
    
    // Click calculate button
    await page.click('button:has-text("Calculate"):near(#int1)');
    
    // Check that result appears
    const result = await page.locator('#bits-result').textContent();
    expect(result).toContain('Distance: 2');
    expect(result).toContain('001'); // Binary representation
    expect(result).toContain('100');
  });

  test('string calculator handles custom input', async ({ page }) => {
    await page.waitForSelector('#string1');
    
    // Enter custom strings
    await page.fill('#string1', 'hello');
    await page.fill('#string2', 'world');
    
    // Calculate
    await page.click('button:has-text("Calculate"):near(#string1)');
    
    // Check result
    const result = await page.locator('#string-result').textContent();
    expect(result).toContain('Distance: 4');
  });

  test('string calculator shows error for unequal length strings', async ({ page }) => {
    await page.waitForSelector('#string1');
    
    // Enter strings of different lengths
    await page.fill('#string1', 'short');
    await page.fill('#string2', 'verylongstring');
    
    // Calculate
    await page.click('button:has-text("Calculate"):near(#string1)');
    
    // Check error message appears
    const result = await page.locator('#string-result').textContent();
    expect(result).toContain('Error:');
    expect(result).toContain('equal length');
  });

  test('bits calculator handles custom input', async ({ page }) => {
    await page.waitForSelector('#int1');
    
    // Enter custom numbers
    await page.fill('#int1', '5');
    await page.fill('#int2', '3');
    
    // Calculate  
    await page.click('button:has-text("Calculate"):near(#int1)');
    
    // Check result (5 = 101, 3 = 011, distance = 2)
    const result = await page.locator('#bits-result').textContent();
    expect(result).toContain('Distance: 2');
  });

  test('displays feature cards with examples', async ({ page }) => {
    // Check that all feature cards are present
    await expect(page.locator('.feature-card')).toHaveCount(4);
    
    // Check specific feature content
    await expect(page.locator('text=String Hamming Distance')).toBeVisible();
    await expect(page.locator('text=Bits Hamming Distance')).toBeVisible();
    await expect(page.locator('text=Input Validation')).toBeVisible();
    await expect(page.locator('text=Unicode Support')).toBeVisible();
    
    // Check examples are shown
    await expect(page.locator('text=hammingDistance("karolin", "kathrin")')).toBeVisible();
    await expect(page.locator('text=hammingDistanceBits(1, 4)')).toBeVisible();
  });

  test('contains link to repository', async ({ page }) => {
    const repoLink = page.locator('a[href="https://github.com/xn-intenton-z2a/repository0"]');
    await expect(repoLink).toBeVisible();
    await expect(repoLink).toContainText('repository');
  });
});