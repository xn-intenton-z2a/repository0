ROSETTA_FIZZBUZZ

Normalised extract:
- Rosetta Code shows multiple idiomatic implementations; JavaScript examples illustrate both imperative loops and concise functional one-liners using mapping or ternary chains.
- Useful patterns shown: for loop + push, mapping over a numeric range, ternary nesting for concise single-expression returns.

Table of contents:
1. Idiomatic imperative implementation
2. Idiomatic functional implementation
3. Concise single-expression patterns
4. Practical notes and gotchas

Details:
1. Imperative implementation
   - Pattern: create results array, for i from 1..n compute value using conditional checks and push result.
   - Advantage: clarity and minimal surprises; straightforward to unit-test.

2. Functional implementation
   - Pattern: Array.from({ length: n }, (_, i) => { compute for i+1 }) or new Array(n).fill(0).map((_, i) => ...)
   - Advantage: concise and expressive; ensure array is not sparse to guarantee callback execution.

3. Concise single-expression patterns
   - Ternary-chain pattern: (i % 3 === 0 ? 'Fizz' : '') + (i % 5 === 0 ? 'Buzz' : '') || String(i) produces same results in a single expression; use with care for clarity.

4. Practical notes and gotchas
   - Avoid new Array(n).map without filling because callbacks may not execute for holes.
   - Prefer Array.from when creating arrays for index-based mapping.
   - Ensure input validation is done before array creation to avoid wasting resources on invalid inputs.

Reference details:
- Source examples: Rosetta Code FizzBuzz page demonstrates variants and idioms for many languages including JavaScript

Detailed digest:
- Source: Rosetta Code "FizzBuzz" (rosettacode.org)
- Retrieval date: 2026-03-21
- Bytes fetched during crawl: 1017050

Attribution:
- Rosetta Code — https://rosettacode.org/wiki/FizzBuzz
