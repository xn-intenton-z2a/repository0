# repo

A small library and demo for computing Hamming distances between equal-length strings and non-negative integers.

This repository demonstrates two functions exported from `src/lib/main.js`:

- `stringHamming(a, b)` — Unicode-aware Hamming distance between two strings (compares code points).
- `intHamming(a, b)` — Bit-level Hamming distance between two non-negative integers (Number or BigInt).

Both functions validate inputs and throw appropriate errors:
- `TypeError` for wrong argument types
- `RangeError` for negative integers or unequal-length strings

## Usage (Node)

import the functions from the library:

```js
import { stringHamming, intHamming } from './src/lib/main.js';

console.log(stringHamming('karolin', 'kathrin')); // 3
console.log(stringHamming('', '')); // 0
console.log(intHamming(1, 4)); // 2
console.log(intHamming(0, 0)); // 0

// BigInt support for very large integers
console.log(intHamming(0n, BigInt('0b' + '1'.repeat(80)))); // 80
```

## Usage (Browser)

Open `src/web/index.html` in a browser. The page imports `src/web/lib.js` which re-exports from the real library and provides an interactive demo for both functions. The page attaches the library to `window.lib` for quick experimentation.

## Error handling examples

```js
try {
  stringHamming('a', 'ab');
} catch (e) {
  console.error(e.name); // RangeError
}

try {
  intHamming(-1, 2);
} catch (e) {
  console.error(e.name); // RangeError
}
```

## API

stringHamming(a: string, b: string): number
- a and b must be strings
- compares code points (Unicode-aware)
- returns the number of positions with differing code points

intHamming(a: number|bigint, b: number|bigint): number
- a and b must be non-negative integers (Number or BigInt)
- returns the number of differing bits

## Running tests

Unit tests: `npm test`
Behaviour tests (Playwright): `npm run test:behaviour` (requires Playwright)

## License

MIT
