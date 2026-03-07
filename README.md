# repo — FizzBuzz Library

This repository provides a minimal JavaScript library that implements the classic FizzBuzz functions.

Features
- fizzBuzz(n): returns an array of FizzBuzz strings from 1..n (empty array for n = 0)
- fizzBuzzSingle(n): returns the FizzBuzz value for a single positive integer

Edge cases
- Non-integer inputs throw TypeError
- Negative numbers throw RangeError
- fizzBuzz(0) returns []

Usage

Node.js example:

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

console.log(fizzBuzzSingle(3)); // 'Fizz'
console.log(fizzBuzz(15));
```

Website demo

Open `src/web/index.html` in a browser (or run `npm run build:web` and serve `docs/`) to see a small demo that calls the browser-compatible library and displays output.

Tests

Run unit tests with:

```bash
npm ci
npm test
```

License

MIT
