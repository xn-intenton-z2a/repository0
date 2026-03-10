# Roman Numerals Library (repo)

This repository provides a small JavaScript library to convert between integers and Roman numerals.

Features

- toRoman(n): Convert integer (1..3999) to canonical Roman numeral using subtractive notation (IV, IX, XL, XC, CD, CM).
- fromRoman(s): Convert canonical Roman numeral string back to integer; throws TypeError for invalid or non-canonical numerals.

Usage (Node)

import { toRoman, fromRoman } from './src/lib/main.js';

console.log(toRoman(1994)); // MCMXCIV
console.log(fromRoman('MCMXCIV')); // 1994

API

- toRoman(n: number): string — Throws RangeError for values outside 1..3999, TypeError for non-integer input.
- fromRoman(s: string): number — Throws TypeError for invalid Roman numeral strings.

Conversion table (selected):

1 I
4 IV
5 V
9 IX
10 X
40 XL
50 L
90 XC
100 C
400 CD
500 D
900 CM
1000 M

Documentation and examples in docs/ after running:

npm run build:web

