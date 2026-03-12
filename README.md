# repo

Hamming distance utility library (part of an agentic demo repository).

This repository exposes two core functions from src/lib/main.js:

- `hammingDistance(a, b)` — compute the Hamming distance between two strings of equal length (compares Unicode code points).
- `hammingDistanceBits(x, y)` — compute the Hamming distance between two non-negative integers (counts differing bits).

Usage examples (Node/browser):

import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

// Strings (Unicode-aware)
console.log(hammingDistance('karolin', 'kathrin')); // 3

// Bits
console.log(hammingDistanceBits(1, 4)); // 2

API details:
- hammingDistance(a, b): throws TypeError if inputs are not strings; throws RangeError if strings differ in length (in Unicode code points).
- hammingDistanceBits(x, y): accepts integer Number or BigInt pairs; throws TypeError for invalid types; throws RangeError for negative values.

See src/web/index.html for a browser demo and tests in tests/unit/ for full coverage.
