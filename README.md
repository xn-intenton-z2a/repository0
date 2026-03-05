# Hamming Distance Library

A small JavaScript library that exports Unicode-aware Hamming distance functions for strings and integers.

## Installation

Install from source or use within a project that includes this module. This repository is a lightweight module (ESM).

## API

Named exports (from `src/lib/main.js`):

- `hammingDistance(a, b)`
  - Computes the Hamming distance between two strings `a` and `b` treating Unicode code points correctly (not UTF-16 code units).
  - Parameters: `a` (string), `b` (string)
  - Returns: number (non-negative integer)
  - Throws: `TypeError` if arguments are not strings. `RangeError` if strings have different lengths in Unicode code points.

- `hammingDistanceBits(x, y)`
  - Computes the Hamming distance between two non-negative integers by counting differing bits.
  - Parameters: `x` (`Number` or `BigInt` integer), `y` (`Number` or `BigInt` integer)
  - Returns: number (count of differing bits)
  - Throws: `TypeError` if arguments are not integer-like; `RangeError` if negative values are passed.

## Examples

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0

console.log(hammingDistanceBits(1, 4)); // 2 (001 vs 100)
console.log(hammingDistanceBits(0n, 0n)); // 0

// Unicode-aware example (musical G clef is a single code point)
console.log(hammingDistance('a\u{1D11E}c', 'a\u{1D11F}c')); // 1
```

## Running tests

This repository provides a small test harness. Run:

```bash
npm test
```

All unit tests are under `tests/unit/` and the runner is `tests/unit/run-tests.js`.

## Contributing

Contributions should follow the repository's contributing guidelines.

## License

MIT
