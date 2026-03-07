# repo — FizzBuzz Library

Minimal JavaScript library implementing FizzBuzz with comprehensive tests and a small web demo.

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

CLI

Run the CLI demo:

```bash
node src/lib/main.js --identity
```

Website demo

Run `npm run build:web` then serve the `docs/` directory (or open `src/web/index.html`) to see an interactive demo that calls the browser-compatible library and displays the output.

Tests

Run unit tests with:

```bash
npm test
```

Docs and examples

- docs/examples/fizzbuzz-output.txt — sample output for n=15
- docs/evidence/fizzbuzz.json — machine-readable JSON output
- docs/reports/usage.txt — short usage walkthrough

License

MIT
