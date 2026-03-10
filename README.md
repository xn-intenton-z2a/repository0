# repository0

A small JavaScript library demonstrating FizzBuzz functionality and a browser demo.

## Library API

Import from src/lib/main.js (or use the packaged entry):

import { fizzBuzz, fizzBuzzSingle, getIdentity } from './src/lib/main.js';

Examples:

- fizzBuzz(15) returns an array of 15 strings with Fizz/Buzz substitutions.
- fizzBuzzSingle(3) returns 'Fizz'.

Edge cases:

- fizzBuzz(0) returns an empty array []
- Passing a non-integer throws TypeError with message 'n must be an integer'
- Passing negative numbers throws RangeError with messages as documented

## Web demo

Open the demo:

npm run build:web
npm start

Then visit http://localhost:5000 (or the port served by `serve`) to see the demo. The demo uses the core library exports.

## Tests

Run unit tests:

npm test

Run behaviour tests (requires Playwright):

npm run test:behaviour
