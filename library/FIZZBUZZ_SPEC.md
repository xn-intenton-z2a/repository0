FIZZBUZZ_SPEC

Table of contents
1. Rule set and deterministic output
2. Input validation and error handling
3. API signatures and return types
4. Module export/import patterns (ESM & CommonJS)
5. NPM package usage and CLI considerations
6. Testing with Vitest (unit patterns)
7. Performance, bounds and implementation notes
8. Supplementary technical specifications
9. Reference details (method signatures, errors, config)
10. Digest of SOURCES.md and retrieval date
11. Attribution and data size

1. Rule set and deterministic output
- For each integer i in the inclusive range 1..n produce a value at index (i-1) in the returned sequence.
- Output rules (priority order):
  - If i % 3 === 0 and i % 5 === 0 -> exact string: FizzBuzz
  - Else if i % 3 === 0 -> exact string: Fizz
  - Else if i % 5 === 0 -> exact string: Buzz
  - Else -> the integer i as a number (preferred for strongly typed APIs) or the decimal string representation when string outputs are required.
- Implementation-critical: check combined divisibility first (i % 15 === 0) or explicitly test both conditions to avoid misclassification.
- Deterministic output: result array length must equal n; element order corresponds to sequence order 1..n.

2. Input validation and error handling
- Validate parameter n using Number.isInteger(n) -> boolean; reject NaN, Infinity, fractional values.
- Enforce lower bound: n >= 1. If n < 1, throw new RangeError('n must be >= 1').
- Enforce upper bound (recommended): choose a safe maximum like MAX_N = 1e7; if n > MAX_N, throw new RangeError('n must be <= ' + MAX_N).
- Use RangeError for values outside numeric range or invalid numeric type: new RangeError(message) -> Error instance.
- If API accepts options object, validate option fields explicitly and throw TypeError or RangeError depending on the nature of the invalid field.

3. API signatures and return types
- Primary array-return API (ES module): export function fizzBuzz(n: number): Array<string | number>
  - Parameters: n (required): integer inclusive upper bound; options? optional second parameter object for mode.
  - Returns: Array of length n where each element is either the exact strings 'Fizz', 'Buzz', 'FizzBuzz' or the numeric value for non-multiples.
- Alternate string-mode API: export function fizzBuzzStrings(n: number): Array<string>
  - Always returns string elements; numerics converted with String(i) when not divisible by 3 or 5.
- CLI entry point (node): node -e "console.log(JSON.stringify(fizzBuzz(parseInt(process.argv[2],10))))" or similar; ensure argument validation identical to programmatic API.

4. Module export/import patterns (ESM & CommonJS)
- ESM (package.json type: "module")
  - Export named functions: export function fizzBuzz(n) { ... }
  - Default export alternative: export default function fizzBuzz(n) { ... }
  - Importing: import { fizzBuzz } from 'pkg' or import fizzBuzz from 'pkg' when default exported.
- CommonJS compatibility (when necessary):
  - Provide a CommonJS wrapper file or dual-publish. Example export mapping (no code block): module.exports = { fizzBuzz } or exports.fizzBuzz = fizzBuzz.
  - When writing pure ESM, document that Node versions must be >= 14+ with module support, and recommend node >= 24 per package engines.
- Package entrypoints: package.json main -> point to CommonJS build if providing CJS; "exports" field to map ESM and CJS entrypoints for conditional exports.

5. NPM package usage and CLI considerations
- If publishing as package 'fizzbuzz' implement programmatic API plus a small bin script to support CLI use.
- CLI behavior: parse integer argument, validate, print newline-separated outputs or JSON depending on option flags (--json).
- For global installs or local using npx, ensure package.json includes "bin": { "fizzbuzz": "bin/fizzbuzz.js" } and that the bin script sets a shebang and respects ESM/CJS interop.

6. Testing with Vitest (unit patterns)
- Test cases to cover:
  - Valid minimal input: n = 1 -> [1]
  - Typical cases: n = 3 -> [1,2,'Fizz']; n = 5 -> [1,2,'Fizz',4,'Buzz']; n = 15 -> verifies 'FizzBuzz' at 15 and other pattern positions.
  - Input validation: non-integer, negative, zero, Infinity, NaN, and values > MAX_N should throw RangeError.
  - Boundary cases near MAX_N if implemented (mock or small limit for unit tests).
- Vitest commands: npm test runs vitest --run tests/unit/*.test.js
- Assertion patterns: use strict equality for strings and numbers, array deep equality for whole-sequence comparisons.

7. Performance, bounds and implementation notes
- Time complexity: O(n) to produce n outputs.
- Memory: O(n) for array-return API. When streaming large n is required, provide an iterator/generator alternative: function* fizzBuzzGenerator(limit) { ... } (document behavior: yields strings or numbers matching mode).
- Avoid expensive concatenation or repeated string allocations in hot loops; prefer direct assignment to pre-sized arrays when n is known.
- For extremely large n, recommend streaming or printing line-by-line rather than building the full array.

8. Supplementary technical specifications
- MAX_N recommendation: 10_000_000 (1e7) as a safety cap; choose lower if memory or environment constrained.
- Option object proposal: { output: 'number'|'string'|'mixed' (default: 'mixed'), mode: 'array'|'generator'|'stream', upperBound?: number }
- Error messages exact wording (recommended):
  - 'n must be an integer'
  - 'n must be >= 1'
  - 'n must be <= ' + MAX_N
- Generator signature: function* fizzBuzzGenerator(n: number): IterableIterator<string | number>
- Iterator/streaming behavior: yields in sequence order; throws RangeError on invalid n prior to first yield.

9. Reference details (method signatures, errors, config)
- Number.isInteger(value): returns true if value is of type number and an integer; signature: Number.isInteger(value: any): boolean.
- RangeError constructor: new RangeError(message?: string): RangeError
- Primary API signatures (explicit):
  - export function fizzBuzz(n: number): Array<string | number>
    - Throws: RangeError('n must be an integer') if !Number.isInteger(n)
    - Throws: RangeError('n must be >= 1') if n < 1
    - Throws: RangeError('n must be <= ' + MAX_N) if n > MAX_N (if enforced)
    - Returns: Array length n
  - export function fizzBuzzStrings(n: number): Array<string>
    - Same validation rules; returns strings only
  - export function* fizzBuzzGenerator(n: number): IterableIterator<string | number>
    - Same validation rules; yields in order 1..n
- Example configuration options with exact effects (no code block):
  - output: 'mixed' -> non-multiples are numbers, multiples are strings
  - output: 'string' -> all entries are strings
  - mode: 'array' -> returns array; 'generator' -> returns generator; 'stream' -> writes to supplied writable stream

10. Digest of SOURCES.md and retrieval date
- Source entries from SOURCES.md (retrieved 2026-03-08T13:36:45.497Z):
  - https://en.wikipedia.org/wiki/Fizz_buzz  (FizzBuzz algorithm and historical notes)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (ESM import/export guidance and package.json type behavior)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (Number.isInteger signature and behavior)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (RangeError usage and constructor signature)
  - https://www.npmjs.com/package/fizzbuzz  (existing package entry showing common API/usage patterns)
  - https://vitest.dev/guide/  (Vitest test patterns and commands; run with npm test defined in package.json)
- Retrieval date: 2026-03-08

11. Attribution and data size
- Attribution: content consolidated from URLs listed in the SOURCES.md file above; key technical points taken from MDN documentation pages, npm package metadata and Wikipedia algorithm description.
- Data obtained during crawl: SOURCES.md file listing 6 source URLs; no external page HTML was fetched during this extraction step. SOURCES.md file size: approximately 1.5 KB.

Supplementary details and troubleshooting
- Troubleshooting: if tests report mismatched types (e.g., '1' vs 1), ensure test expectations match chosen API mode (mixed vs string-only).
- If package consumers experience CJS/ESM import errors, verify package.json has correct "type" and/or use conditional exports mapping for both require() and import.
- Memory OOM on large n: switch to generator/stream mode or reduce MAX_N; add explicit memory checks and document them.
- Lint and format: follow repository patterns; avoid unnecessary whitespace or reformatting unrelated lines.

End of FIZZBUZZ_SPEC
