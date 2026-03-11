# Hamming Distance Utilities

A small JavaScript library for computing Hamming distances between strings and between integer bit patterns.

This project provides:
- hammingDistance(a, b): Hamming distance between two strings (compares Unicode code points).
- hammingDistanceBits(x, y): Hamming distance between two non-negative integers (counts differing bits). Accepts Number (integers) and BigInt.

Installation

npm install

Usage

ES module import (node or bundler):

import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

Examples

- Strings

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0

- Bits

console.log(hammingDistanceBits(1, 4)); // 2
console.log(hammingDistanceBits(0, 0)); // 0

API

- hammingDistance(a: string, b: string): number
  - Throws TypeError when inputs are not strings.
  - Throws RangeError when strings differ in Unicode code point length.

- hammingDistanceBits(x: number|bigint, y: number|bigint): number
  - Accepts integers (Number) or BigInt.
  - Throws TypeError for non-integer numbers or wrong types.
  - Throws RangeError for negative integers.

Development

- Run unit tests: npm test
- Build web demo: npm run build:web (generates docs/lib-meta.js and docs/lib-browser.js and copies src/web into docs)

License: MIT
