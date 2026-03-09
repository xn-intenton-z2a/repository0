# repo — FizzBuzz library

This repository implements a small FizzBuzz library and demonstrates it on a lightweight website.

Features

- fizzBuzz(n): returns an array of strings for 1..n where multiples of 3 are "Fizz", multiples of 5 are "Buzz", and multiples of both are "FizzBuzz".
- fizzBuzzSingle(n): returns the FizzBuzz string for a single positive integer.

Usage

Node library:

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

console.log(fizzBuzzSingle(3)); // 'Fizz'
console.log(fizzBuzz(15)); // ['1','2','Fizz','4','Buzz',...,'FizzBuzz']
```

Website demo

Run:

```bash
npm run build:web
npm start
```

Open http://localhost:5000 (or the address printed by serve) to see the demo; the page displays fizzBuzz(15).

API behaviour

- fizzBuzz(0) => []
- fizzBuzz(n) with n < 0 => throws RangeError
- fizzBuzz(n) with non-integer => throws TypeError
- fizzBuzzSingle(n) requires integer > 0, non-integer => TypeError, <=0 => RangeError

License: MIT
