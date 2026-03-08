# Roman Numerals Library

This repository provides a small JavaScript library for converting between integers and Roman numerals.

Features

- toRoman(n): convert integer 1..3999 to canonical Roman numerals using subtractive notation.
- fromRoman(s): parse canonical Roman numerals (uppercase) back to integers.

Usage (API)

import { toRoman, fromRoman } from './src/lib/main.js';

toRoman(1994); // 'MCMXCIV'
fromRoman('MCMXCIV'); // 1994

Errors

- toRoman throws TypeError for non-integers, RangeError for values outside 1..3999.
- fromRoman throws TypeError for non-strings and SyntaxError for invalid or non-canonical numerals.

Demo

Run the demo locally:

npm run build:web
npm start

Then open docs/index.html.

Documentation

See docs/examples and docs/evidence for example output.
