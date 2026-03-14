# repo

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests on a schedule.

## Hamming distance: computeHamming

A Unicode-aware Hamming distance implementation is provided as computeHamming(a, b) exported from src/lib/main.js.

- Throws TypeError("Inputs must be strings") for non-string inputs.
- Throws RangeError("Inputs must have same length") when inputs differ in length (measured in user-perceived characters when supported by the environment).
- Uses Intl.Segmenter with granularity 'grapheme' when available and falls back to Array.from otherwise.

Example:

import { computeHamming } from './src/lib/main.js';
console.log(computeHamming('karolin', 'kathrin')); // 3

## FizzBuzz: fizzBuzz and fizzBuzzSingle

Two named exports are available from src/lib/main.js:

- fizzBuzz(n): returns an array of strings from 1..n applying FizzBuzz rules. fizzBuzz(0) returns [].
- fizzBuzzSingle(n): returns the single FizzBuzz string for a positive integer n.

Validation rules
- Non-integer inputs throw TypeError.
- For fizzBuzz: negative n throws RangeError (n must be >= 0).
- For fizzBuzzSingle: non-positive n (<= 0) throws RangeError (n must be a positive integer).

Examples:

import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';
console.log(fizzBuzz(15));
// ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz']

console.log(fizzBuzzSingle(3)); // 'Fizz'
console.log(fizzBuzzSingle(5)); // 'Buzz'
console.log(fizzBuzzSingle(15)); // 'FizzBuzz'
console.log(fizzBuzzSingle(7)); // '7'

Browser demo
- Open src/web/index.html to try the interactive demo. The page includes a FizzBuzz demo (ids: fizz-n, compute-fizz, compute-fizz-single, fizz-list-output, fizz-single-output) and the Hamming demo.

Rest of repository documentation remains below.

(Original README content continues...)
