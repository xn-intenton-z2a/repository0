# repo

This repository is powered by [intenti&ouml;n agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests.

## FizzBuzz Usage Examples

This project exports two named functions from src/lib/main.js: fizzBuzz(n) and fizzBuzzSingle(n).

- fizzBuzz(n): returns an array of length n containing FizzBuzz replacements for 1..n. fizzBuzz(0) returns an empty array.
- fizzBuzzSingle(n): returns the FizzBuzz string for a single integer.

Edge cases:
- n = 0 -> fizzBuzz returns []
- negative n -> functions throw RangeError
- non-integer numbers -> functions throw TypeError

Examples:

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

fizzBuzz(15);
// [ '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz' ]

fizzBuzzSingle(3); // 'Fizz'
fizzBuzzSingle(5); // 'Buzz'
fizzBuzzSingle(15); // 'FizzBuzz'
fizzBuzzSingle(7); // '7'
```

Rest of README follows original project usage and instructions.
