# FizzBuzz Documentation

This document shows usage examples for the FizzBuzz library exported by src/lib/main.js.

API

- fizzbuzzNumber(n): returns a string for a single integer n. Throws TypeError('n must be an integer') for non-integers.
- fizzbuzzRange(start, end): returns an array of strings applying fizzbuzzNumber to each integer from start to end inclusive. Throws TypeError('start and end must be integers') or RangeError('start must be <= end') as appropriate.

Examples

```js
import { fizzbuzzNumber, fizzbuzzRange } from './src/lib/main.js';

fizzbuzzNumber(3); // 'Fizz'
fizzbuzzNumber(5); // 'Buzz'
fizzbuzzNumber(15); // 'FizzBuzz'
fizzbuzzNumber(7); // '7'

fizzbuzzRange(1,5); // ['1','2','Fizz','4','Buzz']
```

Web demo

Open `src/web/fizzbuzz-demo.html` in a browser to try a small UI that uses the library.

Running behaviour tests

Run Playwright tests with:

```
npm run test:behaviour
```

