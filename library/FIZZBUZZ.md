FIZZBUZZ

NORMALISED EXTRACT

Table of contents:
- Function signatures
- Input validation rules
- Core algorithm
- Complexity
- Edge cases

Function signatures:
- fizzBuzz(n: number): string[]  — returns an array of length n with FizzBuzz mapping for 1..n. If n == 0 returns an empty array.
- fizzBuzzSingle(n: number): string — returns a single Fizz/Buzz/FizzBuzz/string result for a single integer input.

Input validation:
- If typeof n !== number -> throw TypeError.
- If Number.isInteger(n) === false -> throw TypeError.
- If n < 0 -> throw RangeError.

Core algorithm:
- For i from 1 to n inclusive:
  - if i % 15 === 0 -> 'FizzBuzz'
  - else if i % 3 === 0 -> 'Fizz'
  - else if i % 5 === 0 -> 'Buzz'
  - else -> convert i to decimal string
- Implementation note: use modulus operations; preallocate output array or push; O(n) time and O(n) space.

Supplementary details:
- Use Number.isInteger for integer checks and typeof for number checks. For n === 0 return [] immediately.
- Use consistent thrown types: TypeError for invalid type/non-integer; RangeError for negative values.
- Prefer iterative for-loop (for (let i = 1; i <= n; ++i)) to avoid intermediate allocations; preallocate via new Array(n) and assign by index if performance critical.

REFERENCE DETAILS

Exported API (named exports from src/lib/main.js):
- fizzBuzz(n: number): string[]
  - parameters: n — non-negative integer (0 allowed)
  - returns: Array<string>
  - throws: TypeError when n is not a number or not an integer; RangeError when n < 0
- fizzBuzzSingle(n: number): string
  - parameters: n — positive integer (>0 recommended for single-use)
  - returns: string
  - throws: same as above

Implementation patterns and best practices:
- Validate inputs first: if (typeof n !== 'number') throw TypeError; if (!Number.isInteger(n)) throw TypeError; if (n < 0) throw RangeError.
- Use numeric modulus checks in order (15, 3, 5) to avoid duplicated checks.
- Avoid building strings repeatedly; return precomputed literals 'Fizz', 'Buzz', 'FizzBuzz' or String(i).

DETAILED DIGEST (source content summary)
- Source: https://en.wikipedia.org/wiki/Fizz_buzz (retrieved 2026-03-21)
  - Key extracted statement: Replace integers divisible by 3 with 'Fizz', divisible by 5 with 'Buzz', and divisible by both with 'FizzBuzz'. Common coding exercise and children's counting game.
  - Retrieval date: 2026-03-21
  - Bytes retrieved during crawl: 63473

ATTRIBUTION
- Source URL: https://en.wikipedia.org/wiki/Fizz_buzz
- Retrieved: 2026-03-21
- Bytes crawled: 63473
