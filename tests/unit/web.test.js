// SPDX-License-Identifier: MIT
import { readFile } from 'fs/promises';
import { describe, it, expect } from 'vitest';
import * as lib from '../../src/lib/main.js';

describe('web files', () => {
  it('lib.js re-exports the encoding API', async () => {
    const libText = await readFile('src/web/lib.js', 'utf8');
    expect(libText).toContain('encode, decode, createEncoding, listEncodings, encodeUUID, decodeUUID');
  });

  it('index.html imports lib.js via module import', async () => {
    const html = await readFile('src/web/index.html', 'utf8');
    expect(html).toContain("await import('./lib.js')");
    expect(html).toContain('id="lib-version"');
  });

  it('UUID encoding comparison computed by library matches expectations', () => {
    const encs = lib.listEncodings();
    expect(Array.isArray(encs)).toBe(true);
    const names = encs.map(e => e.name);
    expect(names).toEqual(expect.arrayContaining(['base62','base85','base91','densest']));

    const uuid = '00112233-4455-6677-8899-aabbccddeeff';
    const lengths = {};
    for (const e of encs) {
      const s = lib.encodeUUID(uuid, e.name);
      lengths[e.name] = s.length;
      expect(Number.isInteger(s.length)).toBe(true);
    }

    expect(lengths['densest']).toBeLessThan(22);
  });
});
