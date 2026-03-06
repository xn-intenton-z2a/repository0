# repo

A JavaScript library exporting Hamming distance functions.

Usage

Import the utilities:

```js
import { hammingDistanceString, hammingDistanceInt } from './src/lib/hamming.js';

// strings
hammingDistanceString('karolin', 'kathrin'); // 3

// integers
hammingDistanceInt(1, 4); // 2
```

APIs

- hammingDistanceString(a: string, b: string, options?: { permissive?: boolean }) -> number
  - strict mode (default): throws TypeError on length mismatch
  - permissive: counts tail length differences
- hammingDistanceInt(a: number|bigint, b: number|bigint) -> number
  - accepts non-negative Number or BigInt; throws TypeError otherwise

Documentation and examples are in docs/.
