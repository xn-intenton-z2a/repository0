import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { main } from '../../src/lib/main.js';

const out = path.resolve('examples', 'test-sin.svg');

afterEach(async () => {
  try {
    await fs.rm(out);
  } catch (e) {
    // ignore
  }
});

describe('plot CLI', () => {
  it('generates an SVG for y=sin(x)', async () => {
    const res = await main(['--expression', 'y=sin(x)', '--range', 'x=0:6.283:0.1', '--file', out, '--format', 'svg']);
    const content = await fs.readFile(out, 'utf8');
    expect(content).toContain('<svg');
    expect(content).toContain('<path');
    expect(res.file).toBe(out);
    expect(res.format).toBe('svg');
    expect(res.points).toBeGreaterThan(0);
  });
});
