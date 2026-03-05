# Hamming Distance Library

Small JavaScript library providing Hamming distance utilities for strings and integers.

## Install

This repository is a template; to use the library in another project, copy the `src/lib/main.js` file or install the package when published.

## API

Named exports from `src/lib/main.js`:

- `hammingDistance(a, b)`
  - Compares two strings by Unicode code points and returns the number of positions where characters differ.
  - Throws `TypeError` if either argument is not a string.
  - Throws `RangeError` if the strings have different code point lengths.

- `hammingDistanceBits(x, y)`
  - Compares two non-negative integers (Number or BigInt) and returns the count of differing bits.
  - Throws `TypeError` if arguments are not integer Numbers or BigInts.
  - Throws `RangeError` if any argument is negative.

## Examples

import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0

console.log(hammingDistanceBits(1, 4)); // 2
console.log(hammingDistanceBits(0n, 0n)); // 0

## Notes

- Unicode-aware: uses code point iteration so emoji and other surrogate-pair characters are treated as single characters.
- Supports BigInt for large integer bit comparisons.
