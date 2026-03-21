// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs';
import { fizzBuzz } from '../../src/lib/main.js';

describe('README examples', () => {
  test('README mentions fizzBuzz and example runs', () => {
    const readme = readFileSync('README.md', 'utf8');
    expect(readme).toContain('fizz-buzz');
    // run a small smoke example to ensure examples in docs are executable
    const out = fizzBuzz(5);
    expect(out).toEqual(['1','2','Fizz','4','Buzz']);
  });
});
