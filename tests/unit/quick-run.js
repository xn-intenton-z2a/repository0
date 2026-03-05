import assert from 'assert';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

function run() {
  // Strings
  assert.strictEqual(hammingDistance('karolin', 'kathrin'), 3);
  assert.strictEqual(hammingDistance('', ''), 0);
  try {
    hammingDistance('a', 'bb');
    throw new Error('Expected RangeError for unequal lengths');
  } catch (e) {
    if (!(e instanceof RangeError)) throw e;
  }

  // Emoji
  assert.strictEqual(hammingDistance('😊', '😁'), 1);

  // Bits
  assert.strictEqual(hammingDistanceBits(1, 4), 2);
  assert.strictEqual(hammingDistanceBits(0, 0), 0);
  assert.strictEqual(hammingDistanceBits(1n, 4n), 2);

  try {
    hammingDistanceBits(1.5, 2);
    throw new Error('Expected TypeError for non-integer');
  } catch (e) {
    if (!(e instanceof TypeError)) throw e;
  }

  try {
    hammingDistanceBits(-1, 2);
    throw new Error('Expected RangeError for negative');
  } catch (e) {
    if (!(e instanceof RangeError)) throw e;
  }

  // Large BigInt
  const a = (1n << 60n) + 1n;
  const b = (1n << 60n) + 4n;
  assert.strictEqual(hammingDistanceBits(a, b), 2);

  console.log('All quick tests passed');
}

run();
