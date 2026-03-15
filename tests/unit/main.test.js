// SPDX-License-Identifier: MIT
import { describe, it, expect } from 'vitest';
import { encode, decode, createEncoding, listEncodings, encodeUUID, decodeUUID } from '../../src/lib/main.js';

function u8(arr) { return new Uint8Array(arr); }

describe('encoding round-trip and UUID helpers', () => {
  const cases = [
    u8([]),
    u8([0]),
    u8([0,0,0,0]),
    u8([255,255,255,255]),
    u8([1]),
    u8([0,255,1,2,3])
  ];

  const encNames = listEncodings().map(e => e.name);

  it('round-trips various buffers for all built-in encodings', () => {
    for (const name of encNames) {
      for (const c of cases) {
        const out = encode(c, name);
        const back = decode(out, name);
        expect(Array.from(back)).toEqual(Array.from(c));
      }
    }
  });

  it('createEncoding rejects ambiguous and control characters', () => {
    expect(() => createEncoding('abc0def')).toThrow(); // contains '0'
    expect(() => createEncoding('ab\u0001cd')).toThrow(); // control char
  });

  it('encodeUUID and decodeUUID are consistent and densest is shorter than base64 no-padding', () => {
    const uuid = '00112233-4455-6677-8899-aabbccddeeff';
    const lengths = {};
    for (const e of listEncodings()) {
      const enc = encodeUUID(uuid, e.name);
      lengths[e.name] = enc.length;
      const back = decodeUUID(enc, e.name);
      expect(back).toBe('00112233-4455-6677-8899-aabbccddeeff');
    }
    // baseline base64 no padding length for 16 bytes is 22
    const densestLen = lengths['densest'];
    expect(densestLen).toBeLessThan(22);
  });
});
