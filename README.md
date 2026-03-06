# Hamming Distance Utilities

This repository provides two utility functions for computing Hamming distances.

API

- hammingDistance(a, b)
  - Compare two sequences (strings, Array, Buffer, Uint8Array) and return the count of positions where elements differ.
  - For strings: comparison is by Unicode code points (each code point compared using Array.from).
  - Throws TypeError for unsupported types and RangeError if inputs have unequal length.

- hammingDistanceBits(a, b)
  - Compare two numbers (integer or BigInt) or two byte sequences (Array/Buffer/Uint8Array) and return the number of differing bits.
  - For numeric inputs: non-negative integers only (RangeError for negative, TypeError for non-integer numbers).
  - For byte arrays: inputs must be equal-length; otherwise RangeError.

Usage examples

import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistanceBits(1, 4)); // 2
