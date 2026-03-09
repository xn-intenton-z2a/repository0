import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { describe, it, expect } from 'vitest';

describe('web index structure', () => {
  const html = readFileSync(new URL('../../src/web/index.html', import.meta.url), 'utf-8');
  const dom = new JSDOM(html);

  it('has expected elements and module script', () => {
    const { document } = dom.window;
    expect(document.getElementById('lib-name')).toBeTruthy();
    expect(document.getElementById('lib-version')).toBeTruthy();
    expect(document.getElementById('demo-output')).toBeTruthy();
    const scripts = Array.from(document.querySelectorAll('script[type="module"]')).map(s => s.getAttribute('src'));
    expect(scripts).toContain('./demo.js');
  });
});
