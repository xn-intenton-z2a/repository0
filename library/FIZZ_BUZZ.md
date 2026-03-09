NORMALISED EXTRACT

Table of Contents:
1. Problem definition
2. Formal rules
3. Variations and extensions

1. Problem definition
- Fizz Buzz: iterate integers starting at 1. For each number:
  - If divisible by 3 and 5 (i.e., 15), output "FizzBuzz".
  - Else if divisible by 3, output "Fizz".
  - Else if divisible by 5, output "Buzz".
  - Else output the number as string.

2. Formal rules
- Divisibility checks use integer modulo: n % d === 0.
- Order of checks matters: check combined divisor first (15) or check 3 and 5 and concatenate labels in order to produce "FizzBuzz".
- Domain: positive integers; implementations may allow configurable start and end indices.

3. Variations and extensions
- Parameterized divisors and labels: allow arrays of pairs (divisor, label), iterate and concatenate labels when multiple divisors match.
- Alternate outputs: return objects with metadata e.g., {n, output, matchedDivisors}.
- Memory-efficient streaming generator: yield outputs one at a time instead of building array for large ranges.

SUPPLEMENTARY DETAILS

Technical specifications and implementation details:
- Typical single-value function signature: fizzbuzzValue(n: number, rules?: Array<[number,string]>) -> string
- Range generator signature: fizzbuzzRange(n: number, rules?) -> Iterable<string>
- Complexity: O(n * r) where r is number of rules; can be optimized using LCM-based precomputation for periodic outputs.

REFERENCE DETAILS

Exact implementation pattern (imperative):
- for (i = start; i <= end; i++) {
    output = '';
    if (i % 3 === 0) output += 'Fizz';
    if (i % 5 === 0) output += 'Buzz';
    if (output === '') output = String(i);
    push output;
  }

Configuration options:
- start: integer default 1
- end/n: integer inclusive end
- rules: list of divisor/label pairs

TROUBLESHOOTING

- If outputs are incorrect for large n, verify integer precision and modulo correctness; JavaScript numbers are safe up to 2^53-1.
- For streaming, ensure consumer respects backpressure and use generators or async iterators.

DIGEST
Source: https://en.wikipedia.org/wiki/Fizz_buzz
Retrieved: 2026-03-09
Size: small (web page)

ATTRIBUTION
Content adapted from Wikipedia Fizz Buzz article. Data size: ~1 page equivalent.