// tests/unit/web.test.js
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

import * as browserLib from '../../src/web/browser-lib.js';
import { fizzBuzz as coreFizz } from '../../src/lib/main.js';

describe('Web demo wiring', () => {
  it('index.html contains demo elements', () => {
    const html = fs.readFileSync(path.resolve('src/web/index.html'), 'utf8');
    expect(html).toContain('id="demo-output"');
    expect(html).toContain('id="lib-name"');
    expect(html).toContain('id="lib-version"');
  });

  it('browser-lib re-exports core fizzBuzz', () => {
    const a = browserLib.fizzBuzz(5);
    const b = coreFizz(5);
    expect(a).toEqual(b);
  });
});
