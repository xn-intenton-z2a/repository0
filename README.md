# Hamming Distance Utilities

This library provides two small, well-tested utilities for computing Hamming distances for strings (by Unicode code points) and for integers/byte sequences (bitwise Hamming distance).

API

- hammingDistance(a, b)
  - Purpose: Compute the Hamming distance between two sequences (strings or array-like sequences such as Array, Buffer, Uint8Array).
  - Parameters:
    - a: string | Array | Buffer | Uint8Array
    - b: same type as a
  - Validation:
    - Throws TypeError if either argument is not a supported type (non-string and non-array-like).
    - For strings: compares by Unicode code points (not UTF-16 code units). Surrogate-pair characters (emoji, other non-BMP code points) count as a single position.
    - Throws RangeError if the two inputs have different lengths (number of code points for strings or length for array-like).
  - Returns: Number — the count of positions where corresponding elements/code points differ.
  - Examples (these match the unit tests):

```js
import { hammingDistance } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', ''));              // 0
```

- hammingDistanceBits(x, y)
  - Purpose: Compute the Hamming distance between two non-negative integers (count of differing bits) or between equal-length byte sequences.
  - Parameters:
    - x, y: Number (integer) | BigInt | Array | Buffer | Uint8Array
  - Validation:
    - For numeric inputs: accepts Number integers and BigInt. Throws TypeError for non-integer Numbers, and RangeError for negative values.
    - For array-like byte sequences: inputs must be equal-length; otherwise a RangeError is thrown.
    - Throws TypeError for unsupported argument types.
  - Returns: Number — the count of differing bits.
  - Examples (these match the unit tests):

```js
import { hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistanceBits(1, 4)); // 2
console.log(hammingDistanceBits(0, 0)); // 0
```

Unicode note

- Strings are compared by Unicode code points (Array.from is used internally). Characters that are represented by surrogate pairs (for example many emoji or other non-BMP characters) are treated as a single position when measuring length and when comparing.

Examples

Two runnable examples are included under `examples/hamming-usage`.

- Run with: `node examples/hamming-usage/ascii.js`
- Run with: `node examples/hamming-usage/emoji.js`

Tests

Unit tests live in `tests/unit/` and include the exact cases shown in the examples. See `tests/unit/hamming.test.js` for the canonical test cases used to validate behavior.

License: MIT
