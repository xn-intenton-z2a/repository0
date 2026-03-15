// SPDX-License-Identifier: MIT
import { readFile } from 'fs/promises';
import { describe, it, expect } from 'vitest';

describe('web files', () => {
  it('lib.js re-exports the encoding API', async () => {
    const lib = await readFile('src/web/lib.js', 'utf8');
    expect(lib).toContain('encode, decode, createEncoding, listEncodings, encodeUUID, decodeUUID');
  });

  it('index.html imports lib.js via module import', async () => {
    const html = await readFile('src/web/index.html', 'utf8');
    expect(html).toContain("await import('./lib.js')");
    expect(html).toContain('id="lib-version"');
  });
});
