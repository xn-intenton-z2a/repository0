import { describe, it, expect } from 'vitest';
import { parseRange, generateSeries, createSVG, prepareExpression } from '../../src/lib/plot.js';

describe('plot utilities', () => {
  it('parses ranges correctly', () => {
    const r = parseRange('x=0:3.14159:3');
    expect(r.start).toBeCloseTo(0);
    expect(r.end).toBeCloseTo(3.14159);
    expect(r.count).toBe(3);
  });

  it('prepares expressions and generates series', () => {
    const expr = 'y=sin(x)';
    const rhs = prepareExpression(expr);
    expect(rhs).toBe('sin(x)');
    const r = { start: 0, end: Math.PI, count: 3 };
    const s = generateSeries(expr, r);
    expect(s.length).toBe(3);
    // y at 0 ~= 0, at pi/2 ~=1, at pi ~=0
    expect(s[0].y).toBeCloseTo(0, 5);
    expect(s[1].y).toBeGreaterThan(0.9);
    expect(Math.abs(s[2].y)).toBeLessThan(1e-6);
  });

  it('creates an svg string with expected tags', () => {
    const r = { start: -1, end: 1, count: 5 };
    const s = generateSeries('sin(x)', r);
    const svg = createSVG(s, { width: 200, height: 100 });
    expect(svg).toContain('<svg');
    expect(svg).toContain('<path');
  });
});
