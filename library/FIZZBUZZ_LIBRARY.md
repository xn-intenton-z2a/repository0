FIZZBUZZ_LIBRARY

Table of contents
1. Purpose and scope
2. Core functions and signatures
3. Edge case rules and exception types
4. Implementation algorithm (step-by-step)
5. Performance and complexity
6. Testing requirements and patterns (Vitest)
7. Supplementary details (JS specifics)
8. Reference details (API signatures, exact behaviours)
9. Retrieval digest and attribution

1. Purpose and scope
Provide a minimal, implementation-ready specification for a JavaScript library that exports two named functions: fizzBuzz(n) and fizzBuzzSingle(n). The library must validate inputs strictly and follow the FizzBuzz rules: multiples of 3 -> "Fizz", multiples of 5 -> "Buzz", multiples of both -> "FizzBuzz". Must be ESM module compatible (type: module) and used by tests and simple CLI/web examples.

2. Core functions and signatures
- export function fizzBuzz(n)
  - Parameters: n (Number)
  - Returns: Array<String>
  - Behaviour: Returns an array of length n containing FizzBuzz substitution strings for indices 1..n. If n === 0 returns an empty array.

- export function fizzBuzzSingle(n)
  - Parameters: n (Number)
  - Returns: String
  - Behaviour: Returns the Fizz/Buzz/FizzBuzz string for the single positive integer n.

3. Edge case rules and exception types
- Non-integer inputs: throw TypeError with message that indicates input must be an integer (use Number.isInteger to validate).
- Negative integers: throw RangeError (use the native RangeError type) with a clear message for negative values.
- Zero: fizzBuzz(0) returns [] (empty array); fizzBuzzSingle(0) is invalid per mission and should throw RangeError (mission expects positive integer for single value).
- Non-number types: throw TypeError (e.g., string, null, undefined).
- NaN or Infinity: treat as non-integer -> TypeError.

4. Implementation algorithm (step-by-step)
- Input validation (shared helper):
  - If typeof n !== 'number' -> throw TypeError('n must be a number')
  - If !Number.isInteger(n) -> throw TypeError('n must be an integer')
  - If n < 0 -> throw RangeError('n must be >= 0') for fizzBuzz, and for fizzBuzzSingle require n > 0 and throw RangeError for n <= 0
- fizzBuzzSingle(n):
  - After validation (n is a positive integer):
    - If n % 15 === 0 -> return 'FizzBuzz'
    - Else if n % 3 === 0 -> return 'Fizz'
    - Else if n % 5 === 0 -> return 'Buzz'
    - Else return String(n)
- fizzBuzz(n):
  - After validation (n is integer and n >= 0):
    - If n === 0 -> return []
    - Preallocate result array with length n (e.g., new Array(n)) and fill by iteration i from 1..n calling fizzBuzzSingle(i) or inline logic to avoid per-iteration function call overhead.
    - Return result array.

5. Performance and complexity
- Time complexity: O(n) linear iteration from 1..n
- Space complexity: O(n) for returned array
- Micro-optimisations: avoid repeated creation of temporary strings inside loops where possible; using simple modulo checks is sufficiently fast for typical n in unit tests.

6. Testing requirements and patterns (Vitest)
- Unit tests to cover:
  - Basic cases: fizzBuzz(1) -> ['1'], fizzBuzz(3) ends with 'Fizz', fizzBuzz(5) contains 'Buzz', fizzBuzz(15) ends with 'FizzBuzz'
  - fizzBuzz(0) -> []
  - fizzBuzzSingle positive cases: 3 -> 'Fizz', 5 -> 'Buzz', 15 -> 'FizzBuzz', 7 -> '7'
  - Input validation: non-integers (2.5), strings, null, undefined -> TypeError
  - Negative numbers -> RangeError
  - NaN, Infinity -> TypeError
  - ESM import test: import { fizzBuzz } from './src/lib/main.js' works when package.json has "type": "module"
- Use Vitest patterns:
  - assert matchers: expect(fizzBuzz(15)).toEqual([...expected array...])
  - assert throws: expect(() => fizzBuzz(-1)).toThrow(RangeError)
  - coverage: ensure all branches (Fizz, Buzz, FizzBuzz, number) are exercised

7. Supplementary details (JS specifics)
- Use Number.isInteger(value) for integer checks; do not use bitwise tricks.
- Use native Error types: TypeError and RangeError for the specified conditions.
- Convert numeric outputs to strings using String(n) when returning number text.
- Module packaging: package.json must include "type": "module" and main: "src/lib/main.js" to allow ESM imports by Node >= v14+ with ES modules support; Node official ESM docs confirm usage.

8. Reference details (API signatures and exact behaviours)
- Number.isInteger(value): returns true if value is of type number and an integer. Use for non-integer detection. (Source: MDN)
- RangeError: native constructor RangeError(message); throw new RangeError('message') for out-of-range inputs. (Source: MDN)
- Array creation: new Array(n) creates sparse array; preferred to use Array.from({length: n}, (_, i) => compute(i+1)) or a standard for loop to avoid sparse slots. Exact pattern recommended:
  - const out = new Array(n);
  - for (let i = 1; i <= n; ++i) { out[i-1] = fizzBuzzSingle(i); }
- Modulo checks: use n % 15 === 0 for FizzBuzz; do not chain floating-point modulo tests because values are validated as integers first.

9. Retrieval digest and attribution
- Sources crawled and condensed: Wikipedia Fizz_buzz (https://en.wikipedia.org/wiki/Fizz_buzz), MDN Number.isInteger, MDN RangeError, MDN Functions, MDN Array, MDN Array.prototype.map, MDN Modules, Node ESM docs, Node assert docs, MDN Array.from, Vitest guide, StackOverflow FizzBuzz example.
- Retrieval date: 2026-03-21
- Data size obtained during crawl (approximate): combined ~20 KB from listed sources

Attribution
- Content condensed from the listed sources (Wikipedia, MDN, Node.js docs, Vitest). Use sources in SOURCES.md for exact references.

Notes for implementers
- Keep implementation minimal and well-tested. Follow the exact exception types and messages where tests assert them. Export both named functions from src/lib/main.js as ESM exports.


