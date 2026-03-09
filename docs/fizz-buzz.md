# FizzBuzz Feature

This project includes a small FizzBuzz library and demo.

## Feature

- fizzBuzz(n): returns an array of strings for numbers 1..n following FizzBuzz rules.
- fizzBuzzSingle(n): returns the FizzBuzz string for a single positive integer.

## Usage (ESM)

Import from the library in Node.js (ESM):

```js
import { fizzBuzz } from './src/lib/main.js';

console.log(fizzBuzz(15));
```

## CLI

Run the CLI to print the first N values (defaults to 100):

```bash
node src/lib/main.js 20
```

## Browser Demo

The site at `src/web/index.html` (built into `docs/`) includes a small browser shim that implements the same API and demonstrates usage.

## Example output (first 15)

```
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
```

