# FizzBuzz

This project includes a small FizzBuzz library with a minimal, dependency-free API.

API (ESM)

- fizz(value): returns "Fizz", "Buzz", "FizzBuzz", or the number as a string for a single integer value >= 1.
- fizzSequence(n): returns an array of fizz(...) results for integers 1..n. n === 0 returns an empty array. Negative values throw RangeError; non-integers throw TypeError.

Examples

```js
import { fizz } from '../src/lib/fizzbuzz.js';
import { fizzSequence } from '../src/lib/fizzbuzz.js';

console.log(fizz(3)); // "Fizz"
console.log(fizz(5)); // "Buzz"
console.log(fizz(15)); // "FizzBuzz"
console.log(fizzSequence(15));
```

The website includes a short demonstration and example output in docs/examples.
