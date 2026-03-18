NORMALISED EXTRACT

Definition
Fizz buzz is a simple counting game and programming kata. For a positive integer n, iterate i from 1 to n and produce an output for each i: if i is divisible by 3 output "Fizz"; if divisible by 5 output "Buzz"; if divisible by both 3 and 5 output "FizzBuzz"; otherwise output the decimal representation of i.

Table of contents
1. Rules
2. Algorithm (step-by-step)
3. Complexity
4. Variants and common pitfalls

Detailed technical content
1. Rules
- Input: positive integer n.
- For each integer i in sequence 1..n apply the replacement rules:
  - If (i % 3 === 0) and (i % 5 === 0) => output "FizzBuzz".
  - Else if (i % 3 === 0) => output "Fizz".
  - Else if (i % 5 === 0) => output "Buzz".
  - Else => output decimal string for i.

2. Algorithm (step-by-step)
- Validate input n is a finite integer >= 0.
- If n === 0 return an empty array (mission-specific requirement).
- Allocate an array of length n and fill sequentially or push results during iteration.
- For i from 1 to n compute remainder modulo 3 and 5 and select output string per rules.
- Return the array of strings.

3. Complexity
- Time: O(n) — one pass over 1..n.
- Space: O(n) for the returned array.
- Constant-time arithmetic per element (modulo operations and comparisons).

4. Variants and common pitfalls
- Off-by-one errors: ensure iteration starts at 1 and ends at n inclusive.
- Input zero handling: treat as empty output rather than producing "0" or throwing unless specified.
- Non-integer inputs: must validate and throw TypeError for non-integers; throw RangeError for negative n as per mission.
- Use integer modulus operations; avoid floating-point remainder ambiguities by requiring integer inputs.

SUPPLEMENTARY DETAILS

Implementation notes
- Use Number.isInteger(n) to validate integer input; if false throw TypeError.
- If n < 0 throw RangeError("n must be non-negative integer").
- For each index compute flags: divisibleBy3 = (i % 3 === 0) and divisibleBy5 = (i % 5 === 0).
- Branch ordering matters: check both-divisible condition first, or compute both flags and branch accordingly.

REFERENCE DETAILS

API patterns and examples (plain text)
- Function signature: fizzBuzz(n) -> Array<string>
  - Parameters: n (Number) — positive integer or zero
  - Returns: Array of strings length n (0..n)
- Function signature: fizzBuzzSingle(i) -> string
  - Parameters: i (Number) — positive integer
  - Returns: single string according to rules above

Detailed digest
- Source: https://en.wikipedia.org/wiki/Fizz_buzz
- Retrieved: 2026-03-18
- Bytes downloaded during crawl: 63822

Attribution
Content extracted and condensed from the Wikipedia article "Fizz buzz" (en.wikipedia.org).