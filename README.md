# Hamming Distance Library

This repository implements a small JavaScript library providing Hamming distance utilities.

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

Website demo

Open `src/web/index.html` in a browser or run:

```
npm run build:web
npm start
```

API

- hammingDistance(a: string, b: string): number
  - Throws TypeError if arguments are not strings
  - Throws RangeError if strings differ in length when measured by Unicode code points

- hammingDistanceBits(x: number|bigint, y: number|bigint): number
  - Throws TypeError if arguments are not integers (Number) or BigInt
  - Throws RangeError if arguments are negative

