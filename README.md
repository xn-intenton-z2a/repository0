# repository0

A small demo repository exposing a FizzBuzz library.

Usage examples

Import from the library and call the functions:

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

console.log(fizzBuzz(15));
// ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]

console.log(fizzBuzzSingle(3)); // 'Fizz'
console.log(fizzBuzzSingle(5)); // 'Buzz'
console.log(fizzBuzzSingle(15)); // 'FizzBuzz'
console.log(fizzBuzzSingle(7)); // '7'
```

Demo

Open src/web/fizzbuzz-demo.html in a browser to see a live demo of the library. The demo page exposes a "Single-n demo" where you can enter n and click Run; the results appear in the element with id="fizzbuzz-output".

Running tests

- Unit tests: npm test
- Behaviour tests (Playwright): npm run test:behaviour

Documentation

See docs/fizzbuzz.md for details and examples.
