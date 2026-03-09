# repository0

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

