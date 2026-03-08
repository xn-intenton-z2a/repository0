import { describe, it, expect } from 'vitest';
import { listEncodings } from '../../src/lib/main.js';

describe('uuid encoding comparison', () => {
  it('built-ins present and densities computed', () => {
    const encs = listEncodings();
    const names = encs.map(e=>e.name);
    expect(names).toEqual(expect.arrayContaining(['base62','base85','base91']));
    for (const e of encs) {
      expect(typeof e.bitsPerChar).toBe('number');
      expect(e.charsetLength).toBeGreaterThanOrEqual(2);
      expect(e.uuidLength).toBeGreaterThanOrEqual(1);
      // uuidLength matches ceil(128 / bitsPerChar) within tolerance
      const calc = Math.ceil(128 / e.bitsPerChar);
      expect(e.uuidLength).toBe(calc);
    }
    // densest encoding should be shorter than base64's 24
    const densest = encs.reduce((a,b)=> a.uuidLength <= b.uuidLength ? a : b);
    expect(densest.uuidLength).toBeLessThan(24);
  });
});
