# repo

This repository implements a small JavaScript library that provides Hamming distance functions and a demo website.

## Features

- hammingDistance(a, b): compute Hamming distance between two strings (compares Unicode code points)
- hammingDistanceBits(x, y): compute Hamming distance between two non-negative integers (counts differing bits). Accepts Number (integer) or BigInt.

## Usage

Import from the library (Node or browser):

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0
console.log(hammingDistanceBits(1, 4)); // 2
```

## API

- hammingDistance(a: string, b: string): number
  - Throws TypeError if arguments are not strings.
  - Throws RangeError if strings differ in length when measured in Unicode code points.

- hammingDistanceBits(x: number|bigint, y: number|bigint): number
  - Accepts integer Number values or BigInt.
  - Throws TypeError for non-integer or non-number/bigint types.
  - Throws RangeError for negative values.

## Website demo

Open `src/web/index.html` in a browser (or run `npm run start` to serve `docs/`) to see a small demo that calls the library and shows example outputs.

## Tests

Run unit tests with:

```
npm ci && npm test
```

The tests cover normal cases and error handling for both functions.
