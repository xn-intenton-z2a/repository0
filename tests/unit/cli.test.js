// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const script = path.resolve('src/lib/main.js');

describe('CLI', () => {
  test('no args prints usage and exits 0', () => {
    const res = spawnSync(process.execPath, [script], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('Usage');
  });

  test('invalid arg prints error and exits non-zero', () => {
    const res = spawnSync(process.execPath, [script, 'not-a-number'], { encoding: 'utf8' });
    expect(res.status).not.toBe(0);
    expect(res.stderr).toContain('Error');
  });

  test('valid arg prints 15 lines for 15 and exits 0', () => {
    const res = spawnSync(process.execPath, [script, '15'], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    const lines = res.stdout.trim().split('\n');
    expect(lines.length).toBe(15);
    expect(lines[14]).toBe('FizzBuzz');
  });
});
