# FizzBuzz

This project provides a FizzBuzz library and CLI exported from `src/lib/main.js`.

API (ESM)

- fizzBuzz(n): returns an array of strings for 1..n (n >= 0)
- fizzBuzzSingle(n): returns the single FizzBuzz string for n (n >= 1)
- fizzBuzzStream(n): returns an async iterable that yields strings for 1..n
- createFizzBuzzReadable(n): returns a Node.js Readable (objectMode) that emits the same strings

Validation rules:
- Values must be integers
- fizzBuzz: n >= 0 (zero returns [])
- fizzBuzzSingle: n >= 1
- Negative values throw RangeError; non-integers throw TypeError

Examples

```js
import { fizzBuzz, fizzBuzzSingle } from '../src/lib/main.js';
console.log(fizzBuzzSingle(3)); // 'Fizz'
console.log(fizzBuzz(15)); // array of 1..15 with substitutions

// streaming
for await (const v of fizzBuzzStream(5)) console.log(v);

// readable
const r = createFizzBuzzReadable(5);
for await (const v of r) console.log(v);
```

CLI

```bash
node src/lib/main.js single 3
node src/lib/main.js range 15
```

See docs/examples/fizz_output.txt and docs/evidence/fizz_output.json for sample output.
