# Roman Numeral Converter

A small JavaScript library for converting between integers (1..3999) and Roman numeral strings using standard subtractive notation.

Usage

```js
import { toRoman, fromRoman } from './src/lib/main.js';

console.log(toRoman(1994)); // 'MCMXCIV'
console.log(fromRoman('MCMXCIV')); // 1994
```

Notes

- toRoman(n) throws RangeError if n is outside 1..3999.
- fromRoman(s) throws TypeError for invalid or non-standard Roman numeral strings (e.g. 'IIII' is rejected).

Conversion table (common values)

| Number | Roman |
|--------|-------|
| 1      | I     |
| 4      | IV    |
| 5      | V     |
| 9      | IX    |
| 10     | X     |
| 40     | XL    |
| 50     | L     |
| 90     | XC    |
| 100    | C     |
| 400    | CD    |
| 500    | D     |
| 900    | CM    |
| 1000   | M     |

API

- toRoman(n: number): string
- fromRoman(s: string): number

License: MIT
