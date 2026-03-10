# Hamming Distance Library

A small JavaScript library providing Hamming distance utilities, with Unicode-aware string comparison and bitwise integer comparison.

Features
- hammingDistance(a, b): compute Hamming distance between two strings (compares Unicode code points)
- hammingDistanceBits(x, y): compute Hamming distance between two non-negative integers (counts differing bits). Accepts Number (integer) or BigInt.

Usage examples

Import from the library:

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0
console.log(hammingDistanceBits(1, 4)); // 2
```

Browser demo

The repository includes a simple website demo under `src/web/`. To build and serve the demo:

```
npm run build:web
npm start
```

Open http://localhost:5000 (or as printed by serve) and view the Hamming distance demo.

Examples & Evidence

- Demo output example: `docs/examples/demo-output.json`
- Evidence summary: `docs/evidence/summary.json`

API

- hammingDistance(a: string, b: string): number
  - Throws TypeError if arguments are not strings
  - Throws RangeError if strings differ in length when measured by Unicode code points
  - Compares by Unicode code points (Array.from) so surrogate pairs and emoji are treated correctly

- hammingDistanceBits(x: number|bigint, y: number|bigint): number
  - Throws TypeError if arguments are not integers (Number) or BigInt
  - Throws RangeError if arguments are negative
  - Returns a Number equal to the count of differing bits (works for arbitrarily large BigInt values)

Testing

- Unit tests: `npm test` (Vitest)
- Behaviour tests: `npm run test:behaviour` (builds the web demo and runs Playwright)

License: MIT
