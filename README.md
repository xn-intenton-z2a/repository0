# FizzBuzz Library

A small JavaScript library that implements FizzBuzz.

Exports:
- fizzBuzz(n): returns array of strings for 1..n with Fizz/Buzz substitutions. fizzBuzz(0) -> []
- fizzBuzzSingle(n): returns string for a single integer ("Fizz", "Buzz", "FizzBuzz", or number as string)

Validation and errors:
- Non-integer or NaN inputs throw TypeError with exact message: "n must be an integer"
- Negative integers throw RangeError with exact message: "n must be a non-negative integer"

CLI:
- Run: node src/lib/main.js <number>
- On success prints the fizzBuzzSingle result to stdout and exits 0
- On invalid input prints the error message to stderr and exits non-zero

Web demo:
- src/web/index.html provides a demo. Build to docs/ with npm run build:web.
- Demo elements: #fizz-input, #fizz-submit, #fizz-output, #fizz-range, #fizz-range-submit, #fizz-range-output, #fizz-error
