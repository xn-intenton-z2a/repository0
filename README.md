# Hamming Distance Library

A small JavaScript library providing Unicode-aware Hamming distance functions for strings and integers.

Features

- hammingDistance(a, b): computes the Hamming distance between two strings using Unicode code points (not UTF-16 code units).
- hammingDistanceBits(x, y): computes the Hamming distance between two non-negative integers by comparing differing bits.

Installation

Install the package (when published) or use directly from source.

Usage

Import the functions and call them:

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0

console.log(hammingDistanceBits(1, 4)); // 2
console.log(hammingDistanceBits(0, 0)); // 0

// Unicode-aware example (astral code points)
console.log(hammingDistance('a𝔘b', 'a𝔘c')); // 1

// BigInt support
console.log(hammingDistanceBits(2n ** 65n, 0n)); // 1
```

API

- hammingDistance(a: string, b: string): number
  - Throws TypeError if either argument is not a string.
  - Throws RangeError if the strings have different lengths (in Unicode code points).

- hammingDistanceBits(x: number|bigint, y: number|bigint): number
  - Accepts Number (integer-like) or BigInt values.
  - Throws TypeError for wrong types or non-integer numbers.
  - Throws RangeError for negative integers.

Testing

Run the unit tests with:

```bash
npm test
```

License: MIT
