// SPDX-License-Identifier: MIT
import { describe, it, expect } from 'vitest';
import * as lib from '../../src/lib/main.js';

function u8(arr) { return new Uint8Array(arr); }

describe('encoding.spec - exports and round-trip behavior', () => {
  it('exports required API', () => {
    expect(typeof lib.encode).toBe('function');
    expect(typeof lib.decode).toBe('function');
    expect(typeof lib.listEncodings).toBe('function');
    expect(typeof lib.createEncoding).toBe('function');
    expect(typeof lib.encodeUUID).toBe('function');
    expect(typeof lib.decodeUUID).toBe('function');
  });

  const cases = [
    u8([]),
    u8([0]),
    u8([0,0,0,0]),
    u8([255,255,255,255]),
    u8([1]),
    u8([0,255,1,2,3]),
    u8([0x00,0x11,0x22,0x33,0x44,0x55,0x66,0x77,0x88,0x99,0xaa,0xbb,0xcc,0xdd,0xee,0xff])
  ];

  const encNames = lib.listEncodings().map(e => e.name);

  it('encode/decode round-trips for all built-in encodings across edge cases', () => {
    for (const name of encNames) {
      for (const c of cases) {
        const s = lib.encode(c, name);
        const back = lib.decode(s, name);
        expect(Array.from(back)).toEqual(Array.from(c));
      }
    }
  });

  it('empty buffer behavior and all-zero buffer behavior', () => {
    const empty = u8([]);
    for (const name of encNames) {
      const s = lib.encode(empty, name);
      expect(s).toBe('');
      const back = lib.decode(s, name);
      expect(back.length).toBe(0);
    }

    const zeros = u8([0,0,0,0,0]);
    for (const e of lib.listEncodings()) {
      const s = lib.encode(zeros, e.name);
      expect(s.length).toBe(5);
      const back = lib.decode(s, e.name);
      expect(Array.from(back)).toEqual(Array.from(zeros));
    }
  });

  it('densest encoding produces fewer than 22 characters for a UUID', () => {
    const uuid = '00112233-4455-6677-8899-aabbccddeeff';
    const densest = lib.listEncodings().find(e => e.name === 'densest');
    expect(densest).toBeTruthy();
    const s = lib.encodeUUID(uuid, 'densest');
    expect(s.length).toBeLessThan(22);
  });
});
