# repo — Hamming utilities

This package provides two small utility functions for computing Hamming distance:

- `hammingDistance(a, b)` — compares two strings (Unicode-safe, NFC normalisation) and returns the number of code point positions that differ. Throws TypeError for non-strings and RangeError if lengths differ after normalization.

- `hammingDistanceBits(x, y)` — compares two byte sequences and returns the number of differing bits. Accepts `string | Buffer | Uint8Array`. Strings are NFC-normalised and UTF-8 encoded before comparison. Throws TypeError for unsupported types and RangeError if byte lengths differ.

Examples

```js
import { hammingDistance, hammingDistanceBits } from './src/lib/main.js';

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('e\u0301', 'é')); // 0
console.log(hammingDistanceBits('a', 'b')); // 2
```

See `tests/unit/main.test.js` for more examples.
