NORMALISED EXTRACT:
Rules and core algorithm
- For a sequence of integers (commonly 1..N), output a token per integer according to these rules evaluated in priority order: if the integer is divisible by both 3 and 5, output the token FizzBuzz; else if divisible by 3, output Fizz; else if divisible by 5, output Buzz; otherwise output the decimal representation of the integer.
- Implementation pattern (imperative): iterate integers in range, test divisibility using integer modulus, branch in the order (multiples of 15) -> FizzBuzz, (multiples of 3) -> Fizz, (multiples of 5) -> Buzz, else number.
- Deterministic mapping: function f(i) -> string where inputs that meet multiple conditions follow the precedence above.

TABLE OF CONTENTS:
1. Core rule set
2. Control flow pattern
3. Edge cases and variants
4. Performance and complexity
5. Test vectors

DETAILED CONTENT:
1. Core rule set
- Multiples: multiple-of-3, multiple-of-5, multiple-of-both.
- Tokens: exact literal tokens Fizz, Buzz, FizzBuzz (case-sensitive in typical implementations).

2. Control flow pattern
- Single-pass loop across the integer range. For each integer i:
  - If i modulo 15 equals 0 produce FizzBuzz.
  - Else if i modulo 3 equals 0 produce Fizz.
  - Else if i modulo 5 equals 0 produce Buzz.
  - Else produce the integer as a decimal string.
- The multiple-of-both check can be implemented by checking i % 15 == 0 or by composing the two divisibility tests with logical AND.

3. Edge cases and variants
- Start/end: range may begin at 0, 1, or arbitrary low/high values; negative integers follow the same divisibility rules.
- Non-integer inputs: algorithm assumes integer sequence; callers must validate or coerce inputs.
- Alternate token sets: replace Fizz/Buzz strings per domain-specific requirements.
- Combined-factor generalisation: extend to arbitrary factor-token mappings; ensure deterministic precedence when multiples coincide.

4. Performance and complexity
- Time: O(N) where N is the number of integers produced. Each iteration does a constant number of integer modulus operations and string outputs.
- Memory: O(1) extra memory for streaming output; O(N) if collecting outputs in a list.

5. Test vectors
- 1 -> "1"; 3 -> "Fizz"; 5 -> "Buzz"; 15 -> "FizzBuzz"; 30 -> "FizzBuzz"; negative and zero: 0 -> "FizzBuzz" (0 divisible by any nonzero integer).

SUPPLEMENTARY DETAILS:
- Use integer arithmetic to avoid floating-point rounding issues when computing modulus.
- When generating very large ranges, stream outputs to avoid memory pressure.
- For parallel or segmented generation, preserve global divisibility logic per segment.

REFERENCE DETAILS (SPEC):
- Input: integer sequence start..end (inclusive) or an iterator yielding integers.
- Output: sequence of strings where mapping f: Z -> String is defined:
  - if i mod 15 == 0 -> "FizzBuzz"
  - else if i mod 3 == 0 -> "Fizz"
  - else if i mod 5 == 0 -> "Buzz"
  - else -> decimal-string(i)
- Exact token values: Fizz, Buzz, FizzBuzz (case-sensitive). Implementations must not inject extra whitespace.
- Error handling: throw or return an error when input range bounds are non-integer or invalid; caller responsibility to validate types.

DETAILED DIGEST:
Source: https://en.wikipedia.org/wiki/Fizz_buzz
Retrieved: 2026-03-17
Data retrieved: 66.8 KB (HTML)
Extracted technical points: core precedence rule (3 vs 5 vs both), iteration pattern, test vectors, variants and extension patterns for arbitrary factor-token mappings.

ATTRIBUTION:
Content extracted and condensed from the Wikipedia Fizz buzz article (URL above). Data size obtained during crawling: 66.8 KB.