# FizzBuzz Documentation

This document shows usage examples for the FizzBuzz library exported by src/lib/main.js.

API

- fizzBuzz(n): returns an array of strings for values 1..n. Throws TypeError for non-integer inputs and RangeError for negative values.
- fizzBuzzSingle(n): returns the FizzBuzz string for a single integer n. Throws the same errors as fizzBuzz for invalid input.

Examples

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

fizzBuzz(15); // ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz']

fizzBuzzSingle(3); // 'Fizz'
fizzBuzzSingle(5); // 'Buzz'
fizzBuzzSingle(15); // 'FizzBuzz'
fizzBuzzSingle(7); // '7'
```

Web demo

Open `src/web/fizzbuzz-demo.html` in a browser to try a small UI that uses the library. The page includes a "Single-n demo" with an input (id="fizz-n") and a Run button (id="fizz-run"). The results are rendered into the element with id="fizzbuzz-output".

Running behaviour tests

Run Playwright tests with:

```
npm run test:behaviour
```

