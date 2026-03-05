# Hamming Distance Library

A small JavaScript library exporting Unicode-aware Hamming distance functions.

This repository provides two named exports from `src/lib/main.js`:

- `hammingDistance(a, b)` — compute the Hamming distance between two strings of equal length (compares Unicode code points, not UTF-16 code units). Throws TypeError for non-strings and RangeError for unequal-length strings.
- `hammingDistanceBits(x, y)` — compute the Hamming distance between two non-negative integers (Number or BigInt). Returns the count of differing bits. Throws TypeError for non-integers and RangeError for negative values.

Examples

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0
// Unicode-aware: compares code points
console.log(hammingDistance('a𐐷b', 'a𐐶b')); // 1

console.log(hammingDistanceBits(1, 4)); // 2 (001 vs 100)
console.log(hammingDistanceBits(0n, 1n << 65n)); // 1 (BigInt support)
```

API

hammingDistance(a: string, b: string): number
- Throws TypeError if inputs are not strings.
- Throws RangeError if strings differ in length when measured in Unicode code points.

hammingDistanceBits(x: number|bigint, y: number|bigint): number
- Accepts finite integer-like Numbers and BigInts.
- Throws TypeError if inputs are not integer-like.
- Throws RangeError if either input is negative.

Testing

Run the unit tests with:

```bash
npm test
```

Artifacts

- docs/examples/usage.txt — example outputs
- docs/evidence/results.json — machine-readable summary of key results
- docs/reports/walkthrough.txt — short usage walkthrough

License: MIT
