import { strict as assert } from 'assert';
import { test } from 'node:test';
import { parseArgs, parseExpression, buildEvaluator, generateSeries, generateSVG } from '../../src/lib/main.js';

test('parseArgs basic', () => {
  const a = parseArgs(['-e', 'sin(x)', '-r', '-3.14:3.14', '-f', 'out.svg']);
  assert.equal(a.expression, 'sin(x)');
  assert.equal(a.range, '-3.14:3.14');
  assert.equal(a.file, 'out.svg');
});

test('parseExpression strips y=', () => {
  assert.equal(parseExpression('y=sin(x)'), 'sin(x)');
  assert.equal(parseExpression(' sin(x) '), 'sin(x)');
});

test('buildEvaluator and generateSeries produce reasonable values', () => {
  const evalFn = buildEvaluator('sin(x)');
  assert.equal(typeof evalFn, 'function');
  const series = generateSeries(evalFn, '-3.1415:3.1415', 5);
  assert.equal(series.length, 5);
  assert.ok(Math.abs(series[0].y) < 1e-3);
  assert.ok(Math.abs(series[4].y) < 1e-3);
});

test('power operator ^ is supported', () => {
  const evalFn = buildEvaluator('x^2');
  const s = generateSeries(evalFn, '0:2', 3);
  assert.ok(Math.abs(s[0].y - 0) < 1e-6);
  assert.ok(Math.abs(s[1].y - 1) < 1e-6);
  assert.ok(Math.abs(s[2].y - 4) < 1e-6);
});

test('generateSVG contains path', () => {
  const evalFn = buildEvaluator('sin(x)');
  const series = generateSeries(evalFn, '-3.14:3.14', 50);
  const svg = generateSVG(series);
  assert.match(svg, /<svg[^>]*>/);
  assert.match(svg, /<path [^>]*d=\"M/);
});
