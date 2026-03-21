WIKIPEDIA_FIZZ_BUZZ

1) Normalised extract

Table of contents:
- Algorithm
- Input/Output mapping
- Example sequence (1..15)
- Edge cases
- Complexity

Algorithm:
- For each integer i from 1 to n inclusive produce one string element in the output array.
- Divisibility checks (order matters):
  - If i divisible by 15 => produce the string FizzBuzz
  - Else if i divisible by 3 => produce the string Fizz
  - Else if i divisible by 5 => produce the string Buzz
  - Else produce the decimal representation of i as a string
- Use integer arithmetic (modulo) for divisibility tests and check integer-ness of n before looping.

Input/Output mapping:
- Input: n, an integer >= 0
- Output: Array of strings of length n. The element at index (k-1) corresponds to the number k (1-indexed).

Example sequence (1..15):
- 1 => 1
- 2 => 2
- 3 => Fizz
- 4 => 4
- 5 => Buzz
- 6 => Fizz
- 7 => 7
- 8 => 8
- 9 => Fizz
- 10 => Buzz
- 11 => 11
- 12 => Fizz
- 13 => 13
- 14 => 14
- 15 => FizzBuzz
(When stored in the output array, numeric values are the string forms of those numbers.)

Edge cases:
- n == 0 => return an empty array []
- n < 0 => throw RangeError
- non-integer n => throw TypeError
- Very large n => algorithm is linear; consider streaming/generator-based alternatives if memory is constrained.

Complexity:
- Time: O(n)
- Space: O(n) for the returned array

2) Supplementary details

Implementation notes:
- Validate input with Number.isInteger(n) to reject non-integers.
- Validate range (n >= 0) and throw RangeError for negatives.
- Convert any numeric outputs to strings prior to pushing into the result array to preserve output typing.
- Preferred approach: simple loop from 1..n, check divisibility by 15 first, then 3, then 5, else string of the number.

3) Reference details (API specifications and implementation patterns)

Function signatures (exact specifications required by mission):
- fizzBuzz(n)
  - Parameters: n: integer (>= 0)
  - Returns: Array<string> (length n; element index i-1 corresponds to number i)
  - Throws: RangeError when n < 0; TypeError when n is not an integer

- fizzBuzzSingle(n)
  - Parameters: n: integer (> 0 for single function use; mission expects positive integer for single)
  - Returns: string (one of: Fizz, Buzz, FizzBuzz, or decimal representation of n)
  - Throws: RangeError when n <= 0 or negative; TypeError when n is not an integer

Export pattern (exact): Use named exports from src/lib/main.js, e.g. export function fizzBuzz(n) { ... } and export function fizzBuzzSingle(n) { ... } or export { fizzBuzz, fizzBuzzSingle } from that module. The repository package.json specifies "type": "module" so use ES module syntax.

Best practices and examples (implementation patterns):
- Input validation sequence: if (!Number.isInteger(n)) throw new TypeError('n must be an integer'); if (n < 0) throw new RangeError('n must be >= 0');
- Loop pattern: for i from 1 to n inclusive, perform divisibility checks (i % 15 -> FizzBuzz; else i % 3 -> Fizz; else i % 5 -> Buzz; else i toString()).
- Unit-test assertions: expect(fizzBuzz(15)).toEqual([...expected array...]); expect(() => fizzBuzz(-1)).toThrow(RangeError); expect(() => fizzBuzz(2.5)).toThrow(TypeError).

4) Detailed digest (source section content and retrieval metadata)
- Source: https://en.wikipedia.org/wiki/Fizz_buzz
- Retrieved: 2026-03-21
- Data size fetched: 63472 bytes
- Extracted content: Wikipedia describes the exercise of replacing multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz", typically illustrated with the sequence 1..15. The procedural algorithm and example sequence above are taken from that exposition.

5) Attribution
- Attribution: Wikipedia contributors, article "Fizz buzz"; retrieved 2026-03-21; raw HTML captured during crawl: 63472 bytes.
