# FizzBuzz

This document explains the FizzBuzz library exported by src/lib/main.js.

Functions

- fizzBuzz(n): Returns an array of strings representing the FizzBuzz sequence from 1..n.
  - fizzBuzz(15) -> ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
  - fizzBuzz(0) -> []
  - Throws TypeError for non-integer inputs and RangeError for negative numbers.

- fizzBuzzSingle(n): Returns the FizzBuzz string for a single integer.
  - fizzBuzzSingle(3) -> "Fizz"
  - fizzBuzzSingle(5) -> "Buzz"
  - fizzBuzzSingle(15) -> "FizzBuzz"
  - fizzBuzzSingle(7) -> "7"
  - Throws TypeError for non-integer inputs and RangeError for negative numbers.

Running the demo

- Open src/web/fizzbuzz-demo.html in a browser (or run the behaviour tests which start a local server).
- The page will display the canonical fizzBuzz(15) sequence and allows single-number lookups.

Tests

- Unit tests: npm test
- Behaviour tests: npm run test:behaviour
