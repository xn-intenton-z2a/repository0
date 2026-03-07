# repo — FizzBuzz Library

This repository implements a small JavaScript library that provides FizzBuzz functions.

Features
- fizzBuzz(n): returns an array of strings from 1..n with Fizz/Buzz substitutions.
- fizzBuzzSingle(n): returns the FizzBuzz string for a single positive integer.

Usage

Node.js example:

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

console.log(fizzBuzz(15));
// ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz']

console.log(fizzBuzzSingle(3)); // 'Fizz'
console.log(fizzBuzzSingle(5)); // 'Buzz'
console.log(fizzBuzzSingle(15)); // 'FizzBuzz'
console.log(fizzBuzzSingle(7)); // '7'
```

Edge cases
- fizzBuzz(0) returns []
- Negative numbers throw RangeError
- Non-integers throw TypeError

Website demo
- Run `npm run build:web` then open `docs/index.html` to see a live demo produced from `src/web/`.

Testing

Run unit tests:

```bash
npm ci
npm test
```

License: MIT
