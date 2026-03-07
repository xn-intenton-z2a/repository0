# repository0 — FizzBuzz Library

This repository provides a small JavaScript library implementing the classic FizzBuzz functions and a tiny CLI.

Usage (library)

Import the functions and call them directly:

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

fizzBuzz(3); // ['1','2','Fizz']
fizzBuzzSingle(3); // 'Fizz'
fizzBuzzSingle(5); // 'Buzz'
fizzBuzz(15)[14]; // 'FizzBuzz'
```

Edge cases

- `fizzBuzz(0)` returns `[]`.
- Negative n throws RangeError with message exactly: `n must be a non-negative integer`.
- Non-integer inputs (including strings, NaN, Infinity, fractional numbers) throw TypeError with message exactly: `n must be an integer`.

CLI

Run the CLI directly:

```bash
node src/lib/main.js 15
# or using npm script
npm run start:cli -- 15
```

The CLI accepts a single positional integer argument `n` and prints one line per value from `1..n` using the FizzBuzz rules. Exit codes:
- Missing arg: prints usage to stderr and exits with code 1
- Invalid input (non-integer, negative, NaN, Infinity): prints a helpful error and exits with code 2
- Success (including n=0): exits with code 0

Examples

```bash
node src/lib/main.js 3
# prints:
# 1
# 2
# Fizz

node src/lib/main.js 15
# prints 15 lines ending with FizzBuzz
```

Website examples

The `src/web/` directory includes three small example pages that are copied into `docs/` by `npm run build:web`:

- `static-15.html` — renders `fizzBuzz(15)` in a pre block
- `interactive.html` — input box + button to render `fizzBuzz(n)` with validation
- `single-value.html` — shows `fizzBuzzSingle(n)` for a user-provided number

Testing

Run unit tests with:

```bash
npm ci
npm test
```
