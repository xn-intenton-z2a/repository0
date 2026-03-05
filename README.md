# Hamming Distance Library

A small JavaScript library exporting Unicode-aware Hamming distance functions.

Features
- hammingDistance(a, b): compares two strings by Unicode code points and returns the number of differing positions.
- hammingDistanceBits(x, y): counts differing bits between two non-negative integers (Number or BigInt).

Usage

Import the functions:

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';
```

Examples

```js
hammingDistance('karolin', 'kathrin'); // 3
hammingDistance('', ''); // 0

hammingDistanceBits(1, 4); // 2
hammingDistanceBits(0n, 1n << 65n); // 1
```

API

- hammingDistance(a: string, b: string): number
  - Throws TypeError if inputs are not strings.
  - Throws RangeError if the strings differ in length when counted as Unicode code points.

- hammingDistanceBits(x: number|bigint, y: number|bigint): number
  - Throws TypeError if inputs are not integer-like (Number integers or BigInt).
  - Throws RangeError if inputs are negative.
  - Accepts Number values but uses BigInt internally for safe bit operations on large integers.

Unicode notes

Strings are compared by Unicode code points (Array.from) rather than UTF-16 code units. This means surrogate pairs and astral characters are treated as single positions. Note that precomposed and decomposed forms (e.g., 'é' vs 'e\u0301') have different code point sequences and may have different lengths.

License: MIT
