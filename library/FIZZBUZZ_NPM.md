NORMALISED EXTRACT

Table of Contents:
1. Package purpose and API
2. Installation and usage patterns
3. Behavior and options

1. Package purpose and API
- The npm package "fizzbuzz" provides utilities to generate FizzBuzz sequences or evaluate single numbers according to FizzBuzz rules (divisible by 3 => "Fizz", 5 => "Buzz", 15 => "FizzBuzz").
- Typical exported methods: fizzbuzz(n) -> returns an array 1..n with substitutions; fb(n) -> string for single n; configurable options may exist depending on package version.

2. Installation and usage patterns
- npm install fizzbuzz
- CommonJS: const fizzbuzz = require('fizzbuzz'); const seq = fizzbuzz(15);
- ESM import: import fizzbuzz from 'fizzbuzz'; const seq = fizzbuzz(15);

3. Behavior and options
- For integer inputs <= 0, behavior may return empty array or throw depending on implementation; validate inputs.
- Some implementations provide customization: change divisors, output labels, starting index.

SUPPLEMENTARY DETAILS

Technical specifications and implementation details:
- Export strategy: package often exports a single function as module.exports / default export.
- Complexity: O(n) time, O(n) memory for sequence generation; constant memory for single-value evaluation.

REFERENCE DETAILS

API signatures (varies by version):
- fizzbuzz(n: number) -> string[]
- fizzbuzz.single(n: number) -> string  (or alias fb)
Parameters:
- n: integer count or value
Return types:
- Array of strings for range generator; string for single evaluator

TROUBLESHOOTING

- If require('fizzbuzz') returns undefined, check package installation and node_modules resolution.
- If package API differs, inspect installed package's main file to confirm exported names.

DIGEST
Source: https://www.npmjs.com/package/fizzbuzz
Retrieved: 2026-03-09
Size: small (web page)

ATTRIBUTION
Content adapted from npm package page for "fizzbuzz". Data size: ~1 page equivalent.