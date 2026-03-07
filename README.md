# FizzBuzz Library

A tiny JavaScript library exporting FizzBuzz functions.

Usage (Node):

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

console.log(fizzBuzzSingle(3)); // "Fizz"
console.log(fizzBuzz(15).join('\n'));
```

CLI:

```bash
node src/lib/main.js  # runs basic identity output; use the exported functions in your scripts
```

Examples:

- fizzBuzz(15) returns an array of 15 strings ending with "FizzBuzz".
- fizzBuzzSingle(7) returns "7".

See docs/ for example output and evidence data.
