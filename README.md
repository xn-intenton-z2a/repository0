# repository0

A minimal FizzBuzz library and demo.

## API

Import named functions from src/lib/main.js

- fizzBuzz(n)
  - Input: finite integer n. Returns array of strings for 1..n with Fizz/Buzz substitutions.
  - Errors: throws TypeError with message exactly "fizzBuzz: n must be a finite integer" for non-integers.
  - Example: fizzBuzz(15) returns an array of 15 strings ending with "FizzBuzz".

- fizzBuzzSingle(n)
  - Input: finite integer n. Returns a single string for n applying Fizz/Buzz rules.
  - Errors: throws TypeError with message exactly "fizzBuzz: n must be a finite integer" for non-integers.
  - Examples: fizzBuzzSingle(3) -> "Fizz", fizzBuzzSingle(5) -> "Buzz", fizzBuzzSingle(7) -> "7", fizzBuzzSingle(0) -> "FizzBuzz", fizzBuzzSingle(-3) -> "Fizz".

- fizzBuzzRange(start,end)
  - Input: two finite integers. Returns an array of fizzBuzzSingle(i) for each i from start to end inclusive.
  - Ordering: ascending if start <= end, descending if start > end.
  - Errors: throws TypeError with message exactly "fizzBuzzRange: start and end must be finite integers" for invalid inputs; throws RangeError with message exactly "fizzBuzzRange: range too large" when requested range length exceeds 10000.
  - Examples: fizzBuzzRange(1,5) -> ["1","2","Fizz","4","Buzz"], fizzBuzzRange(5,1) -> ["Buzz","4","Fizz","2","1"].

## Demo

Open the website demo:

- Build site: npm run build:web
- Serve: npm run start

The demo allows selecting start and end and displays the fizzbuzz results.

## Tests

- Unit tests: npm test
- Behaviour tests (Playwright): npm run test:behaviour


This repository demonstrates a simple FizzBuzz library with unit tests and a web demo.

## FizzBuzz

The library exports fizzBuzz(n) and fizzBuzzSingle(n).

Example usage in Node:

```js
import { fizzBuzz } from './src/lib/main.js';
console.log(fizzBuzz(5)); // [1,2,'Fizz',4,'Buzz']
```

CLI usage:

```bash
node src/lib/main.js 5
# prints: [1,2,"Fizz",4,"Buzz"]
```

Web demo:

Run:

```bash
npm run start
```

Open http://localhost:3000 and use the demo input (N=15 by default).

Behavior and edge cases:
- Non-finite or non-integer values throw TypeError with message: "n must be a finite integer"
- n <= 0 returns an empty array

