# Roman Numerals Library (repo)

This repository provides a small JavaScript library to convert between integers and Roman numerals.

Features

- toRoman(n): Convert integer (1..3999) to canonical Roman numeral using subtractive notation (IV, IX, XL, XC, CD, CM).
- fromRoman(s): Convert a Roman numeral string back to an integer; invalid or non-canonical strings throw TypeError (see note on "IIII").

Getting started (Node)

import { toRoman, fromRoman, getIdentity } from './src/lib/main.js';

console.log(toRoman(1994)); // MCMXCIV
console.log(fromRoman('MCMXCIV')); // 1994
console.log(getIdentity()); // { name, version, description }

API

- toRoman(n: number): string — Throws RangeError for values outside 1..3999, TypeError for non-integer input.
- fromRoman(s: string): number — Throws TypeError for invalid or non-canonical Roman numeral strings.
- getIdentity(): object — Returns library metadata (name, version, description).

Notes on non-canonical input

This library enforces canonical Roman numerals using standard subtractive notation. For example,
- "IIII" is considered non-canonical and will throw TypeError. The library chooses strict validation to
  preserve a reversible round-trip property: fromRoman(toRoman(n)) === n for n in 1..3999.

Conversion table (selected)

1  -> I
4  -> IV
5  -> V
9  -> IX
10 -> X
40 -> XL
50 -> L
90 -> XC
100 -> C
400 -> CD
500 -> D
900 -> CM
1000 -> M

Website demo

Run `npm run build:web` and then `npm run start` to build the demo and serve docs/ on localhost. The site demonstrates examples and a round-trip check.

Documentation, examples and evidence are available under docs/ (docs/examples, docs/evidence, docs/reports).
