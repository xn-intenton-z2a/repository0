# Hamming Distance Library

A small JavaScript library exporting Hamming distance functions.

Features
- hammingDistance(a, b): Unicode-aware Hamming distance between two strings (compares code points).
- hammingDistanceBits(x, y): Hamming distance between two non-negative integers (counts differing bits). Accepts Number (integer) or BigInt.

Installation

This repository is set up as a template. Install dev dependencies and run tests:

npm install
npm test

API

import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

hammingDistance(a, b)
- a, b: strings
- Compares by Unicode code points (uses Array.from internally).
- Throws TypeError if inputs are not strings.
- Throws RangeError if strings have different lengths (in code points).
- Returns a non-negative integer.

hammingDistanceBits(x, y)
- x, y: integer Number or BigInt
- Throws TypeError for non-integer inputs.
- Throws RangeError for negative integers.
- Returns number of differing bits (Number)

Examples

import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')) // 3
console.log(hammingDistance('', '')) // 0

console.log(hammingDistanceBits(1, 4)) // 2
console.log(hammingDistanceBits(0, 0)) // 0

Unicode example:
console.log(hammingDistance('a😊b', 'a😢b')) // 1

BigInt example:
console.log(hammingDistanceBits(1n << 60n, 0n)) // 1

License: MIT
