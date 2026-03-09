# repository0 — FizzBuzz Feature

This repository demonstrates a small library feature: FizzBuzz, with full unit tests, a browser demo, Playwright behaviour tests, and documentation.

Usage

- Library API (node):

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';
console.log(fizzBuzz(15));
console.log(fizzBuzzSingle(3));
```

- CLI:

Run `npm run start:cli` or `node src/lib/main.js` to print FizzBuzz for n=100 to stdout (one entry per line).

Testing

- Unit tests: `npm test`
- Behaviour tests (Playwright): `npm run test:behaviour` (this runs `npm run build:web` then Playwright)

Website demo

- Build the web demo: `npm run build:web` (this copies `src/web/*` to `docs/`)
- Serve the demo locally: `npm run start` and open `http://localhost:3000/fizzbuzz.html` or visit the built `docs/fizzbuzz.html`.

Examples

- `fizzBuzz(15)` returns:

```
["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
```

- `fizzBuzzSingle(5)` returns `"Buzz"`.

Notes

- Input validation: all functions throw `TypeError` with message exactly "n must be a non-negative integer" when called with invalid inputs (non-number, non-integer, or negative).

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
