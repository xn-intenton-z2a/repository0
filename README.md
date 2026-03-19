# repo

A small library for computing Hamming distances between strings and non-negative integers.

## API

Import named functions from src/lib/main.js:

- hammingString(a, b): number
  - Computes Hamming distance between two strings by Unicode code points.
  - Throws TypeError if inputs are not strings.
  - Throws RangeError if strings have different lengths (in Unicode code points).

- hammingBits(a, b): number
  - Computes Hamming distance between two non-negative integers by differing bits.
  - Throws TypeError if inputs are not integers.
  - Throws RangeError if any integer is negative.

- getIdentity(): { name, version, description }

## Examples

```js
import { hammingString, hammingBits } from './src/lib/main.js';

console.log(hammingString('karolin','kathrin')); // 3
console.log(hammingString('','')); // 0
console.log(hammingBits(1,4)); // 2
console.log(hammingBits(0,0)); // 0
```

## Website demo

Open `src/web/index.html` in a browser; it imports the library and displays demo examples including:
- hammingString('karolin','kathrin') => 3
- hammingString('','') => 0
- hammingBits(1,4) => 2
- hammingBits(0,0) => 0

## Tests

Run unit tests with:

```
npm test
```
