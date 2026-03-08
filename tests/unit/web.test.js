import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('web demo structure', () => {
  it('index.html contains expected elements', () => {
    const html = fs.readFileSync('src/web/index.html','utf8');
    expect(html).toContain('id="num-input"');
    expect(html).toContain('id="num-convert"');
    expect(html).toContain('id="num-output"');
    expect(html).toContain('id="roman-input"');
    expect(html).toContain('id="roman-convert"');
    expect(html).toContain('id="roman-output"');
  });
});
