# Hamming Distance Library

A small JavaScript library providing Unicode-aware Hamming distance functions for strings and bitwise Hamming distance for integers.

Features
- hammingDistance(a, b): compute Hamming distance between two strings by Unicode code points. Throws TypeError for non-strings and RangeError for unequal lengths (in code points).
- hammingDistanceBits(x, y): compute Hamming distance between two non-negative integers (Number or BigInt). Throws TypeError for non-integer inputs and RangeError for negative integers.

Usage (ES modules)

import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

Examples

- Basic string example:

const d = hammingDistance('karolin', 'kathrin');
// d === 3

- Empty strings:

hammingDistance('', ''); // 0

- Unequal-length strings throw:

try {
  hammingDistance('a', 'bb');
} catch (e) {
  // RangeError
}

- Unicode-aware (compares code points, not UTF-16 units):

hammingDistance('a𐐷b', 'a𐐶b'); // 1

- Bitwise Hamming distance:

hammingDistanceBits(1, 4); // 2 (001 vs 100)

hammingDistanceBits(0n, 1n << 65n); // 1 (BigInt support)

API

- hammingDistance(a: string, b: string): number
  - Throws TypeError if either argument is not a string.
  - Throws RangeError if strings have different lengths when interpreted as Unicode code points.

- hammingDistanceBits(x: number | BigInt, y: number | BigInt): number
  - Accepts Number (integer) or BigInt.
  - Throws TypeError for non-integer or non-BigInt inputs.
  - Throws RangeError for negative integers.

Notes on Unicode

This library compares Unicode code points using Array.from(...) so surrogate pairs (e.g., emoji and historic scripts) are treated as single characters. Note that canonically equivalent but differently composed Unicode sequences (precomposed vs combining marks) are treated as different sequences of code points and therefore may have different lengths.

Running tests

npm test

License: MIT
