// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { encode, decode, createEncoding, listEncodings, encodeUUID, decodeUUID } from '../../src/lib/main.js';

function sampleBytes(len) {
  const a = new Uint8Array(len);
  for (let i = 0; i < len; i++) a[i] = (i * 37 + 13) & 0xff; // deterministic pseudo-random
  return a;
}

describe('Encodings', () => {
  test('round-trip fixed buffers for built-ins', () => {
    const encNames = listEncodings().map(e => e.name).filter(n => ['base62','base85','denser','base91'].includes(n));
    const lengths = [0, 1, 2, 16];
    for (const name of encNames) {
      for (const len of lengths) {
        const buf = sampleBytes(len);
        const out = encode(name, buf);
        const back = decode(name, out);
        expect(back).toEqual(buf);
      }
    }
  });

  test('edge cases: all-zero, all-0xFF, single byte', () => {
    const encNames = listEncodings().map(e => e.name).filter(n => ['base62','base85','denser'].includes(n));
    const cases = [new Uint8Array(16), new Uint8Array(16).fill(0xff), new Uint8Array([0x7f])];
    for (const name of encNames) {
      for (const c of cases) {
        expect(decode(name, encode(name, c))).toEqual(c);
      }
    }
  });

  test('custom encoding creation and round-trip', () => {
    const cs = '0123456789abcdef';
    createEncoding('testCustom', cs);
    const src = new Uint8Array([1,2,3,4,5]);
    expect(decode('testCustom', encode('testCustom', src))).toEqual(src);
  });

  test('uuid encoding lengths and densest < 22', () => {
    const uuid = '00112233-4455-6677-8899-aabbccddeeff';
    const encs = listEncodings().filter(e => ['base62','base85','base91','denser'].includes(e.name));
    const lengths = encs.map(e => ({ name: e.name, len: encodeUUID(e.name, uuid).length }));
    const names = lengths.map(l => l.name);
    expect(names).toContain('base62');
    expect(names).toContain('denser');
    const densest = Math.min(...lengths.map(l => l.len));
    expect(densest).toBeLessThan(22);
  });

  test('uuid round-trip via encodeUUID/decodeUUID', () => {
    const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    for (const e of listEncodings()) {
      const name = e.name;
      const enc = encodeUUID(name, uuid);
      const out = decodeUUID(name, enc);
      expect(out).toEqual(uuid.toLowerCase());
    }
  });
});
