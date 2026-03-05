# repo — Hamming distance utilities

This small library exposes two functions for computing Hamming distances.

## API

- `hammingDistance(a, b)`
  - Computes the Hamming distance between two strings `a` and `b` by Unicode code points.
  - Throws `TypeError` if either argument is not a string.
  - Throws `RangeError` if the strings have different lengths (in Unicode code points).

- `hammingDistanceBits(x, y)`
  - Computes the Hamming distance between two non-negative integers `x` and `y` (counts differing bits).
  - Accepts `Number` integers and `BigInt`.
  - Throws `TypeError` for non-integer inputs, `RangeError` for negative values.

## Examples

import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0

console.log(hammingDistanceBits(1, 4)); // 2
console.log(hammingDistanceBits(0, 0)); // 0

// Unicode example (supplementary plane characters are compared as code points)
console.log(hammingDistance('a\u{10437}b', 'a\u{10438}b')); // 1

## Running tests

npm test

## License

MIT
