# Hamming Distance Library

A small JavaScript library providing Hamming distance utilities: Unicode-aware string Hamming distance and integer bit Hamming distance.

## Installation

This repository is a small module; install dependencies and run tests:

```bash
npm install
npm test
```

## API

Named exports (ES Modules):

- `hammingDistance(a, b)`
  - Computes the Hamming distance between two strings `a` and `b` by Unicode code points.
  - Throws `TypeError` if inputs are not strings.
  - Throws `RangeError` if strings have different lengths (in code points).

- `hammingDistanceBits(x, y)`
  - Computes the Hamming distance between two non-negative integers `x` and `y` by counting differing bits.
  - Accepts `Number` (integer) or `BigInt` values.
  - Throws `TypeError` for non-integer numeric inputs.
  - Throws `RangeError` for negative values.

## Examples

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0

console.log(hammingDistanceBits(1, 4)); // 2 (0b001 vs 0b100)
console.log(hammingDistanceBits(0, 0)); // 0
```

## Notes

- The string comparison is Unicode-aware: it compares by code points, not UTF-16 code units, so supplementary characters are handled correctly.
- Use `BigInt` for very large integers to avoid precision issues with Number.
