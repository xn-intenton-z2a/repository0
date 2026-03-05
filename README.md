# Hamming Distance Library

A small JavaScript library exporting Hamming distance functions.

Features
- hammingDistance(a, b): compute Hamming distance between two strings (compares Unicode code points)
- hammingDistanceBits(x, y): compute Hamming distance between two non-negative integers (Number or BigInt)

Usage

Import named functions from the module:

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

// Strings (Unicode-aware)
console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0

// Bits
console.log(hammingDistanceBits(1, 4)); // 2
console.log(hammingDistanceBits(0, 0)); // 0

// BigInt
console.log(hammingDistanceBits(1n, 4n)); // 2
```

API

- hammingDistance(a: string, b: string): number
  - Throws TypeError if either argument is not a string
  - Throws RangeError if strings have different length in Unicode code points

- hammingDistanceBits(x: number|bigint, y: number|bigint): number
  - Accepts integer Number values or BigInt
  - Throws TypeError if arguments are not integers (or BigInt)
  - Throws RangeError if numbers are negative

Development

Run tests:

```bash
npm test
```

License: MIT
