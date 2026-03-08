# Hamming Distance

This document describes the hamming(a, b) function exported by the library.

## Algorithm
The Hamming distance is the number of positions at which the corresponding symbols are different.

- For strings: comparison is by UTF-16 code unit (JavaScript charCodeAt) as implemented.
- For byte-like objects: comparison is by byte value (Uint8Array, Buffer, typed arrays views).

Time complexity: O(n) where n is the length of the inputs. Additional space: O(1).

## Usage (Node)

import { hamming } from 'src/lib/main.js';

console.log(hamming('abc', 'abd')); // 1

// Byte arrays
console.log(hamming(new Uint8Array([1,2,3]), new Uint8Array([1,4,3]))); // 1

## Usage (Browser)

Open the demo at `src/web/index.html` or after building the site run `npm run build:web` and open `docs/index.html`.

## Edge cases
- Input types must both be strings or both be byte-like views; otherwise a TypeError is thrown.
- Inputs must be the same length; otherwise a TypeError is thrown with a message containing `length`.

