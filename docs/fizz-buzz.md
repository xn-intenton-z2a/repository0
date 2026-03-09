# FizzBuzz API

This project provides a small FizzBuzz library exported from src/lib/main.js.

Exports

- fizzBuzz(n): returns Array<string>
  - For integer n >= 1 returns array of length n for 1..n with replacements:
    - multiples of 3 => "Fizz"
    - multiples of 5 => "Buzz"
    - multiples of both => "FizzBuzz"
  - For n === 0 returns []
  - For negative integers throws RangeError with message: "n must be a non-negative integer"
  - For non-integer numbers throws TypeError with message: "n must be an integer"

- fizzBuzzSingle(n): returns string
  - Same mapping applied to a single integer value.
  - Validation errors mirror fizzBuzz.

CLI

- node src/lib/main.js 15
  - Prints the fizzBuzzSingle(15) result: `FizzBuzz`

Web demo

- The demo is at src/web/index.html and uses the library via src/web/app.js.
- Important element IDs used by tests and reviewers:
  - fizz-input, fizz-submit, fizz-output
  - fizz-range, fizz-range-submit, fizz-range-output
  - fizz-error

Examples

- fizzBuzz(5) -> ["1","2","Fizz","4","Buzz"]
- fizzBuzzSingle(15) -> "FizzBuzz"
