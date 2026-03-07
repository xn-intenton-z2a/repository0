import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistance (Unicode, code-point aware)', () => {
  it('handles ASCII example (karolin vs kathrin)', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('returns 0 for empty strings', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws TypeError for non-strings', () => {
    expect(() => hammingDistance(null, 'a')).toThrow(TypeError);
    expect(() => hammingDistance('a', 123)).toThrow(TypeError);
  });

  it('normalizes NFC/NFD so combining marks compare equal', () => {
    const a = 'e\u0301'; // e + combining acute (NFD)
    const b = '\u00e9'; // é (NFC)
    expect(hammingDistance(a, b)).toBe(0);
  });

  it('compares emoji code points correctly', () => {
    expect(hammingDistance('🙂', '🙃')).toBe(1);
  });

  it('throws RangeError when lengths differ after normalization', () => {
    const a = 'a';
    const b = 'ab';
    expect(() => hammingDistance(a, b)).toThrow(RangeError);
    // 'e\u0301' normalizes to 'é' and compared to 'e' has same length -> distance 1
    expect(hammingDistance('e\u0301', 'e')).toBe(1);
  });
});

describe('hammingDistanceBits (binary sequences)', () => {
  it('supports Buffer and Uint8Array and ArrayBuffer', () => {
    const b1 = Buffer.from([0x00, 0xff]);
    const b2 = new Uint8Array([0xff, 0x00]);
    expect(hammingDistanceBits(b1, b2)).toBe(16);

    const a1 = new ArrayBuffer(2);
    const v1 = new Uint8Array(a1);
    v1[0] = 0b10101010;
    v1[1] = 0b01010101;
    const v2 = new Uint8Array([0b01010101, 0b10101010]);
    expect(hammingDistanceBits(a1, v2)).toBe(16);
  });

  it('table-driven single-byte cases', () => {
    const cases = [
      [[0x00], [0xff], 8],
      [[0x00], [0x00], 0],
      [[0x0f], [0xf0], 8],
      [[0x01], [0x03], 1],
      [[0x55], [0xaa], 8],
    ];
    for (const [xa, ya, expected] of cases) {
      const x = Buffer.from(xa);
      const y = Buffer.from(ya);
      expect(hammingDistanceBits(x, y)).toBe(expected);
    }
  });

  it('multi-byte random cases match brute-force bit counting', () => {
    function bruteCount(x, y) {
      let s = 0;
      for (let i = 0; i < x.length; i++) {
        let v = x[i] ^ y[i];
        for (let b = 0; b < 8; b++) {
          s += (v >> b) & 1;
        }
      }
      return s;
    }
    const len = 32;
    const x = new Uint8Array(len);
    const y = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      x[i] = Math.floor(Math.random() * 256);
      y[i] = Math.floor(Math.random() * 256);
    }
    expect(hammingDistanceBits(x, y)).toBe(bruteCount(x, y));
  });

  it('returns 0 for empty inputs', () => {
    expect(hammingDistanceBits(Buffer.from([]), new Uint8Array([]))).toBe(0);
  });

  it('throws TypeError for unsupported types and RangeError for length mismatch', () => {
    expect(() => hammingDistanceBits('abc', 'def')).toThrow(TypeError);
    expect(() => hammingDistanceBits(Buffer.from([0x00]), Buffer.from([0x00, 0x00]))).toThrow(RangeError);
  });

  it('small performance test for large inputs (keeps reasonable runtime)', () => {
    const len = 10000; // 10k bytes
    const x = new Uint8Array(len);
    const y = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      x[i] = i & 0xff;
      y[i] = (~i) & 0xff;
    }
    // run once; we don't assert a strict time, but function should complete
    const out = hammingDistanceBits(x, y);
    expect(typeof out).toBe('number');
    expect(out).toBeGreaterThan(0);
  });
});
