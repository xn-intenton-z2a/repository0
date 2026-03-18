// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { isMissionComplete } from '../../src/lib/main.js';

describe('isMissionComplete', () => {
  test('returns false when passed != total', () => {
    expect(isMissionComplete({ passed: 0, total: 7 })).toBe(false);
  });

  test('returns true when passed === total', () => {
    expect(isMissionComplete({ passed: 7, total: 7 })).toBe(true);
  });

  test('throws when passed > total', () => {
    expect(() => isMissionComplete({ passed: 8, total: 7 })).toThrow(/invalid|greater than total/i);
  });

  test('throws when passed is NaN', () => {
    expect(() => isMissionComplete({ passed: NaN, total: 7 })).toThrow(/invalid/i);
  });
});
