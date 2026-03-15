// SPDX-License-Identifier: MIT
import { describe, it, expect } from 'vitest';
import { readFile } from 'fs/promises';
import * as lib from '../../src/lib/main.js';

function u8(arr) { return new Uint8Array(arr); }

describe('encodings library - exports and metadata', () => {
  it('exports expected named functions', () => {
    expect(typeof lib.encode).toBe('function');
    expect(typeof lib.decode).toBe('function');
    expect(typeof lib.createEncoding).toBe('function');
    expect(typeof lib.listEncodings).toBe('function');
    expect(typeof lib.encodeUUID).toBe('function');
    expect(typeof lib.decodeUUID).toBe('function');
  });

  it('listEncodings returns metadata for built-ins', () => {
    const encs = lib.listEncodings();
    expect(Array.isArray(encs)).toBe(true);
    const names = encs.map(e => e.name);
    expect(names).toEqual(expect.arrayContaining(['base62','base85','base91','densest']));
    for (const e of encs) {
      expect(typeof e.name).toBe('string');
      expect(typeof e.bitsPerChar).toBe('number');
      expect(typeof e.charset).toBe('string');
      expect(typeof e.charsetSize).toBe('number');
      expect(e.charset.length).toBe(e.charsetSize);
    }
  });
});

describe('round-trip encode/decode across edge cases', () => {
  const cases = [
    u8([]),
    u8([0]),
    u8([0,0,0,0]),
    u8([255,255,255,255]),
    u8([1]),
    u8([0,255,1,2,3]),
    // 16 bytes random-ish
    u8([0x00,0x11,0x22,0x33,0x44,0x55,0x66,0x77,0x88,0x99,0xaa,0xbb,0xcc,0xdd,0xee,0xff])
  ];

  const encNames = lib.listEncodings().map(e => e.name);

  it('built-in encodings round-trip for all edge cases', () => {
    for (const name of encNames) {
      for (const c of cases) {
        const out = lib.encode(c, name);
        const back = lib.decode(out, name);
        expect(Array.from(back)).toEqual(Array.from(c));
      }
    }
  });

  it('custom encoding can be created and round-trips', () => {
    const densest = lib.listEncodings().find(e => e.name === 'densest');
    expect(densest).toBeTruthy();
    // take a subset of the densest charset to form a custom alphabet
    const subset = densest.charset.slice(0, 48);
    const created = lib.createEncoding(subset, 'test-custom-1');
    expect(created.name).toBe('test-custom-1');
    for (const c of cases) {
      const s = lib.encode(c, created.name);
      const back = lib.decode(s, created.name);
      expect(Array.from(back)).toEqual(Array.from(c));
    }
  });

  it('empty buffer encodes to empty string and decodes back', () => {
    const empty = u8([]);
    for (const name of encNames) {
      const s = lib.encode(empty, name);
      expect(s).toBe('');
      const back = lib.decode(s, name);
      expect(back.length).toBe(0);
    }
  });

  it('all-zero buffer encodes as repeated first-char and decodes back', () => {
    const zeros = u8([0,0,0,0,0]);
    for (const e of lib.listEncodings()) {
      const s = lib.encode(zeros, e.name);
      expect(s.length).toBe(5);
      const back = lib.decode(s, e.name);
      expect(Array.from(back)).toEqual(Array.from(zeros));
    }
  });
});

describe('UUID shorthand and comparison across encodings', () => {
  const uuid = '00112233-4455-6677-8899-aabbccddeeff';
  it('encodeUUID strips dashes and decodeUUID restores canonical form', () => {
    for (const e of lib.listEncodings()) {
      const enc = lib.encodeUUID(uuid, e.name);
      const back = lib.decodeUUID(enc, e.name);
      expect(back).toBe(uuid);
    }
  });

  it('reverse option encodes reversed bytes and decodes with reverse', () => {
    for (const e of lib.listEncodings()) {
      const enc = lib.encodeUUID(uuid, e.name, { reverse: true });
      const back = lib.decodeUUID(enc, e.name, { reverse: true });
      expect(back).toBe(uuid);
    }
  });

  it('densest encoding produces fewer than 22 characters for a UUID and is minimal', () => {
    const encs = lib.listEncodings();
    const lengths = {};
    for (const e of encs) {
      const s = lib.encodeUUID(uuid, e.name);
      lengths[e.name] = s.length;
      expect(Number.isInteger(s.length)).toBe(true);
    }
    const densestLen = lengths['densest'];
    expect(densestLen).toBeLessThan(22);

    // densest should be the minimal length among registered encodings
    const minLen = Math.min(...Object.values(lengths));
    expect(densestLen).toBe(minLen);
  });
});

describe('documentation check', () => {
  it('README includes UUID encoding comparison table', async () => {
    const readme = await readFile('README.md', 'utf8');
    expect(readme).toContain('UUID encoding comparison');
    expect(readme).toContain('| hex |');
    expect(readme).toContain('base64');
  });
});
