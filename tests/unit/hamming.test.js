import { describe, it, expect } from 'vitest';
import { hamming } from '../../src/lib/main.js';

describe('hamming()', () => {
  it('returns 0 for identical strings', () => {
    expect(hamming('abc','abc')).toBe(0);
  });
  it('counts single difference', () => {
    expect(hamming('abc','abd')).toBe(1);
  });
  it('binary-like strings', () => {
    expect(hamming('101010','010101')).toBe(6);
  });
  it('works for Uint8Array', () => {
    expect(hamming(new Uint8Array([1,2,3]), new Uint8Array([1,4,3]))).toBe(1);
  });
  it('throws on different lengths with message containing length', () => {
    expect(() => hamming('a','bb')).toThrow(TypeError);
    expect(() => hamming('a','bb')).toThrow(/length/);
  });
  it('throws on invalid types', () => {
    expect(() => hamming(123, 123)).toThrow(TypeError);
    expect(() => hamming({}, {})).toThrow(TypeError);
  });
  it('handles empty strings', () => {
    expect(hamming('','')).toBe(0);
  });
  it('handles large buffers', () => {
    const n = 1e5;
    const a = new Uint8Array(n);
    const b = new Uint8Array(n);
    a[100] = 1; b[200] = 1;
    expect(hamming(a,b)).toBe(2);
  });
});
