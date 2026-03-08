import { describe, it, expect } from 'vitest';
import def, { hamming } from '../../src/lib/main.js';

describe('hamming()', () => {
  it('returns 0 for identical strings', () => {
    expect(hamming('abc', 'abc')).toBe(0);
  });

  it('returns 1 for abc vs abd', () => {
    expect(hamming('abc', 'abd')).toBe(1);
  });

  it('works for binary-like strings', () => {
    expect(hamming('101010', '010101')).toBe(6);
  });

  it('works for Uint8Array inputs', () => {
    expect(hamming(new Uint8Array([1,2,3]), new Uint8Array([1,4,3]))).toBe(1);
  });

  it('throws TypeError for different lengths (strings)', () => {
    expect(() => hamming('a', 'ab')).toThrow(TypeError);
    expect(() => hamming('a', 'ab')).toThrow(/length/);
  });

  it('throws TypeError for different lengths (bytes)', () => {
    expect(() => hamming(new Uint8Array([1]), new Uint8Array([1,2]))).toThrow(TypeError);
    expect(() => hamming(new Uint8Array([1]), new Uint8Array([1,2]))).toThrow(/length/);
  });

  it('throws TypeError for invalid inputs', () => {
    expect(() => hamming(1, 2)).toThrow(TypeError);
    expect(() => hamming({}, {})).toThrow(TypeError);
  });

  it('empty strings return 0', () => {
    expect(hamming('', '')).toBe(0);
  });

  it('handles large buffers efficiently', () => {
    const n = 100000;
    const a = new Uint8Array(n);
    const b = new Uint8Array(n);
    a[0] = 1; b[0] = 2;
    expect(hamming(a, b)).toBe(1);
  });

  it('default export exposes hamming', () => {
    expect(typeof def.hamming).toBe('function');
    expect(def.hamming('x','x')).toBe(0);
  });
});
