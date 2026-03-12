# repository0

A small library demonstrating simple utilities and a web demo. This change implements a FizzBuzz library as the core feature.

## Installation

Install dependencies:

npm ci

Run tests:

npm test
npm run test:behaviour

## API

Import the functions from the library:

import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

Examples:

- fizzBuzz(15) // -> array of 15 strings, last is "FizzBuzz"
- fizzBuzzSingle(3) // -> "Fizz"
- fizzBuzzSingle(5) // -> "Buzz"
- fizzBuzzSingle(7) // -> "7"

Edge cases:

- fizzBuzz(0) -> []
- Non-integer inputs -> TypeError
- Negative inputs -> RangeError

## Website demo

Open `src/web/index.html` in a browser or run the behaviour tests which start a local server and navigate to the demo page.
