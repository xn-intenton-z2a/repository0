# Hamming Distance Library

A small JavaScript library that provides Unicode-aware Hamming distance functions for strings and bitwise Hamming distance for integers.

## Installation

Install from source or include this module in your project. Requires Node.js >= 24 (ESM).

## API

Named exports (from `src/lib/main.js`):

- `hammingDistance(a, b)` - Compute the Hamming distance between two strings of equal length. Comparisons are performed on Unicode code points (not UTF-16 code units). Throws `TypeError` for non-string inputs and `RangeError` for unequal-length strings.

- `hammingDistanceBits(x, y)` - Compute the Hamming distance between two non-negative integers. Accepts `Number` (integer) or `BigInt`. Throws `TypeError` for non-integer-like inputs and `RangeError` for negative integers.

## Examples

Importing (ESM):

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0

console.log(hammingDistanceBits(1, 4)); // 2
console.log(hammingDistanceBits(0, 0)); // 0

// Unicode example with emojis
console.log(hammingDistance('\u{1F600}\u{1F601}', '\u{1F600}\u{1F602}')); // 1
```

## Notes

- The string comparison uses Array.from(...) to iterate by Unicode code points so supplementary characters like emoji are handled as single positions.
- For large integers or when precise bit semantics are required, prefer passing BigInt values.

## License

MIT
