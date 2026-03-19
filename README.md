# repo

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests on a schedule.

## Roman Numeral Converter

This project includes utilities to convert between integers (1–3999) and Roman numeral strings using standard subtractive notation.

Exports (named):
- intToRoman(number): returns Roman numeral string for integers 1..3999. Throws RangeError for out-of-range, TypeError for non-integer input.
- romanToInt(string): parses a Roman numeral string (strict) and returns an integer. Throws TypeError for invalid Roman numerals.

Examples:

```js
import { intToRoman, romanToInt } from './src/lib/main.js';

intToRoman(1994); // "MCMXCIV"
intToRoman(4);    // "IV"

romanToInt('MCMXCIV'); // 1994
```

Conversion table (selected):

| Integer | Roman |
|--------:|:------|
| 1 | I
| 4 | IV
| 5 | V
| 9 | IX
| 10 | X
| 40 | XL
| 50 | L
| 90 | XC
| 100 | C
| 400 | CD
| 500 | D
| 900 | CM
| 1000 | M

## Getting Started

1. Run tests: npm test
2. Build website for docs: npm run build:web

See `src/web/index.html` for a small demo that shows the converter in action.
