# Walkthrough: Hamming Distance Library

This walkthrough demonstrates the core functions and shows example outputs (also available under `docs/examples` and `docs/evidence`).

1. Compute string Hamming distance (Unicode-aware):

```js
import { hammingDistance } from './src/lib/main.js';
console.log(hammingDistance('karolin', 'kathrin'));
// => 3
```

2. Compute bit Hamming distance for integers (supports BigInt):

```js
import { hammingDistanceBits } from './src/lib/main.js';
console.log(hammingDistanceBits(1, 4));
// => 2
```

3. Notes

- The string comparison is based on Unicode code points (Array.from / string iterator). It intentionally does not perform normalization; callers should normalize if they need canonical equivalence.
- The bit-distance implementation uses BigInt internally and scales to arbitrarily large integers.

Evidence files:
- `docs/examples/example-output.txt` — human-readable examples
- `docs/evidence/output.json` — machine-readable example results

