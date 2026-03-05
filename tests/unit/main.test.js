import assert from 'node:assert/strict';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

export async function runTests() {
  // hammingDistance - normal cases
  assert.strictEqual(hammingDistance('karolin', 'kathrin'), 3, 'karolin vs kathrin should be 3');
  assert.strictEqual(hammingDistance('', ''), 0, 'empty strings should have distance 0');
  assert.strictEqual(hammingDistance('1011101', '1001001'), 2, 'binary strings example');

  // Unicode / code-point aware tests
  // Musical symbol G clef U+1D11E (surrogate pair in UTF-16); Array.from should treat as a single code point
  assert.strictEqual(hammingDistance('a\u{1D11E}c', 'a\u{1D11F}c'), 1, 'Unicode astral symbols differ by one code point');
  // Emojis with modifiers
  assert.strictEqual(hammingDistance('👩‍👩‍👦', '👩‍👩‍👧'), 1, 'emoji family different child should be distance 1');

  // RangeError for unequal lengths
  let threw = false;
  try {
    hammingDistance('a', 'bb');
  } catch (e) {
    threw = true;
    assert.ok(e instanceof RangeError, 'Expected RangeError for unequal-length strings');
  }
  assert.ok(threw, 'hammingDistance should throw for unequal lengths');

  // TypeErrors for non-string inputs
  assert.throws(() => hammingDistance(1, 2), TypeError);
  assert.throws(() => hammingDistance('a', 1), TypeError);

  // hammingDistanceBits - normal cases
  assert.strictEqual(hammingDistanceBits(1, 4), 2, '1 vs 4 should have 2 differing bits (001 vs 100)');
  assert.strictEqual(hammingDistanceBits(0n, 0n), 0, '0 vs 0 should be 0');
  assert.strictEqual(hammingDistanceBits(0, 0), 0, '0 vs 0 (number) should be 0');

  // large integers
  const largeA = BigInt('0x' + 'f'.repeat(64));
  const largeB = BigInt('0');
  const expectedOnes = 64n * 4n; // 64 hex digits => 256 bits set
  // compute distance and compare to expected ones count (as Number may be large, compare BigInt)
  const distLarge = hammingDistanceBits(largeA, largeB);
  assert.strictEqual(typeof distLarge, 'number');
  assert.strictEqual(BigInt(distLarge), expectedOnes, 'All bits set vs zero should count all ones');

  // negative integers throw RangeError
  assert.throws(() => hammingDistanceBits(-1, 0), RangeError);
  assert.throws(() => hammingDistanceBits(0, -2n), RangeError);

  // non-integer types
  assert.throws(() => hammingDistanceBits(1.5, 2), TypeError);
  assert.throws(() => hammingDistanceBits('a', 1), TypeError);

  // mixed Number and BigInt
  assert.strictEqual(hammingDistanceBits(5, 3n), 2, '5 (101) vs 3 (011) differ by 2 bits');

  // edge large number (Number but integer within safe range)
  assert.strictEqual(hammingDistanceBits(BigInt(Number.MAX_SAFE_INTEGER), BigInt(Number.MAX_SAFE_INTEGER) - 1n), 1);

  // report summary (also used by docs/evidence generation)
  console.log('Ran hammingDistance and hammingDistanceBits unit tests');
}
