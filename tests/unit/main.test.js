import { describe, it, expect } from 'vitest';
import { parseArgs, parseExpression, buildEvaluator, generateTimeSeries, generateSVG } from '../../src/lib/main.js';

describe('main lib', () => {
  it('parses args', () => {
    const args = parseArgs(['--expression', 'y=sin(x)', '--range', '-1:1', '--points', '5']);
    expect(args.expression).toBe('y=sin(x)');
    expect(args.range).toBe('-1:1');
    expect(args.points).toBe(5);
  });

  it('parses expression', () => {
    expect(parseExpression('y=sin(x)')).toBe('sin(x)');
    expect(parseExpression('  x^2 + 1 ')).toBe('x^2 + 1');
  });

  it('builds evaluator and computes values', () => {
    const fn = buildEvaluator('sin(x)');
    expect(typeof fn).toBe('function');
    const v = fn(0);
    expect(v).toBeCloseTo(0, 6);
  });

  it('generates time series for linear function', () => {
    const series = generateTimeSeries('2*x+1', '0:4', 5);
    expect(series.length).toBe(5);
    expect(series[0].x).toBeCloseTo(0);
    expect(series[4].x).toBeCloseTo(4);
    expect(series[0].y).toBeCloseTo(1);
    expect(series[4].y).toBeCloseTo(9);
  });

  it('generates svg containing path', () => {
    const series = generateTimeSeries('sin(x)', '-3.141592:3.141592', 50);
    const svg = generateSVG(series, { width: 300, height: 150 });
    expect(svg).toContain('<svg');
    expect(svg).toContain('<path');
  });
});
