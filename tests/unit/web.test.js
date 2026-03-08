import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('web demo structure', () => {
  it('index.html contains expected elements', () => {
    const html = fs.readFileSync('src/web/index.html', 'utf8');
    expect(html).toContain('id="input-a"');
    expect(html).toContain('id="input-b"');
    expect(html).toContain('id="compute-btn"');
    expect(html).toContain('id="result"');
  });
});
