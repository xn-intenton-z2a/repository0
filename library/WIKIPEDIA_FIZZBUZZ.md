NORMALISED EXTRACT

Table of contents
- Rules
- Edge cases and validation
- Implementation pattern

Rules
- For each integer i from 1 through n produce one string according to these rules:
  - If i is divisible by both 3 and 5 (i % 15 === 0) return the string FizzBuzz.
  - Else if i is divisible by 3 (i % 3 === 0) return the string Fizz.
  - Else if i is divisible by 5 (i % 5 === 0) return the string Buzz.
  - Otherwise return the decimal representation of i (as a string).
- Maintain ordering from 1 to n; each output element corresponds to the integer at the same index (1-based).

Edge cases and validation
- n = 0 -> return an empty array.
- n < 0 -> implementation should throw a RangeError indicating the numeric argument is out of range.
- Non-integer inputs (including numeric strings and floats that are not whole numbers) -> implementation should throw a TypeError indicating invalid type; use Number.isInteger to validate.
- n must be finite and a safe integer for array construction; if not, throw RangeError or TypeError as appropriate.

Implementation pattern (direct, actionable)
- fizzBuzzSingle(n): evaluate divisibility in this exact order: n % 15, n % 3, n % 5. Return FizzBuzz, Fizz, Buzz, or String(n).
- fizzBuzz(n): validate n (integer, non-negative) then allocate an array of length n, iterate i from 1 to n and push fizzBuzzSingle(i). Return the array.
- Complexity: time O(n), space O(n) for the returned array.
- Avoid building the result by repeated string concatenation checks; explicit checks against 15, 3, and 5 are minimal and deterministic.

SUPPLEMENTARY DETAILS
- Use Number.isInteger to check integerness; prefer explicit TypeError messages: "n must be an integer".
- For negative values throw new RangeError("n must be >= 0").
- For n = 0 return [] immediately without iteration.
- Implementation note: use strict equality when comparing modulo results to 0.

REFERENCE DETAILS
- Function signatures (JS / descriptive):
  - fizzBuzz(n) -> Array<string>
    - Parameters: n (integer >= 0). If n === 0 returns [] exactly. If n < 0 throw RangeError. If not an integer throw TypeError.
    - Returns: an array of length n; element at index (i-1) is the fizzbuzz string for integer i.
  - fizzBuzzSingle(n) -> string
    - Parameters: n (integer). For positive integers returns Fizz/Buzz/FizzBuzz or decimal string.
    - Returns: string output for the single integer.
- Exact implementation pattern (pseudocode-like, no fenced code):
  - Validate input: if (!Number.isInteger(n)) throw new TypeError('n must be an integer'); if (n < 0) throw new RangeError('n must be >= 0');
  - For single value: if (n % 15 === 0) return 'FizzBuzz'; else if (n % 3 === 0) return 'Fizz'; else if (n % 5 === 0) return 'Buzz'; else return String(n);
  - For array: create empty result array and push fizzBuzzSingle(i) for i = 1..n.

DETAILED DIGEST (source content snapshot and retrieval)
- Source section: Wikipedia article "Fizz buzz" defines the game and the replacement rules: multiples of three are replaced by Fizz, multiples of five by Buzz, both replaced by FizzBuzz; common interview/programming exercise.
- Retrieval date: 2026-03-21
- Data size obtained during crawling: 63462 bytes (Content-Length header)

ATTRIBUTION
- Source: https://en.wikipedia.org/wiki/Fizz_buzz
- Retrieved: 2026-03-21
- Content-Length (reported by server): 63462 bytes
