# repo

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib).

## Hamming distance library

This package exposes small utilities for computing Hamming distances between equal-length strings (by Unicode code points) and between non-negative integers (by differing bits).

API (named exports from src/lib/main.js):

- stringHamming(a, b): number
  - Compares two strings by Unicode code points and returns the count of positions that differ.
  - Throws TypeError if inputs are not strings.
  - Throws RangeError if strings have different lengths (in code points).

- bitHamming(a, b): number
  - Compares two non-negative integers and returns the number of differing bits in their binary representation.
  - Throws TypeError if inputs are not integers.
  - Throws RangeError if inputs are negative.

Examples

```js
import { stringHamming, bitHamming } from './src/lib/main.js';

console.log(stringHamming('karolin', 'kathrin')); // 3
console.log(stringHamming('', '')); // 0
console.log(bitHamming(1, 4)); // 2
console.log(bitHamming(0, 0)); // 0
```

See tests in tests/unit/hamming.test.js for more examples and edge cases.
