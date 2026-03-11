# repo

Hamming distance library and demo.

This repository implements two core functions for the mission:

- hammingDistance(a, b): Hamming distance between two strings (compares Unicode code points)
- hammingDistanceBits(x, y): Hamming distance between two non-negative integers (counts differing bits)

Both functions are exported from `src/lib/main.js` and covered by unit tests in `tests/unit/`.

Usage examples

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0
console.log(hammingDistanceBits(1, 4)); // 2
```

Run tests

```bash
npm ci
npm test
```

See `tests/unit/hamming.test.js` for more examples and edge cases.
