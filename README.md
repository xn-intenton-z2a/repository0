# Hamming Distance Library

A small JavaScript library providing Hamming distance utilities for Unicode strings and integers (including BigInt).

Features
- hammingDistance(a, b): Unicode-aware Hamming distance between two strings (compares code points).
- hammingDistanceBits(x, y): Hamming distance between non-negative integers (Number or BigInt), counts differing bits.

Installation

This repository is a template; install dev dependencies and run tests:

```bash
npm install
npm test
```

Usage

Import the functions as named exports:

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0

console.log(hammingDistanceBits(1, 4)); // 2
console.log(hammingDistanceBits(0n, 1n << 70n)); // 1
```

API

hammingDistance(a, b)
- Arguments: a (string), b (string)
- Returns: number — count of positions where Unicode code points differ
- Errors:
  - TypeError if either argument is not a string
  - RangeError if strings have different length in Unicode code points

hammingDistanceBits(x, y)
- Arguments: x (Number|BigInt), y (Number|BigInt)
- Returns: number — count of differing bits
- Errors:
  - TypeError if arguments are not integer-like (Number integers or BigInt)
  - RangeError if either integer is negative

Notes
- Unicode handling compares code points (e.g., emoji and astral characters are handled correctly).
- The implementation normalizes numeric inputs to BigInt for reliable bitwise differences on large integers.

Contributing

Follow repository guidelines in CONTRIBUTING.md. Add tests for new edge cases and update docs in `docs/`.
