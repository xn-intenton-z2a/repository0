import { spawnSync } from 'child_process';
import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'url';

const node = process.execPath;
const script = fileURLToPath(new URL('../../src/lib/main.js', import.meta.url));

function run(args) {
  return spawnSync(node, [script, ...args], { encoding: 'utf8' });
}

describe('CLI e2e', () => {
  it('--single 3 prints Fizz and exits 0', () => {
    const res = run(['--single', '3']);
    expect(res.status).toBe(0);
    expect(res.stdout).toBe('Fizz\n');
    expect(res.stderr).toBe('');
  });

  it('--range 15 prints 15 lines with last FizzBuzz', () => {
    const res = run(['--range', '15']);
    expect(res.status).toBe(0);
    expect(res.stderr).toBe('');
    const lines = res.stdout.trim().split('\n');
    expect(lines.length).toBe(15);
    expect(lines[14]).toBe('FizzBuzz');
  });

  it('invalid non-integer input exits non-zero and prints error', () => {
    const res = run(['--single', '3.5']);
    expect(res.status).not.toBe(0);
    expect(res.stderr.length).toBeGreaterThan(0);
  });
});
