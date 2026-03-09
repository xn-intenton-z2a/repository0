import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import path from 'path';

const node = process.execPath;
const script = path.join(process.cwd(), 'src', 'lib', 'main.js');

describe('CLI', () => {
  it('help returns exit 0 and prints usage', () => {
    const res = spawnSync(node, [script, '--help'], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout).toMatch(/Usage:/);
  });

  it('fizz 15 prints 15 lines and last line FizzBuzz', () => {
    const res = spawnSync(node, [script, 'fizz', '15'], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    const out = res.stdout.trim().split('\n');
    expect(out.length).toBe(15);
    expect(out[14]).toBe('FizzBuzz');
  });

  it('--json returns JSON array', () => {
    const res = spawnSync(node, [script, 'fizz', '5', '--json'], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    const parsed = JSON.parse(res.stdout);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[2]).toBe('Fizz');
  });

  it('fizz-single 0 returns exit code 3 (RangeError)', () => {
    const res = spawnSync(node, [script, 'fizz-single', '0'], { encoding: 'utf8' });
    expect(res.status).toBe(3);
  });

  it('fizz 1.5 returns exit code 2 (TypeError)', () => {
    const res = spawnSync(node, [script, 'fizz', '1.5'], { encoding: 'utf8' });
    expect(res.status).toBe(2);
  });
});
