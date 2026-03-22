WIKIPEDIA_FIZZ_BUZZ

Table of contents:
- Definition
- Rules (exact)
- Implementation pattern (ordered checks)
- Edge cases and error handling
- Complexity and performance
- Detailed digest (extracted content + retrieval)
- Attribution and crawl size

NORMALISED EXTRACT
Definition
For each integer i from 1 to n inclusive produce a string according to these exact replacement rules:
- If i is divisible by both 3 and 5 (i % 15 === 0) then output "FizzBuzz".
- Else if i is divisible by 3 then output "Fizz".
- Else if i is divisible by 5 then output "Buzz".
- Else output the decimal representation of i.
Return an ordered array of these strings with one entry per integer from 1..n.

Rules (exact)
- Divisibility tests are integer modulus checks: i % 3, i % 5, i % 15.
- Combined rule (both 3 and 5) must take precedence over single-factor rules.
- The sequence starts at 1 and ends at n inclusive.

Implementation pattern (ordered checks)
- Iterate i from 1 to n.
- If (i % 15 === 0) produce "FizzBuzz".
- Else if (i % 3 === 0) produce "Fizz".
- Else if (i % 5 === 0) produce "Buzz".
- Else produce String(i).
This ordering guarantees correct replacements without concatenation logic but concatenation approaches (append "Fizz" when divisible by 3 then append "Buzz" when divisible by 5 and fallback to numeric string when empty) are functionally equivalent if done per-element.

Edge cases and error handling (mission-specific requirements)
- n = 0 must return an empty array.
- Negative n must be treated as invalid input; throw RangeError with a clear message (e.g., "n must be a non-negative integer").
- Non-integer n must be treated as invalid input; throw TypeError with a clear message (e.g., "n must be an integer").
- Non-number input types must be rejected with TypeError.

Complexity and performance
- Time complexity: O(n) single pass to produce n output strings.
- Space complexity: O(n) for the returned array.
- Use non-blocking pure JS code; avoid heavy allocations per element beyond the string produced.

DETAILED DIGEST
Extracted technical content (paraphrased to concrete rules useful for implementation) retrieved: 2026-03-22
- The canonical FizzBuzz specification replaces multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz"; enumeration starts at 1 and proceeds to n.
- Typical implementations evaluate the combined 3-and-5 condition first (i % 15) or build the output string by conditional concatenation.

ATTRIBUTION AND CRAWL SIZE
Source: https://en.wikipedia.org/wiki/Fizz_buzz
Retrieved: 2026-03-22
Bytes downloaded during crawl: 63472

USAGE NOTES
- Use strict integer checks for input validation (Number.isInteger) and throw RangeError/TypeError as required by the mission acceptance criteria.