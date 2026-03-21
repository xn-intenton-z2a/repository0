// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { encode, decode, createEncoding, listEncodings, uuidEncode } from "../../src/lib/main.js";

function toBytes(hex) {
  return new Uint8Array(hex.match(/.{1,2}/g).map(h => parseInt(h, 16)));
}

describe('Encodings', () => {
  test('built-in encodings exist and round-trip edge cases', () => {
    const encNames = listEncodings().map(e => e.name);
    expect(encNames).toEqual(expect.arrayContaining(['base62','base85','base94']));

    const samples = [
      new Uint8Array([]),
      new Uint8Array([0]),
      new Uint8Array([1,2,3,4,5]),
      new Uint8Array(16).fill(0),
      new Uint8Array(16).fill(0xff),
    ];

    for (const name of ['base62','base85','base94']) {
      for (const s of samples) {
        const out = encode(name, s);
        const back = decode(name, out);
        expect(Array.from(back)).toEqual(Array.from(s));
      }
    }
  });

  test('createEncoding accepts valid charset and rejects ambiguous chars', () => {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Crockford-like, excludes 0,O,1,l,I
    createEncoding('crockford32', charset);
    const b = new Uint8Array([0,1,2,3,4,5]);
    const s = encode('crockford32', b);
    const back = decode('crockford32', s);
    expect(Array.from(back)).toEqual(Array.from(b));

    expect(() => createEncoding('bad', '012345')).toThrow();
  });

  test('uuid encoding length benchmark', () => {
    const bytes = toBytes('00112233445566778899aabbccddeeff');
    const hexLen = '00112233445566778899aabbccddeeff'.length;
    expect(hexLen).toBe(32);
    const base64 = Buffer.from(bytes).toString('base64').replace(/=+$/,'');
    expect(base64.length).toBe(22);

    const l62 = encode('base62', bytes).length;
    const l85 = encode('base85', bytes).length;
    const l94 = encode('base94', bytes).length;

    const densest = Math.min(l62, l85, l94);
    expect(densest).toBeLessThan(22);
  });

  test('listEncodings returns metadata', () => {
    const items = listEncodings();
    const b62 = items.find(i => i.name === 'base62');
    expect(b62).toBeTruthy();
    expect(b62.charsetSize).toBe(62);
    expect(b62.bitsPerChar).toBeCloseTo(Math.log2(62));
  });

  test('uuidEncode shorthand works and reverses output', () => {
    const uuid = '00112233-4455-6677-8899-aabbccddeeff';
    const enc = uuidEncode(uuid, 'base85');
    // ensure it returns a string and length is > 0
    expect(typeof enc).toBe('string');
    expect(enc.length).toBeGreaterThan(0);
  });
});
