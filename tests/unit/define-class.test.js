// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { createOntology } from '../../src/lib/main.js';

describe('defineClass', () => {
  test("defineClass('Animal') returns object with name", () => {
    const o = createOntology();
    const c = o.defineClass('Animal');
    expect(c).toBeTruthy();
    expect(c.name).toBe('Animal');
  });

  test('empty name throws TypeError starting with "class name"', () => {
    const o = createOntology();
    expect(() => o.defineClass('')).toThrow(/^class name/);
  });

  test('calling defineClass twice returns same object', () => {
    const o = createOntology();
    const a = o.defineClass('Animal');
    const b = o.defineClass('Animal');
    expect(a).toBe(b);
  });
});
