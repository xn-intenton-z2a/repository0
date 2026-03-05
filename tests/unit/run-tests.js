import assert from 'node:assert/strict';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

let failures = 0;
function ok(name, fn) {
  try {
    fn();
    console.log(`OK: ${name}`);
  } catch (err) {
    failures++;
    console.error(`FAIL: ${name}`);
    console.error(err && err.stack ? err.stack : err);
  }
}

ok('karolin vs kathrin => 3', () => {
  assert.equal(hammingDistance('karolin', 'kathrin'), 3);
});

ok('empty strings => 0', () => {
  assert.equal(hammingDistance('', ''), 0);
});

ok('unequal-length throws RangeError', () => {
  assert.throws(() => hammingDistance('a', 'bb'), RangeError);
});

ok('surrogate pairs handled', () => {
  assert.equal(hammingDistance('a𐐷b', 'a𐐶b'), 1);
});

ok('precomposed vs decomposed throws RangeError', () => {
  assert.throws(() => hammingDistance('é', 'e\u0301'), RangeError);
});

ok('bits: 1 vs 4 => 2', () => {
  assert.equal(hammingDistanceBits(1, 4), 2);
});

ok('bits: 0 vs 0 => 0', () => {
  assert.equal(hammingDistanceBits(0, 0), 0);
});

ok('bits: bigint large shift', () => {
  assert.equal(hammingDistanceBits(0n, 1n << 65n), 1);
});

ok('bits: non-integer throws TypeError', () => {
  assert.throws(() => hammingDistanceBits(1.5, 2), TypeError);
  assert.throws(() => hammingDistanceBits('a', 1), TypeError);
});

ok('bits: negative throws RangeError', () => {
  assert.throws(() => hammingDistanceBits(-1, 0), RangeError);
  assert.throws(() => hammingDistanceBits(0, -2n), RangeError);
});

ok('bits: 255 vs 0 => 8', () => {
  assert.equal(hammingDistanceBits(255, 0), 8);
});

if (failures === 0) {
  console.log('\nAll tests passed');
  process.exit(0);
} else {
  console.error(`\n${failures} tests failed`);
  process.exit(1);
}
