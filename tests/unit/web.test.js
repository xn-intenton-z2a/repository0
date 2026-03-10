import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

describe('web index structure', () => {
  it('contains expected identity elements and demo script', () => {
    const html = readFileSync(new URL('../../src/web/index.html', import.meta.url), 'utf8');
    expect(html).toContain('id="lib-name"');
    expect(html).toContain('id="lib-version"');
    expect(html).toContain('id="demo-output"');
    expect(html).toContain('demo.js');
  });
});
