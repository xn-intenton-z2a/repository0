# repo

This repository is powered by [intentiön agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests.

## FizzBuzz Library (fizz-buzz)

This project implements a small JavaScript library exposing two named functions:

- fizzBuzz(n): returns an array of strings from 1..n following FizzBuzz rules
- fizzBuzzSingle(n): returns the FizzBuzz string for a single positive integer

Edge cases:
- fizzBuzz(0) returns []
- Negative numbers throw RangeError
- Non-integer numbers throw TypeError

### Examples

Import and use in Node or browser (ESM):

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

console.log(fizzBuzz(15));
// [ '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz' ]

console.log(fizzBuzzSingle(3)); // 'Fizz'
console.log(fizzBuzzSingle(5)); // 'Buzz'
console.log(fizzBuzzSingle(15)); // 'FizzBuzz'
console.log(fizzBuzzSingle(7)); // '7'
```

Errors and validation:
- fizzBuzz(0) -> []
- fizzBuzz(-1) -> RangeError
- fizzBuzz(3.5) -> TypeError
- fizzBuzzSingle(0) -> RangeError

## Getting Started

### Run tests

```bash
npm ci && npm test
```

## Website demo

Open `src/web/index.html` in a browser to see a small demo that uses the library and shows example outputs and invalid-input handling.

For more details see MISSION.md and the tests in `tests/unit/` and `tests/behaviour/`.
