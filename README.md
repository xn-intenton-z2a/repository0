# repo

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests on a schedule.

## FizzBuzz Library

This project exposes two named exports for working with the classic FizzBuzz kata:

- fizzBuzz(n): returns an array of strings representing numbers from 1..n with substitutions for multiples of 3 and/or 5.
- fizzBuzzSingle(n): returns the fizzbuzz string for a single positive integer.

Both functions validate inputs:
- Non-integer inputs throw TypeError
- Negative numbers throw RangeError
- fizzBuzz(0) returns an empty array

### Examples

Node / ESM usage:

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

console.log(fizzBuzzSingle(3)); // 'Fizz'
console.log(fizzBuzzSingle(5)); // 'Buzz'
console.log(fizzBuzzSingle(15)); // 'FizzBuzz'
console.log(fizzBuzzSingle(7)); // '7'

console.log(fizzBuzz(15));
// [ '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz' ]
```

Browser (via src/web/index.html): the demo on the page shows fizzBuzz(15) and example single values.

## Getting Started

1. **Write your mission** in [`MISSION.md`](MISSION.md) — describe what you want to build in plain English
2. **Configure GitHub** — see [Setup](#setup) in the original README

(Other documentation unchanged.)
