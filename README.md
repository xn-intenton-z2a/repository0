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

## CLI / examples

A small command-line interface example is available at examples/hamming-cli.js that imports the library's named exports from src/lib/main.js and exposes two modes:

- string: compare two Unicode strings by code point and print the Hamming distance
- bits: compare two non-negative integers and print the Hamming bit-distance

Usage examples:

- node examples/hamming-cli.js string karolin kathrin  # prints: 3
- node examples/hamming-cli.js bits 1 4              # prints: 2

The CLI intentionally imports the library functions (it does not reimplement the core logic) and mirrors the library's TypeError/RangeError semantics for validation.
