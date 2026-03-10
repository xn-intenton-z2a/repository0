import { describe, it, expect } from 'vitest';
import { readFile } from 'fs/promises';
import { JSDOM } from 'jsdom';

describe('web index structure', () => {
  it('has required elements and script imports', async () => {
    const html = await readFile('src/web/index.html', 'utf8');
    // Parse without executing scripts to avoid external imports during unit tests
    const dom = new JSDOM(html);
    const { document } = dom.window;
    expect(document.getElementById('lib-name')).toBeTruthy();
    expect(document.getElementById('lib-version')).toBeTruthy();
    expect(document.getElementById('demo-output')).toBeTruthy();
    // ensure demo-output placeholder exists
    const output = document.getElementById('demo-output').textContent || '';
    expect(output.length).toBeGreaterThanOrEqual(0);
    // check that index.html references lib-browser.js
    expect(html).toMatch(/lib-browser\.js/);
  });
});
