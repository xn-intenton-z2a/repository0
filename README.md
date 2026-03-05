# Hamming Distance Library

A small JavaScript library providing Hamming distance functions for strings and integers.

## API

- `hammingDistance(a, b)`
  - Computes the Hamming distance between two strings by comparing Unicode code points (not UTF-16 code units).
  - Throws `TypeError` if inputs are not strings.
  - Throws `RangeError` if the strings have different lengths (in code points).

- `hammingDistanceBits(x, y)`
  - Computes the Hamming distance between two non-negative integers (counts differing bits).
  - Accepts `Number` (integer) or `BigInt` inputs.
  - Throws `TypeError` for non-integer arguments.
  - Throws `RangeError` for negative integers.

## Usage

Import the functions:

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0

console.log(hammingDistanceBits(1, 4)); // 2
console.log(hammingDistanceBits(0, 0)); // 0
console.log(hammingDistanceBits(1n, 4n)); // 2 (BigInt)
```

## Notes

- Unicode: the library compares Unicode code points (Array.from) to avoid counting surrogate pairs incorrectly.
- Integer support: Numbers are converted to BigInt internally to correctly compute bit differences for values beyond 32 bits.

## Running tests

Run:

```bash
npm test
```
