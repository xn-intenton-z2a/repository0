import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import path from 'path';

const CLI = path.resolve('src/lib/hamming-cli.js');

describe('hamming-cli', () => {
  it('string mode: karolin vs kathrin -> 3', () => {
    const res = spawnSync(process.execPath, [CLI, 'string', 'karolin', 'kathrin'], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout.trim()).toBe('3');
    expect(res.stderr).toBe('');
  });

  it('bits mode: 1 vs 4 -> 2', () => {
    const res = spawnSync(process.execPath, [CLI, 'bits', '1', '4'], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout.trim()).toBe('2');
    expect(res.stderr).toBe('');
  });

  it('string mode: unequal lengths -> TypeError and non-zero exit code', () => {
    const res = spawnSync(process.execPath, [CLI, 'string', 'abc', 'ab'], { encoding: 'utf8' });
    // Library currently throws TypeError for length mismatch; CLI maps TypeError -> exit code 2
    expect(res.status).toBe(2);
    expect(res.stderr).toMatch(/TypeError/);
  });

  it('bits mode: non-integer -> TypeError and non-zero exit code', () => {
    const res = spawnSync(process.execPath, [CLI, 'bits', '3.5', '2'], { encoding: 'utf8' });
    expect(res.status).toBe(2);
    expect(res.stderr).toMatch(/TypeError/);
  });

  it('string mode: empty strings -> 0', () => {
    const res = spawnSync(process.execPath, [CLI, 'string', '', ''], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout.trim()).toBe('0');
  });
});
