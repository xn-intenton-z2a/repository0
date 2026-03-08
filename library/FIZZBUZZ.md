FIZZBUZZ

Table of contents
1. Normalised extract
  1.1 FizzBuzz algorithm and deterministic contract
  1.2 Input validation and canonical error semantics
  1.3 API signatures and return types
  1.4 Module export/import patterns (ESM & CommonJS)
  1.5 Implementation patterns and complexity
2. Supplementary details and implementation knobs
3. Reference details (exact API signatures, messages, configs)
4. Detailed digest (SOURCES.md excerpt and retrieval metadata)
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz algorithm and deterministic contract
- For each integer i in the inclusive integer range 1..n produce result at index (i-1).
- Output mapping (priority order):
  - If i % 15 === 0 then output the exact string: FizzBuzz
  - Else if i % 3 === 0 then output the exact string: Fizz
  - Else if i % 5 === 0 then output the exact string: Buzz
  - Else output the integer i (JavaScript Number when API is typed as Array<string | number>)
- Deterministic contract:
  - Returned array length MUST equal n.
  - Element order MUST map to integers 1..n.
  - Elements that are not Fizz/Buzz/FizzBuzz MUST be Number typed values when API declares Array<string | number>.

1.2 Input validation and canonical error semantics
- Validation checks and exact throw messages (apply in this order):
  1. If Number.isFinite(n) === false then throw new RangeError('n must be finite')
  2. If Number.isInteger(n) === false then throw new RangeError('n must be an integer')
  3. If n < 1 then throw new RangeError('n must be >= 1')
  4. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N) where MAX_N is an implementation-chosen safe upper bound
- Recommended MAX_N: 10000000 (10,000,000). Use RangeError for numeric domain violations only.

1.3 API signatures and return types
- Primary function (array-return):
  - Signature: export function fizzBuzz(n: number): Array<string | number>
  - Parameters: n (required) - integer upper bound; sequence is 1..n inclusive.
  - Returns: array length n where index (i-1) holds either 'Fizz', 'Buzz', 'FizzBuzz' or the Number i.
- String-return variant:
  - Signature: export function fizzBuzzAsString(n: number): Array<string>
  - Returns: numbers coerced to decimal string form.
- Generator/streaming variant:
  - Signature: export function* fizzBuzzGenerator(n: number): IterableIterator<string | number>
  - Behavior: yields sequence values 1..n without allocating whole array.
- Configurable variant:
  - Signature: export function fizzBuzzWithOptions(n: number, opts?: {start?: number, end?: number, asString?: boolean, max?: number}): Array<string | number>
  - Behavior: supports start (default 1), end (inclusive), asString true to return strings, and max as safety bound.

1.4 Module export/import patterns (ESM & CommonJS)
- ESM behaviour (package.json "type": "module" or .mjs):
  - Named export: export function fizzBuzz(n) { ... }
  - Default export: export default function fizzBuzz(n) { ... }
  - Import examples: import { fizzBuzz } from './lib/fizz.js' or import fizzBuzz from './lib/fizz.js'
- CommonJS behaviour (.cjs or "type": "commonjs"):
  - Export: module.exports = { fizzBuzz }
  - Import: const { fizzBuzz } = require('./lib/fizz.cjs')
- Publishing recommendation: provide dual entry points or package.json "exports" mapping for import/require consumers.

1.5 Implementation patterns and complexity
- Time complexity: O(n) with constant work per element.
- Memory:
  - Array-return: O(n) memory.
  - Generator/streaming: O(1) additional memory.
- Micro-optimizations:
  - Prefer checking i % 15 === 0 first (or compute flags for 3 and 5) to implement combined FizzBuzz rule.
  - Pre-allocate result array length n and assign by index to avoid incremental growth overhead.
- Large-n guidance: use generator variant for very large sequences; enforce MAX_N to avoid accidental OOM.

2. Supplementary details and implementation knobs
- Options object defaults and effects:
  - opts.start: number, default 1; when provided sequence begins at start.
  - opts.end: number, optional; inclusive end overrides n when present.
  - opts.asString: boolean, default false; when true all outputs are strings and return type is Array<string>.
  - opts.max: number, default 1e7; enforced safety bound causing RangeError when exceeded.
- UI and rendering notes:
  - asString true simplifies template rendering but changes return typing; prefer explicit API variant when type stability is important.
- CI/Test knobs:
  - Use npm ci in CI for lockfile-consistent install; run npm test (vitest) and optionally npm run test:unit for coverage.

3. Reference details (exact API signatures, messages, configs)
- Exact validation error messages and checks (implement verbatim):
  - if (!Number.isFinite(n)) throw new RangeError('n must be finite')
  - if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
  - if (n < 1) throw new RangeError('n must be >= 1')
  - const MAX_N = 10000000; if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)
- API signatures (explicit):
  - export function fizzBuzz(n: number): Array<string | number>
  - export function fizzBuzzAsString(n: number): Array<string>
  - export function* fizzBuzzGenerator(n: number): IterableIterator<string | number>
  - export function fizzBuzzWithOptions(n: number, opts?: {start?: number, end?: number, asString?: boolean, max?: number}): Array<string | number>
- package.json relevant fields (effects):
  - "type": "module" => .js files parsed as ESM; provide .cjs for CommonJS consumers or use "exports" map.
  - "engines": { "node": ">=24.0.0" } => runtime requirement for Node features.
- Test commands (package.json scripts):
  - npm test -> vitest --run tests/unit/*.test.js
  - npm run test:unit -> vitest --run --coverage tests/unit/*.test.js
  - npm run test:behaviour -> npm run build:web && npx playwright test --config playwright.config.js

4. Detailed digest (SOURCES.md excerpt and retrieval metadata)
- Extracted source lines (from project SOURCES.md):
  - https://en.wikipedia.org/wiki/Fizz_buzz
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - https://www.npmjs.com/package/fizzbuzz
  - https://vitest.dev/guide/
- Retrieval date: 2026-03-08
- Crawl data byte size (SOURCES.md): 591 bytes

5. Attribution and crawl data size
- Attribution: Consolidated from the URLs listed above; consult the original sources for extended explanations, examples and full API docs.
- Data size obtained from SOURCES.md when read: 591 bytes

[NARRATIVE] Consolidated and updated library/FIZZBUZZ.md with a normalized, actionable FizzBuzz implementation spec and exact validation messages sourced from SOURCES.md on 2026-03-08 for use in implementation and tests.
