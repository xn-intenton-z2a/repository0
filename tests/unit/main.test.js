import test from 'node:test';
import assert from 'node:assert';
import { parseArgs, parseExpression, buildEvaluator, parseRange, generateSeries, renderSVG } from '../../src/lib/main.js';

test('parses args', () => {
  const a = parseArgs(['--expression', 'y=sin(x)', '--range', 'x=-1:1', '--points', '50']);
  assert.strictEqual(a.expression, 'y=sin(x)');
  assert.strictEqual(a.range, 'x=-1:1');
  assert.strictEqual(a.points, 50);
});

test('parses expression', () => {
  assert.strictEqual(parseExpression('y=sin(x)'), 'sin(x)');
  assert.strictEqual(parseExpression(' sin(x) '), 'sin(x)');
});

test('builds evaluator and computes values', () => {
  const fn = buildEvaluator('sin(x)');
  const v0 = fn(0);
  assert.strictEqual(Number(v0.toFixed(6)), 0);
  const v1 = buildEvaluator('x * 2')(3);
  assert.strictEqual(v1, 6);
});

test('parses range', () => {
  const r = parseRange('x=-2:2');
  assert.strictEqual(r.x.min, -2);
  assert.strictEqual(r.x.max, 2);
  const s = parseRange('-5:5');
  assert.strictEqual(s.x.min, -5);
});

test('generates series and renders svg', () => {
  const fn = buildEvaluator('x');
  const series = generateSeries(fn, { min: 0, max: 1 }, 5);
  assert.strictEqual(series.length, 5);
  const svg = renderSVG(series, 200, 100, { stroke: '#f00' });
  assert.ok(svg.includes('<svg'));
  assert.ok(svg.includes('polyline'));
});
