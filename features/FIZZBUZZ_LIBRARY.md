# FIZZBUZZ_LIBRARY

Feature Name: FIZZBUZZ_LIBRARY

## Summary
A precise, implementable feature specification for the FizzBuzz library exported by src/lib/main.js. This document defines exports, behaviour, input validation, examples, CLI contract, and exact unit-test acceptance criteria so the implementation, tests, docs, and web demo are consistent and verifiable.

## Goals
- Export named functions fizzBuzz and fizzBuzzSingle from src/lib/main.js as ES module named exports.
- Define strict, testable input validation and exact error messages.
- Provide clear examples for README and web demo use.
- Specify CLI behaviour for single-argument invocation.

## API Contract
- fizzBuzz(n): Array<string>
  - Signature: fizzBuzz(n: number) => string[]
  - Behaviour:
    - If n === 0, return an empty array.
    - If n is a positive integer (n >= 1), return an array of length n where each element is the string result for i from 1..n following FizzBuzz rules:
      - divisible by 15 => "FizzBuzz"
      - divisible by 3 => "Fizz"
      - divisible by 5 => "Buzz"
      - otherwise the decimal string of the number
    - If n is a negative integer, throw RangeError with exact message: n must be a non-negative integer
    - If n is not an integer (e.g., 2.5, NaN, non-number), throw TypeError with exact message: n must be an integer

- fizzBuzzSingle(n): string
  - Signature: fizzBuzzSingle(n: number) => string
  - Behaviour:
    - Apply the same validation rules as fizzBuzz for n.
    - Return the single FizzBuzz string for n according to the same substitution rules above.

## CLI Contract
- File: src/lib/main.js when executed as a script (node src/lib/main.js) should:
  - If invoked with a single command-line argument parse it as a base-10 number.
  - On valid integer input, call fizzBuzzSingle and print the result followed by a newline to stdout.
  - On invalid input print the error message to stderr and exit process with non-zero exit code.
  - Do not print additional diagnostic text; only the result or the error message.

## Error messages (exact strings)
- RangeError message: n must be a non-negative integer
- TypeError message: n must be an integer

## Examples (to include in README and docs)
- Library:
  - import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js'
  - fizzBuzz(5) -> ["1","2","Fizz","4","Buzz"]
  - fizzBuzzSingle(15) -> "FizzBuzz"
- CLI:
  - node src/lib/main.js 3  => prints: Fizz

## Unit-test Acceptance Criteria
Provide unit tests that assert the following exactly:
- fizzBuzz(15) returns an array of length 15 with element 15 === "FizzBuzz"
- fizzBuzzSingle(3) === "Fizz"
- fizzBuzzSingle(5) === "Buzz"
- fizzBuzzSingle(15) === "FizzBuzz"
- fizzBuzzSingle(7) === "7"
- fizzBuzz(0) returns [] (deep-equal to empty array)
- fizzBuzz(-1) and fizzBuzzSingle(-1) each throw RangeError with message "n must be a non-negative integer"
- fizzBuzz(2.5) and fizzBuzzSingle(2.5) each throw TypeError with message "n must be an integer"
- CLI invoked with "3" prints "Fizz" to stdout and exits 0; invoked with "-1" prints the RangeError message to stderr and exits non-zero

## Notes for Implementers
- Keep implementation small and idiomatic JavaScript; prefer integer checks Number.isInteger and clear error throwing.
- Export named functions; do not change package.json main.
- Tests should use vitest and reside in tests/unit/ matching existing patterns.
- Web demo and behaviour tests must import the library functions rather than reimplementing logic.

## Acceptance
This feature is satisfied when all unit tests pass and README demonstrates the example usage described above.

## Summary
A precise, implementable feature specification for the FizzBuzz library exported by src/lib/main.js. This document defines exports, behaviour, input validation, examples, CLI contract, and exact unit-test acceptance criteria so the implementation, tests, docs, and web demo are consistent and verifiable.

## Goals
- Export named functions fizzBuzz and fizzBuzzSingle from src/lib/main.js as ES module named exports.
- Define strict, testable input validation and error messages.
- Provide clear examples for README and web demo use.
- Specify CLI behaviour for single-argument invocation.

## API Contract
- fizzBuzz(n): Array<string>
  - Signature: fizzBuzz(n: number) => string[]
  - Behaviour:
    - If n === 0, return an empty array.
    - If n is a positive integer (n >= 1), return an array of length n where each element is the string result for i from 1..n following FizzBuzz rules:
      - divisible by 15 => "FizzBuzz"
      - divisible by 3 => "Fizz"
      - divisible by 5 => "Buzz"
      - otherwise the decimal string of the number
    - If n is a negative integer, throw RangeError with exact message: n must be a non-negative integer
    - If n is not an integer (e.g., 2.5, NaN, non-number), throw TypeError with exact message: n must be an integer

- fizzBuzzSingle(n): string
  - Signature: fizzBuzzSingle(n: number) => string
  - Behaviour:
    - Apply the same validation rules as fizzBuzz for n.
    - Return the single FizzBuzz string for n according to the same substitution rules above.

## CLI Contract
- File: src/lib/main.js when executed as a script (node src/lib/main.js) should:
  - If invoked with a single command-line argument parse it as a base-10 number.
  - On valid integer input, call fizzBuzzSingle and print the result followed by a newline to stdout.
  - On invalid input print the error message to stderr and exit process with non-zero exit code.
  - Do not print additional diagnostic text; only the result or the error message.

## Error messages (exact strings)
- RangeError message: n must be a non-negative integer
- TypeError message: n must be an integer

## Examples (to include in README and docs)
- Library:
  - import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js'
  - fizzBuzz(5) -> ["1","2","Fizz","4","Buzz"]
  - fizzBuzzSingle(15) -> "FizzBuzz"
- CLI:
  - node src/lib/main.js 3  => prints: Fizz

## Unit-test Acceptance Criteria
Provide unit tests that assert the following exactly:
- fizzBuzz(15) returns an array of length 15 with element 15 === "FizzBuzz"
- fizzBuzzSingle(3) === "Fizz"
- fizzBuzzSingle(5) === "Buzz"
- fizzBuzzSingle(15) === "FizzBuzz"
- fizzBuzzSingle(7) === "7"
- fizzBuzz(0) returns [] (deep-equal to empty array)
- fizzBuzz(-1) and fizzBuzzSingle(-1) each throw RangeError with message "n must be a non-negative integer"
- fizzBuzz(2.5) and fizzBuzzSingle(2.5) each throw TypeError with message "n must be an integer"
- CLI invoked with "3" prints "Fizz" to stdout and exits 0; invoked with "-1" prints the RangeError message to stderr and exits non-zero

## Notes for Implementers
- Keep implementation small and idiomatic JavaScript; prefer integer checks Number.isInteger and clear error throwing.
- Export named functions; do not change package.json main.
- Tests should use vitest and reside in tests/unit/ matching existing patterns.
- Web demo and behaviour tests must import the library functions rather than reimplementing logic.

## Acceptance
This feature is satisfied when all unit tests pass and README demonstrates the example usage described above.
