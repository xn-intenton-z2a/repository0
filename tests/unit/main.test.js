import test from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs, parseExpression, buildEvaluator, parseRange, generateTimeSeries, generateSVG, svgToPng } from '../../src/lib/main.js';

test('parseArgs collects flags', () => {
  const argv = ['--expression', 'y=sin(x)', '--range', 'x=-1:1', '--file', 'out.svg', '--points', '50', '--width', '400', '--height', '300', '--bg', 'red', '--stroke', 'blue', '--fill', 'none', '--stroke-width', '1'];
  const o = parseArgs(argv);
  assert.equal(o.expression, 'y=sin(x)');
  assert.equal(o.range, 'x=-1:1');
  assert.equal(o.file, 'out.svg');
  assert.equal(o.points, 50);
  assert.equal(o.width, 400);
  assert.equal(o.height, 300);
  assert.equal(o.bg, 'red');
  assert.equal(o.stroke, 'blue');
  assert.equal(o.fill, 'none');
  assert.equal(o.strokeWidth, 1);
});

test('parseExpression strips left-hand side', () => {
  assert.equal(parseExpression('y=sin(x)'), 'sin(x)');
  assert.equal(parseExpression(' sin(x) '), 'sin(x)');
  assert.equal(parseExpression(''), null);
});

test('buildEvaluator creates function and evaluates', () => {
  const fn = buildEvaluator('sin(x)');
  assert.equal(typeof fn, 'function');
  assert.ok(Math.abs(fn(0) - 0) < 1e-9);
  assert.ok(Math.abs(fn(Math.PI / 2) - 1) < 1e-9);
});

test('parseRange handles simple inputs', () => {
  assert.deepEqual(parseRange('x=-1:1'), { xMin: -1, xMax: 1 });
  assert.deepEqual(parseRange('-2:2'), { xMin: -2, xMax: 2 });
  assert.deepEqual(parseRange(), { xMin: -10, xMax: 10 });
});

test('generateTimeSeries produces correct number of points and numeric Ys', () => {
  const fn = buildEvaluator('x');
  const pts = generateTimeSeries(fn, { xMin: 0, xMax: 1 }, 5);
  assert.equal(pts.length, 5);
  assert.ok(Math.abs(pts[0].x - 0) < 1e-9);
  assert.ok(Math.abs(pts[4].x - 1) < 1e-9);
  for (const p of pts) {
    assert.equal(Number.isFinite(p.y), true);
  }
});

test('generateSVG returns an svg string containing path', () => {
  const fn = buildEvaluator('sin(x)');
  const pts = generateTimeSeries(fn, { xMin: 0, xMax: Math.PI * 2 }, 50);
  const svg = generateSVG(pts, { width: 200, height: 100, stroke: 'black' });
  assert.equal(typeof svg, 'string');
  assert.ok(svg.includes('<svg'));
  assert.ok(svg.includes('<path'));
});

test('svgToPng produces a PNG buffer', async () => {
  const fn = buildEvaluator('sin(x)');
  const pts = generateTimeSeries(fn, { xMin: 0, xMax: Math.PI * 2 }, 20);
  const svg = generateSVG(pts, { width: 120, height: 60 });
  try {
    const pngBuf = await svgToPng(svg, 120, 60);
    assert.ok(Buffer.isBuffer(pngBuf));
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    assert.equal(pngBuf[0], 0x89);
    assert.equal(pngBuf[1], 0x50);
    assert.equal(pngBuf[2], 0x4e);
    assert.equal(pngBuf[3], 0x47);
  } catch (e) {
    // If sharp is not installed in the environment, accept the informative error
    assert.ok(/sharp module is required/.test(e.message));
  }
});
