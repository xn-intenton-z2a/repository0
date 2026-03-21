Table of contents
1. Definition and purpose
2. Variations and rules
3. Implementation notes
4. Supplementary details
5. Reference details
6. Digest and retrieval

1. Definition and purpose
Fizz buzz: sequence replacing integers divisible by 3 with Fizz, by 5 with Buzz, and by both with FizzBuzz. Primary examples show starting from 1 and handling positive integers; typical position-based outputs are strings.

2. Variations and rules
- Standard rule set: For each integer i from 1..n produce:
  - if i % 15 === 0 => "FizzBuzz"
  - else if i % 3 === 0 => "Fizz"
  - else if i % 5 === 0 => "Buzz"
  - else => string representation of i
- Common variations: different divisors, starting offset, or returning numbers instead of strings.

3. Implementation notes
- Output should be an array of strings for range-based function.
- Single-value function returns the single string for an integer input.
- Edge behaviours widely referenced: handling 0, negatives, non-integers must be specified by implementer.

4. Supplementary details
- Complexity: O(n) time, O(n) output memory for fizzBuzz(n).
- Use integer arithmetic with modulus operator; avoid floating rounding for integer checks.

5. Reference details
- No API signatures provided on page; algorithmic specification above is authoritative for implementation.

6. Digest and retrieval
Source: https://en.wikipedia.org/wiki/Fizz_buzz
Retrieved: 2026-03-21
Size: page HTML retrieved (truncated) ~120KB
Attribution: Wikipedia (CC BY-SA)
