# FizzBuzz Library (repo)

This repository implements a small FizzBuzz library and a demo website.

Usage (Node):

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

console.log(fizzBuzz(15));
console.log(fizzBuzzSingle(3)); // 'Fizz'
```

CLI:

```bash
node src/lib/main.js --fizzbuzz 15
```

Website demo:

1. Build the site: `npm run build:web`
2. Serve docs: `npm run start` (or `npx serve docs`)
3. Open http://localhost:5000 (serve uses port 5000 by default) or run the playwright behaviour test: `npm run test:behaviour`

API behavior and edge cases:

- fizzBuzz(n) returns an array of strings for 1..n replacing multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz".
- fizzBuzz(0) returns []
- Negative numbers throw RangeError
- Non-integers throw TypeError

