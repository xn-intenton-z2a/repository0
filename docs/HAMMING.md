# Hamming Distance

This document describes the hamming(a,b) function provided by the library.

## Algorithm
- For string inputs, comparison is by UTF-16 code unit (String.charCodeAt) at each index.
- For byte inputs (Uint8Array or other ArrayBuffer views), comparison is by byte value.
- Time complexity: O(n) where n is the input length. Space: O(1) extra.

## Usage (Node)
import { hamming } from './src/lib/main.js';

console.log(hamming('karolin','kathrin')); // 3

## Usage (Browser)
The demo at src/web/index.html demonstrates the library. Build the web assets with:

npm run build:web

Then open docs/index.html in a browser.

## Edge cases
- Inputs must be the same length; otherwise a TypeError is thrown containing the word "length".
- Inputs must be strings or ArrayBuffer views (Uint8Array, Buffer, etc); otherwise TypeError is thrown.
- Empty inputs return 0.
