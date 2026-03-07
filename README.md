# Hamming Distance Library

This repository provides a small JavaScript library that implements Hamming distance functions for strings and integers.

Features
- hammingDistance(a, b): Compute the Hamming distance between two strings (compares Unicode code points).
- hammingDistanceBits(x, y): Compute the number of differing bits between two non-negative integers (supports Number and BigInt).

Usage

Node (ES module):

import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0
console.log(hammingDistanceBits(1, 4)); // 2

API

- hammingDistance(a: string, b: string): number
  - Throws TypeError if arguments are not strings.
  - Throws RangeError if strings have different lengths (by Unicode code points).

- hammingDistanceBits(x: number|bigint, y: number|bigint): number
  - Accepts Number (integer >= 0) or BigInt (>= 0).
  - Throws TypeError for non-number/non-BigInt arguments.
  - Throws RangeError for negative integers.

Examples

See docs/examples/hamming-output.txt and docs/evidence/hamming-results.json for example outputs and machine-readable results.
