WIKIPEDIA_FIZZ_BUZZ

Table of contents:
1. Definition
2. Algorithm (step-by-step)
3. Variants and common test vectors
4. Edge cases and expected behaviours

1. Definition
FizzBuzz: for positive integers, replace multiples of 3 with Fizz, multiples of 5 with Buzz, multiples of both with FizzBuzz; otherwise output the integer as a decimal string.

2. Algorithm (step-by-step)
- For i from 1 to n inclusive:
  - If i % 15 === 0 -> output "FizzBuzz"
  - Else if i % 3 === 0 -> output "Fizz"
  - Else if i % 5 === 0 -> output "Buzz"
  - Else -> output String(i)
- For n <= 0: return empty list (spec states simple implementations return []).

3. Variants and common test vectors
- Standard test: n=15 yields ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"].
- Single-value API assertions: 3->"Fizz", 5->"Buzz", 15->"FizzBuzz", 7->"7".

4. Edge cases and expected behaviours
- n = 0 -> []
- Negative n -> caller should treat as invalid; mission requires RangeError for negative inputs.
- Non-integer n -> caller should treat as TypeError for non-integers.

Supplementary details:
- Use modulus operator (%) for remainder checks.
- Use combined-check (i % 15) first for correct combined multiples behaviour.

Reference digest: source https://en.wikipedia.org/wiki/Fizz_buzz retrieved 2026-03-21
Attribution: Wikipedia content (retrieved HTML). Size: ~66KB (fetched)
