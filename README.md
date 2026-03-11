# repo — Hamming Distance Library

This repository provides a small JavaScript library for computing Hamming distances for strings and integers.

## Features

- hammingDistance(a, b): Compare two strings by Unicode code points and return the number of differing positions.
- hammingDistanceBits(x, y): Compare two non-negative integers (Number or BigInt) and return the number of differing bits.

All functions validate inputs and throw JavaScript Error types for invalid usage.

## Usage

Import from the library:

```js
import { hammingDistance, hammingDistanceBits, getIdentity } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0
try {
  hammingDistance('a', 'bb');
} catch (err) {
  console.error(err.name); // RangeError
}

console.log(hammingDistanceBits(1, 4)); // 2
console.log(hammingDistanceBits(0, 0)); // 0

// BigInt support
console.log(hammingDistanceBits(1n, 4n)); // 2

console.log(getIdentity()); // { name, version, description }
```

## API

- hammingDistance(a: string, b: string): number
  - Throws TypeError if either argument is not a string.
  - Throws RangeError if the strings have different lengths when interpreted as Unicode code points.

- hammingDistanceBits(x: number|bigint, y: number|bigint): number
  - Accepts Number (integer) or BigInt.
  - Throws TypeError for non-integer arguments.
  - Throws RangeError for negative values.

## Web demo

The site in `src/web/index.html` demonstrates both functions. Run:

```bash
npm run build:web
npx serve docs
```

`npm run build:web` generates `docs/lib-meta.js` and `docs/lib.js` used by the browser demo.

## Tests

Unit tests are in `tests/unit/` and behaviour tests (Playwright) are in `tests/behaviour/`.

```bash
npm test          # run unit tests (Vitest)
npm run test:behaviour  # build web demo and run Playwright tests
```

## License

MIT
