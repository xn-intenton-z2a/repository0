# repository0 - FizzBuzz Core

This repository now exposes a small, deterministic FizzBuzz core library.

Usage examples:

- fizzBuzzSingle(15) => "FizzBuzz"
- fizzBuzz(1,5) => ["1","2","Fizz","4","Buzz"]

API:

- export function fizzBuzzSingle(n): returns the FizzBuzz string for a single integer n.
  - Examples: fizzBuzzSingle(3) -> 'Fizz', fizzBuzzSingle(5) -> 'Buzz', fizzBuzzSingle(15) -> 'FizzBuzz'
- export function fizzBuzz(start, end): returns an array of strings for the inclusive range start..end. Supports descending ranges when start > end.
  - Examples: fizzBuzz(1,5) -> ["1","2","Fizz","4","Buzz"], fizzBuzz(5,1) -> ['Buzz','4','Fizz','2','1']
  - Throws TypeError for non-integers, NaN, Infinity, or non-number types.
  - Accepts mathematically-integer floats (e.g., 3.0).

- export function fizzBuzz(n): returns an array of strings for the sequence 1..n.
  - Throws TypeError if n is not an integer.
  - Returns [] if n <= 0.

Run tests:

npm ci && npm test
