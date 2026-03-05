# Hamming Distance Library

A small JavaScript library exporting Hamming distance functions with Unicode-aware string handling and integer bit comparisons.

## Installation

This repository is a library template; install dependencies with:

```bash
npm install
```

## API

Named exports from `src/lib/main.js`:

- `hammingDistance(a, b)`
  - Computes the Hamming distance between two strings by Unicode code points.
  - Throws `TypeError` if either argument is not a string.
  - Throws `RangeError` if the strings differ in length (in Unicode code points).

- `hammingDistanceBits(x, y)`
  - Computes the Hamming distance between two non-negative integers (counts differing bits).
  - Accepts `Number` integers or `BigInt` values.
  - Throws `TypeError` for non-integer arguments, `RangeError` for negative values.

## Examples

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0

console.log(hammingDistanceBits(1, 4)); // 2
console.log(hammingDistanceBits(0n, 0n)); // 0
```

## Notes on Unicode

This library compares Unicode code points (using the string iterator / Array.from). It does not normalize strings; if you want canonical equivalence (for example, comparing precomposed and decomposed accents), normalize inputs with `String.prototype.normalize()` before calling `hammingDistance`.

## Running tests

```bash
npm test
```

## License

MIT
