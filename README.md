# repository0 — Hamming utilities

This repository demonstrates small, well-tested utilities. Added here are two Hamming distance utilities:

- hammingDistance(a, b): count differing positions between two equal-length sequences (strings, Buffer, Uint8Array, Array-like). Strings are compared by Unicode code points.
- hammingDistanceBits(x, y): count differing bit positions between two integers (Number treated as unsigned 32-bit, or BigInt). Numbers mixed with BigInt are coerced to BigInt for the comparison.

Usage (ESM):

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistanceBits(0b1011101, 0b1001001)); // 2
```

See tests for more examples: `tests/unit/hamming.test.js`.
