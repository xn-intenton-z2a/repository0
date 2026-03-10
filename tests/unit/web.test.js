import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('web index.html structure and wiring', () => {
  it('contains expected elements and imports', async () => {
    const html = fs.readFileSync(path.resolve('src/web/index.html'), 'utf8');
    expect(html).toContain('id="lib-name"');
    expect(html).toContain('id="lib-version"');
    expect(html).toContain('id="demo-output"');
    expect(html).toContain("import('./lib-meta.js')");
    expect(html).toContain("import('./browser-lib.js')");
  });

  it('browser-lib exports fizzBuzz function', async () => {
    const browserLib = await import('../../src/web/browser-lib.js');
    expect(typeof browserLib.fizzBuzz).toBe('function');
    const out = browserLib.fizzBuzz(5);
    expect(out).toEqual(['1','2','Fizz','4','Buzz']);
  });
});
