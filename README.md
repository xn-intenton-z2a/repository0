# repository0 — FizzBuzz Library

This repository implements a small JavaScript library that provides FizzBuzz utilities and a demo website. It is intentionally minimal to serve as a learning and CI demonstration repository.

Features
- fizzBuzzSingle(n): return Fizz/Buzz/FizzBuzz or the number as string for a single positive integer
- fizzBuzz(n): return an array of FizzBuzz results from 1..n

Edge cases
- fizzBuzz(0) => []
- Negative numbers => RangeError
- Non-integers => TypeError

Usage (Node)

import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

console.log(fizzBuzzSingle(3)); // "Fizz"
console.log(fizzBuzz(15));

Usage (Browser)
Open src/web/index.html in a browser — the page imports the library and displays the demo output.

Testing
- Unit tests: npm test (vitest)
- Behaviour tests (Playwright): npm run test:behaviour

License: MIT
