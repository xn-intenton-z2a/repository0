import { describe, it, expect } from 'vitest';
import {
  parseArgs,
  parseExpression,
  parseRange,
  generateTimeSeries,
  generateSVG,
  buildEvaluator,
  main
} from '../../src/lib/main.js';

describe('main library', () => {
  it('parses CLI args', () => {
    const args = ['--expression', 'y=sin(x)', '--range', 'x=0:3.14', '--file', 'out.svg', '--points', '50'];
    const parsed = parseArgs(args);
    expect(parsed.expression).toBe('y=sin(x)');
    expect(parsed.range).toBe('x=0:3.14');
    expect(parsed.file).toBe('out.svg');
    expect(parsed.points).toBe(50);
  });

  it('parses expressions', () => {
    expect(parseExpression('y = sin(x)')).toBe('sin(x)');
    expect(parseExpression('sin(x)')).toBe('sin(x)');
    expect(parseExpression('')).toBeNull();
  });

  it('parses ranges with step', () => {
    const r = parseRange('x=0:1:0.25');
    expect(r.varName).toBe('x');
    expect(r.start).toBe(0);
    expect(r.stop).toBe(1);
    expect(r.step).toBeCloseTo(0.25);
    expect(r.points).toBe(5);
  });

  it('generates time series for simple expression', () => {
    const pts = generateTimeSeries('y = x', 'x=0:1:0.5');
    expect(pts).toEqual([
      { x: 0, y: 0 },
      { x: 0.5, y: 0.5 },
      { x: 1, y: 1 }
    ]);
  });

  it('buildEvaluator produces a working function', () => {
    const fn = buildEvaluator('sin(x)');
    const val = fn(Math.PI / 2);
    expect(Math.abs(val - 1) < 1e-9).toBe(true);
  });

  it('generates an SVG string', () => {
    const pts = [ { x: 0, y: 0 }, { x: 1, y: 1 } ];
    const svg = generateSVG(pts, { width: 200, height: 100, stroke: '#000' });
    expect(svg).toContain('<svg');
    expect(svg).toContain('path');
    expect(svg).toContain('M ');
  });

  it('main() prints usage and exits gracefully when no args', () => {
    // calling main without args should not throw
    expect(() => main([])).not.toThrow();
  });
});
