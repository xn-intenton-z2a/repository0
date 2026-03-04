import { describe, it, expect } from 'vitest';
import { parseArgs, parseExpression, buildEvaluator, parseRange, generateTimeSeries, renderSVG } from '../../src/lib/main.js';

describe('CLI plot main', () => {
  it('parses args', () => {
    const argv = ['--expression', 'y=sin(x)', '--range', '-3.14:3.14:5', '--file', 'out.svg', '--width', '300', '--height', '200'];
    const out = parseArgs(argv);
    expect(out.expression).toBe('y=sin(x)');
    expect(out.range).toBe('-3.14:3.14:5');
    expect(out.file).toBe('out.svg');
    expect(out.width).toBe(300);
    expect(out.height).toBe(200);
  });

  it('parses expression', () => {
    expect(parseExpression('y = x * 2')).toBe('x * 2');
    expect(parseExpression('sin(x)')).toBe('sin(x)');
  });

  it('builds evaluator and computes values', () => {
    const evalFn = buildEvaluator('sin(x)');
    expect(typeof evalFn).toBe('function');
    const v = evalFn(Math.PI / 2);
    expect(Math.abs(v - 1)).toBeLessThan(1e-9);
  });

  it('parses ranges', () => {
    expect(parseRange('-1:1').start).toBe(-1);
    const r = parseRange('-1:1:5');
    expect(r.points).toBe(5);
    const r2 = parseRange('x=-2:2:10');
    expect(r2.varName).toBe('x');
    expect(r2.start).toBe(-2);
    expect(r2.stop).toBe(2);
  });

  it('generates series and renders svg', () => {
    const evalFn = buildEvaluator('x');
    const range = parseRange('0:1:3');
    const series = generateTimeSeries(evalFn, range);
    expect(series.length).toBe(3);
    expect(series[0].x).toBeCloseTo(0);
    expect(series[2].x).toBeCloseTo(1);
    const svg = renderSVG(series, { width: 200, height: 100, stroke: 'red' });
    expect(svg).toContain('<svg');
    expect(svg).toContain('path');
  });
});
