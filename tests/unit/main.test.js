import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs, parseExpression, buildEvaluator, generateTimeSeries, generateSVG } from '../../src/lib/main.js';

describe('main lib', () => {
  it('parses args', () => {
    const args = parseArgs(['--expression', 'y=sin(x)', '--range', '-1:1', '--points', '5']);
    assert.strictEqual(args.expression, 'y=sin(x)');
    assert.strictEqual(args.range, '-1:1');
    assert.strictEqual(args.points, 5);
  });

  it('parses expression', () => {
    assert.strictEqual(parseExpression('y=sin(x)'), 'sin(x)');
    assert.strictEqual(parseExpression('  x^2 + 1 '), 'x^2 + 1');
  });

  it('builds evaluator and computes values', () => {
    const fn = buildEvaluator('sin(x)');
    assert.strictEqual(typeof fn, 'function');
    const v = fn(0);
    assert.ok(Math.abs(v - 0) < 1e-6);
  });

  it('generates time series for linear function', () => {
    const series = generateTimeSeries('2*x+1', '0:4', 5);
    assert.strictEqual(series.length, 5);
    assert.ok(Math.abs(series[0].x - 0) < 1e-9);
    assert.ok(Math.abs(series[4].x - 4) < 1e-9);
    assert.ok(Math.abs(series[0].y - 1) < 1e-9);
    assert.ok(Math.abs(series[4].y - 9) < 1e-9);
  });

  it('generates svg containing path', () => {
    const series = generateTimeSeries('sin(x)', '-3.141592:3.141592', 50);
    const svg = generateSVG(series, { width: 300, height: 150 });
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('<path'));
  });
});
