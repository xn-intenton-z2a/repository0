import assert from 'assert';
import {
  parseArgs,
  parseExpression,
  parseRange,
  generateTimeSeries,
  generateSVG,
  buildEvaluator,
  main
} from '../../src/lib/main.js';

function almostEqual(a, b, eps = 1e-9) {
  return Math.abs(a - b) < eps;
}

try {
  // parseArgs
  const parsed = parseArgs(['--expression', 'y=sin(x)', '--range', 'x=0:3.14', '--file', 'out.svg', '--points', '50']);
  assert.strictEqual(parsed.expression, 'y=sin(x)');
  assert.strictEqual(parsed.range, 'x=0:3.14');
  assert.strictEqual(parsed.file, 'out.svg');
  assert.strictEqual(parsed.points, 50);

  // parseExpression
  assert.strictEqual(parseExpression('y = sin(x)'), 'sin(x)');
  assert.strictEqual(parseExpression('sin(x)'), 'sin(x)');
  assert.strictEqual(parseExpression(''), null);

  // parseRange
  const r = parseRange('x=0:1:0.25');
  assert.strictEqual(r.varName, 'x');
  assert.strictEqual(r.start, 0);
  assert.strictEqual(r.stop, 1);
  assert.ok(almostEqual(r.step, 0.25));
  assert.strictEqual(r.points, 5);

  // generateTimeSeries (use buildEvaluator + parseRange)
  const evaluator = buildEvaluator('x');
  const rangeObj = parseRange('x=0:1:0.5');
  const pts = generateTimeSeries(evaluator, rangeObj);
  assert.deepStrictEqual(pts, [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }, { x: 1, y: 1 }]);

  // buildEvaluator
  const fn = buildEvaluator('sin(x)');
  const val = fn(Math.PI / 2);
  assert.ok(almostEqual(val, 1));

  // generateSVG
  const svg = generateSVG([{ x: 0, y: 0 }, { x: 1, y: 1 }], { width: 200, height: 100, stroke: '#000' });
  assert.ok(svg.includes('<svg'));
  assert.ok(svg.includes('path'));
  assert.ok(svg.includes('M'));

  // main should not throw when called with empty args
  // calling main([]) prints usage and returns 0
  const res = await main([]).catch((e) => { throw e; });

  console.log('All tests passed');
  process.exit(0);
} catch (err) {
  console.error('Test failure:', err && err.stack ? err.stack : err);
  process.exit(2);
}
