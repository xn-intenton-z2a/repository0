# Hamming Distance Utilities

Small JavaScript library providing Unicode-aware Hamming distance utilities.

Features
- hammingDistance(a, b): computes Hamming distance between two strings (compares Unicode code points)
- hammingDistanceBits(x, y): computes bitwise Hamming distance between two non-negative integers (number of differing bits)

Installation

This repository is a library template. To run tests:

```bash
npm install
npm test
```

API

import { hammingDistance, hammingDistanceBits } from './src/lib/main.js'

hammingDistance(a, b)
- a: string
- b: string
- returns: number (count of code points that differ)
- throws: TypeError if inputs are not strings; RangeError if strings have different lengths (in Unicode code points)

Examples

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js'

console.log(hammingDistance('karolin', 'kathrin')) // 3
console.log(hammingDistance('', '')) // 0

console.log(hammingDistance('a\u{1F600}', 'a\u{1F601}')) // 1 (emoji differ)

console.log(hammingDistanceBits(1, 4)) // 2 (001 vs 100)
console.log(hammingDistanceBits(0, 0)) // 0
```

Errors

- hammingDistance: TypeError for non-strings; RangeError for unequal-length strings (measured in code points)
- hammingDistanceBits: TypeError for non-integer inputs; RangeError for negative integers

Testing

Unit tests are in `tests/unit/` and cover normal, edge and error cases.

License

MIT
