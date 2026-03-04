import { describe, it, expect } from 'vitest';
import fs from 'fs/promises';
import { parseRange, prepareExpression, generateSeries, createSVG, plotFromArgs } from '../../src/lib/plot.js';

describe('plot library', () => {
  it('parses ranges and defaults', () => {
    expect(parseRange(undefined)).toEqual({ start: -1, end: 1, count: 200 });
    expect(parseRange('x=0:3.1416:5')).toEqual({ start: 0, end: 3.1416, count: 5 });
  });

  it('prepares expressions', () => {
    expect(prepareExpression('y=sin(x)')).toBe('sin(x)');
    expect(prepareExpression('sin(x)')).toBe('sin(x)');
  });

  it('generates a sin series', () => {
    const range = { start: 0, end: Math.PI, count: 5 };
    const pts = generateSeries('sin(x)', range);
    expect(pts.length).toBe(5);
    // sin(0)=0, sin(pi)=0, middle approx 1
    const y0 = pts[0].y;
    const yMid = pts[2].y;
    const yEnd = pts[4].y;
    expect(Math.abs(y0)).toBeLessThan(1e-6);
    expect(Math.abs(yEnd)).toBeLessThan(1e-6);
    expect(yMid).toBeGreaterThan(0.9);
  });

  it('creates an svg string', () => {
    const pts = generateSeries('x', { start: -1, end: 1, count: 10 });
    const svg = createSVG(pts, { width: 300, height: 150, padding: 10 });
    expect(typeof svg).toBe('string');
    expect(svg.startsWith('<?xml')).toBe(true);
    expect(svg).toContain('<svg');
    expect(svg).toContain('<path');
  });

  it('writes svg file via plotFromArgs', async () => {
    const out = 'tests/unit/out_test.svg';
    try {
      const res = await plotFromArgs({ expression: 'sin(x)', range: 'x=0:6.283:50', file: out });
      expect(res.file).toBe(out);
      const contents = await fs.readFile(out, 'utf8');
      expect(contents).toContain('<svg');
    } finally {
      // cleanup
      try { await fs.unlink(out); } catch (e) {}
    }
  });
});
