import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import path from 'path';

const node = process.execPath;
const script = path.resolve('src/lib/main.js');

describe('CLI', () => {
  it('string mode: karolin vs kathrin => 3', () => {
    const res = spawnSync(node, [script, 'string', 'karolin', 'kathrin'], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout.trim()).toBe('3');
  });

  it('bits mode: 1 vs 4 => 2', () => {
    const res = spawnSync(node, [script, 'bits', '1', '4'], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout.trim()).toBe('2');
  });

  it('invalid invocation prints usage and exits 2', () => {
    const res = spawnSync(node, [script, 'string', 'only-one-arg'], { encoding: 'utf8' });
    expect(res.status).toBe(2);
    expect(res.stderr).toMatch(/Usage:/);
  });
});
