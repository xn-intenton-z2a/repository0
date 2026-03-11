# Hamming Distance Utilities

This package provides small utilities for computing Hamming distances for strings and integers.

## Installation

npm install

## API

- hammingDistance(a, b): compute Hamming distance between two strings (compares Unicode code points). Throws TypeError for non-strings and RangeError for unequal-length strings.
- hammingDistanceBits(x, y): compute Hamming distance between two non-negative integers (counts differing bits). Accepts Number (integers) or BigInt. Throws TypeError for wrong types or non-integers, RangeError for negative integers.

## Examples

import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0

console.log(hammingDistanceBits(1, 4)); // 2
console.log(hammingDistanceBits(0, 0)); // 0
