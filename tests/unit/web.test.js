import { describe, it, expect } from 'vitest';
import { readFile } from 'fs/promises';

describe('Website HTML structure', () => {
  it('index.html contains identity placeholders and imports lib-main.js', async () => {
    const html = await readFile('src/web/index.html', 'utf8');
    expect(html).toContain('id="lib-name"');
    expect(html).toContain('id="lib-version"');
    expect(html).toContain('id="demo-output"');
    expect(html).toContain("./lib-main.js");
  });
});
