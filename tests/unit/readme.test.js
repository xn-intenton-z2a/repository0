// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs';

const README = readFileSync('./README.md', 'utf8');

describe('README content', () => {
  test('contains UUID encoding comparison table entries', () => {
    expect(README).toContain('base62');
    expect(README).toContain('base85');
    expect(README).toContain('base91');
    expect(README).toContain('denser');
    expect(README).toMatch(/\| base64 .*22/);
  });
});
