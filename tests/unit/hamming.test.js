import { describe, it, expect } from 'vitest';
import { hammingDistanceString, hammingDistanceInt } from '../../src/lib/hamming.js';
import { hammingDistanceString as fromMainString, hammingDistanceInt as fromMainInt } from '../../src/lib/main.js';

describe('hammingDistanceString', () => {
  it('computes basic example', () => {
    expect(hammingDistanceString('karolin', 'kathrin')).toBe(3);
  });

  it('empty strings', () => {
    expect(hammingDistanceString('', '')).toBe(0);
  });

  it('unicode code points', () => {
    expect(hammingDistanceString('😊a', '😊b')).toBe(1);
  });

  it('throws on unequal lengths in strict mode', () => {
    expect(() => hammingDistanceString('abc', 'ab')).toThrow(TypeError);
    expect(() => hammingDistanceString('abc', 'ab')).toThrow(/length mismatch/);
  });

  it('permissive mode counts tail differences', () => {
    expect(hammingDistanceString('abc', 'ab', { permissive: true })).toBe(1);
  });

  it('main.js re-exports the functions', () => {
    expect(typeof fromMainString).toBe('function');
    expect(typeof fromMainInt).toBe('function');
  });
});

describe('hammingDistanceInt', () => {
  it('zero-zero', () => {
    expect(hammingDistanceInt(0, 0)).toBe(0);
  });

  it('1 vs 4 => 2 bits differ', () => {
    expect(hammingDistanceInt(1, 4)).toBe(2);
  });

  it('255 vs 0 => 8 bits', () => {
    expect(hammingDistanceInt(255, 0)).toBe(8);
  });

  it('bigint support', () => {
    const x = 2n ** 65n;
    expect(hammingDistanceInt(x, 0n)).toBe(1);
  });

  it('throws on negative inputs', () => {
    expect(() => hammingDistanceInt(-1, 0)).toThrow(TypeError);
    expect(() => hammingDistanceInt(1, -2)).toThrow(TypeError);
  });

  it('throws on non-integer numbers', () => {
    expect(() => hammingDistanceInt(1.5, 2)).toThrow(TypeError);
  });

  it('mixing Number and BigInt works', () => {
    expect(hammingDistanceInt(1, 4n)).toBe(2);
  });
});
