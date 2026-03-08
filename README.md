# Roman Numerals Library

This repository implements a small library for converting between integers and Roman numerals.

Usage (API):

import { toRoman, fromRoman } from './src/lib/main.js'

- toRoman(n): converts integer n (1..3999) to canonical Roman numeral string; throws TypeError for non-integers and RangeError for values outside 1..3999.
- fromRoman(s): converts canonical uppercase Roman numeral string s to integer; throws TypeError for non-string inputs and SyntaxError for invalid/non-canonical numerals.

Website demo available at src/web/index.html. Build with npm run build:web and serve docs/ to open the demo.
