DOCUMENT: FIZZBUZZ

Table of Contents
1. Problem Statement and Goal
2. Key JavaScript Primitives and Edge Cases
3. Implementation Patterns
4. Input Validation and Error Handling
5. Testing and Assertions (Vitest + Node assert)
6. Performance and Memory Notes
7. Supplementary Details (specs, types, signatures)
8. Reference Details (API signatures, config, examples)
9. Digest and Retrieval Metadata
10. Attribution and Data Size

1. Problem Statement and Goal
Provide a robust, production-ready FizzBuzz implementation and test patterns usable in Node.js (>=24) and browser contexts. Requirements: deterministic mapping of integer sequence to Fizz/Buzz strings with validation, predictable error behavior for invalid inputs, and succinct testable implementations following JavaScript best practices.

2. Key JavaScript Primitives and Edge Cases
- Number.isInteger(value): returns true only for numbers that are integers (ECMAScript spec). Use to validate input elements when mapping arrays or ranges.
- Array.prototype.map(callback): applies callback to each element and returns new array. Use for functional, side-effect-free FizzBuzz mapping.
- RangeError: built-in error type appropriate for signaling invalid numeric ranges (e.g., non-positive counts or excessively large ranges).
- Falsy and non-number inputs: explicitly guard against NaN, Infinity, non-number types, and numeric strings unless intentionally supported.

3. Implementation Patterns
- Minimal, functional pattern (preferred):
  - Validate length and type inputs first using Number.isInteger and finite checks (Number.isFinite).
  - Create range using simple for-loop or Array.from({length}, (_,i)=>i+start) to avoid allocation surprises.
  - Use a pure mapping function fizzbuzzValue(n) that returns: ‘‘FizzBuzz’’ if n%15==0, ‘‘Fizz’’ if n%3==0, ‘‘Buzz’’ if n%5==0, otherwise n.
  - Use modulo checks in descending specificity: check 15, then 3, then 5 to avoid incorrect matches.
- Range generation patterns:
  - Inclusive start..end: ensure integer ordering and throw RangeError if start>end or if range length exceeds an implementation-defined limit.
  - Count-based generation: accept positive integer count; throw RangeError if count<=0.

4. Input Validation and Error Handling
- Always assert Number.isInteger for counts and range bounds.
- Use Number.isFinite to exclude Infinity/-Infinity and isNaN for NaN checks.
- Throw RangeError with clear message for invalid ranges or counts.
- For array inputs, coerce only after validation; do not silently coerce strings to numbers.

5. Testing and Assertions (Vitest + Node assert)
- Use vitest for unit testing and describe/it structure; run with npm test or npm run test:unit.
- Use Node's assert.strictEqual and assert.deepStrictEqual for deterministic value checks when comparing primitives and arrays.
- Test vectors:
  - Single values: fizzbuzzValue(3) -> "Fizz", 5 -> "Buzz", 15 -> "FizzBuzz", 2 -> 2
  - Ranges: generate 1..15 and assert exact output array length and contents
  - Validation: expect RangeError for non-integer counts, negative counts, and start>end ranges
  - Edge numeric values: Infinity, NaN produce thrown errors

6. Performance and Memory Notes
- For large ranges, avoid creating intermediate large arrays; prefer generator-based iteration or streaming output when memory constrained.
- Array.from with mapping initializer is concise and has predictable allocation of N elements; prefer when N is moderate (<1e6).
- Use simple arithmetic and minimal branching in the inner loop for best CPU locality.

7. Supplementary Details (specs, types, signatures)
- fizzbuzzValue(n: number): string | number
  - Preconditions: Number.isInteger(n) && Number.isFinite(n)
  - Postconditions: returns "FizzBuzz" | "Fizz" | "Buzz" | n
- fizzbuzzRange(start: number, end: number): Array<string|number>
  - Preconditions: integers, start<=end, (end-start+1) <= MAX_RANGE_LIMIT
  - Errors: throws RangeError on invalid inputs
- fizzbuzzCount(start: number, count: number): Array<string|number>
  - Preconditions: start integer, count integer>0

8. Reference Details (API signatures, config, examples)
- API: fizzbuzzValue(n)
  - Parameters: n (number) — required integer
  - Returns: string or number as specified in 7
  - Throws: TypeError if n is not number; RangeError if not finite or not integer
- API: fizzbuzzRange(start, end)
  - Parameters: start (number), end (number)
  - Returns: array of fizzbuzzValue for each integer from start to end inclusive
  - Throws: RangeError for invalid bounds
- Configuration options:
  - MAX_RANGE_LIMIT (default 1_000_000) — maximum allowed range length to prevent OOM
  - OUTPUT_MODE: "array" | "generator" — choose generator to reduce memory
- Best practices:
  - Validate inputs early and fail-fast with clear error messages
  - Prefer pure functions to ease testing and reuse
  - Provide both array and generator APIs for different use cases

9. Digest and Retrieval Metadata
- Source extraction date: 2026-03-07
- Sources used (from SOURCES.md):
  - https://en.wikipedia.org/wiki/Fizz_buzz  (algorithm definition, variations)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (validation semantics)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map  (mapping behavior)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (error type semantics)
  - https://nodejs.org/api/assert.html  (assert API signatures and usage patterns)
  - https://vitest.dev/guide/  (test runner patterns and command lines)
  - https://www.npmjs.com/package/fizzbuzz  (existing package reference and common API choices)

10. Attribution and Data Size
- Attribution: Content condensed from the listed public references; factual algorithm definitions (FizzBuzz) from Wikipedia and language/runtime specifics from MDN and Node.js docs.
- Approximate data size extracted: 6 source pages, estimated 8KB of useful technical content.

END OF DOCUMENT
