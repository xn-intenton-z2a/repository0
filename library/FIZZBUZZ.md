FIZZBUZZ

Table of contents
1. Rule set and direct algorithm
2. Input validation and errors
3. API signatures and return types
4. Module export/import patterns (ESM & CommonJS)
5. Implementation patterns and complexity
6. Configuration options and variants
7. Testing and Vitest usage
8. Supplementary technical specifications
9. Reference digest and attribution

1. Rule set and direct algorithm
- For each integer i in the inclusive integer range 1..n:
  - If i % 3 === 0 and i % 5 === 0 -> output the exact string: FizzBuzz
  - Else if i % 3 === 0 -> output the exact string: Fizz
  - Else if i % 5 === 0 -> output the exact string: Buzz
  - Else -> output the integer i (or the decimal string representation of i depending on output mode)
- Implementation-critical detail: check for divisibility by 3 and 5 independently and prefer the combined case when both are true (equivalently check i % 15 === 0 first).
- Deterministic output order: index i in the result corresponds to the i-th number in the 1..n sequence.

2. Input validation and errors
- Use Number.isInteger(value) to validate integer inputs; signature: Number.isInteger(value) -> boolean.
- Accept only finite integers; reject NaN and infinite values.
- Enforce lower and upper bounds explicitly. Recommended validation rules for a public API:
  - n must be an integer: if (!Number.isInteger(n)) throw new RangeError('n must be an integer');
  - n must be >= 1: if (n < 1) throw new RangeError('n must be >= 1');
  - Optionally enforce an upper bound for safety (e.g., n <= 1e7) and throw RangeError if exceeded.
- Use RangeError when an input value is outside the allowed numeric range or type; RangeError construction: new RangeError(message) -> Error instance.

3. API signatures and return types
- Primary function (array-return):
  - Signature: export function fizzBuzz(n: number): Array<string | number>
  - Parameters: n (required) - integer, inclusive upper bound of sequence starting at 1.
  - Returns: an array of length n where element at index (i-1) is one of: "Fizz", "Buzz", "FizzBuzz", or the original integer i (type number) depending on divisibility rules.
- String-return variant (all outputs as strings):
  - Signature: export function fizzBuzzAsString(n: number): Array<string>
  - Returns: array of strings where number outputs are decimal string forms of the integer.
- Generator/streaming variant (memory-efficient):
  - Signature: export function* fizzBuzzGenerator(n: number): IterableIterator<string | number>
  - Behavior: yields outputs in sequence for i=1..n without storing whole array.
- Configurable variant using options object:
  - Signature: export function fizzBuzzWithOptions(n: number, opts?: {start?: number, end?: number, asString?: boolean, max?: number}): Array<string | number>
  - Behavior: supports custom start (default 1), explicit end, asString true to coerce numbers to strings, and max to set a safety upper bound.

4. Module export/import patterns (ESM & CommonJS)
- ESM (package.json contains "type":"module" or using .mjs):
  - Named export: export function fizzBuzz(n) { ... }
  - Default export: export default function fizzBuzz(n) { ... }
  - Import named: import { fizzBuzz } from './lib/fizz.js'
  - Import default: import fizzBuzz from './lib/fizz.js'
- CommonJS (require):
  - Export via module.exports = { fizzBuzz }
  - Import: const { fizzBuzz } = require('./lib/fizz.cjs')
- Node specifics: when publishing a package, provide dual entry points or use exports field in package.json for both import and require consumers; for this repository package.json already sets "type": "module" which enables ESM import syntax by default.

5. Implementation patterns and complexity
- Time complexity: O(n) where n is the upper bound; constant-time arithmetic per element.
- Memory:
  - Array-return implementation uses O(n) memory.
  - Generator/streaming implementation uses O(1) additional memory and yields values incrementally.
- Algorithmic micro-optimizations: avoid string concatenation where possible by selecting result based on checks; e.g., compute flags isDivBy3 and isDivBy5 and branch on combinations.
- Performance notes: for very large n use the streaming/generator variant; when constructing arrays for UI rendering, pre-allocate array length n and assign by index to avoid repeated array growth.

6. Configuration options and variants
- Options object shape and defaults:
  - opts.start: number, default 1. When start !== 1, sequence begins at start and ends at end or start + n - 1.
  - opts.end: number, optional; if present, defines inclusive end of range; if using end, n is ignored.
  - opts.asString: boolean, default false; when true, numbers are returned as decimal strings rather than numeric type.
  - opts.max: number, default 1e7; enforced safety upper bound; if exceeded throw RangeError.
- Effects:
  - asString true: simplifies UI display pipeline but changes return type to Array<string>.
  - start/end: enables partial sequences for paginated or windowed consumers.

7. Testing and Vitest usage
- Test runner: Vitest. Commands (from package.json):
  - npm test -> runs vitest on tests/unit/*.test.js
  - npm run test:unit -> runs vitest with coverage
- Test structure recommendations:
  - Create tests/unit/fizz.test.js exporting cases for boundaries, typical numbers and invalid inputs.
  - Example assertions (Vitest): import { expect, it } from 'vitest'; it('3 -> Fizz', () => expect(fizzBuzz(3)[2]).toBe('Fizz'))
  - Include tests for validation: non-integer input should throw RangeError; negative input should throw RangeError.
- E2E/Behaviour tests: use npm run test:behaviour which depends on built docs and Playwright for UI tests; ensure build:web succeeds by copying src/lib/fizz.js and static assets.

8. Supplementary technical specifications
- Node engine requirement: node >= 24.0.0 (as declared in package.json engines field).
- Package build script: npm run build:web copies docs and exports lib metadata; ensure src/lib/fizz.js is present for docs build.
- Publishing considerations: if publishing to npm provide exports/entry points for ESM and CJS and document the API signatures above in README.

9. Reference digest and attribution
- Sources indexed (retrieved):
  - https://en.wikipedia.org/wiki/Fizz_buzz  -- canonical problem statement and variations
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  -- ESM export/import forms and package.json type handling
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  -- Number.isInteger behavior and signature
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  -- RangeError construction and usage
  - https://www.npmjs.com/package/fizzbuzz  -- existing npm package (reference for alternative implementations)
  - https://vitest.dev/guide/  -- vitest usage and test structure guidance
- Retrieval date: 2026-03-08
- Crawl data size (SOURCES.md): 591 bytes
- Attribution: content consolidated from the listed sources; please consult the original URLs for full external documentation and package README files.

Data size and provenance
- Source file: SOURCES.md (project root)
- Byte size measured when reading: 591 bytes
- This document consolidates the implementation-critical technical details required to implement, test, export, and publish a FizzBuzz library in JavaScript/Node (ESM and optional CJS compatibility).

End of FIZZBUZZ document
