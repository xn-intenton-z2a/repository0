# repository0 - FizzBuzz Core

This repository now exposes a small, deterministic FizzBuzz core library.

Usage examples:

- fizzBuzzSingle(15) => "fizzbuzz"
- fizzBuzz(1, 5) => ["1","2","fizz","4","buzz"]

API:

- export function fizzBuzzSingle(n): returns the FizzBuzz string for a single integer n.
  - Throws TypeError for non-integers, NaN, Infinity, or non-number types.
  - Accepts mathematically-integer floats (e.g., 3.0).

- export function fizzBuzz(start, end): returns an array of strings for inclusive range [start, end].
  - Throws TypeError if start or end are not integers.
  - Returns [] if start > end.

Run tests:

npm ci && npm test
