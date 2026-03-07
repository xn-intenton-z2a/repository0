# repository0 — Hamming Distance Utilities

This project implements Hamming distance utilities for Unicode text and binary data.

Usage

Import the functions from the library:

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('\u00e9', 'e\u0301')); // 0 (after normalization)

const a = Buffer.from([0x00, 0xff]);
const b = Uint8Array.from([0xff, 0x00]);
console.log(hammingDistanceBits(a, b)); // 16
```

API

- hammingDistance(a: string, b: string): number
  - Compares strings after NFC normalization by code point (Array.from/for...of)
  - Throws TypeError if inputs are not strings
  - Throws RangeError if lengths differ after normalization

- hammingDistanceBits(x: Buffer|Uint8Array|ArrayBuffer, y: Buffer|Uint8Array|ArrayBuffer): number
  - Accepts Buffer, Uint8Array or ArrayBuffer
  - Throws TypeError for other input types
  - Throws RangeError if byte lengths differ

Website demo

Open src/web/index.html in a browser or build the docs with:

```bash
npm run build:web
# then open docs/index.html
```

Tests

Run unit tests with:

```bash
npm test
```
