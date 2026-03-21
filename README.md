# repo

This repository is powered by [intenti&ouml;n agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests.

## FizzBuzz Library

This project implements a small FizzBuzz library exported from src/lib/main.js.

Usage examples:

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

console.log(fizzBuzz(15));
// [ '1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz' ]

console.log(fizzBuzzSingle(3)); // 'Fizz'
console.log(fizzBuzzSingle(5)); // 'Buzz'
console.log(fizzBuzzSingle(15)); // 'FizzBuzz'
console.log(fizzBuzzSingle(7)); // '7'

// Edge cases
console.log(fizzBuzz(0)); // []
// fizzBuzz(-1) -> throws RangeError
// fizzBuzz(3.5) -> throws TypeError
```

See tests in tests/unit/fizzbuzz.test.js for expected behaviour.

## Getting Started

... (rest of README omitted for brevity)
