FIZZBUZZ_REF

Table of contents
1. Normalised extract
  1.1 Core algorithm and deterministic contract
  1.2 Input validation and canonical RangeError semantics (exact checks and messages)
  1.3 API signature, return types, and module export
  1.4 Module resolution and package type notes
2. Supplementary details
  2.1 Constants and implementation knobs
  2.2 Testing and CI commands (Vitest, npm)
  2.3 Integration and packaging (npm) checklist
3. Reference details
  3.1 Precise validation logic (stepwise, exact messages)
  3.2 Function signature and return typing (exact)
  3.3 Implementation pattern (stepwise, complexity)
  3.4 Configuration options and effects
  3.5 Troubleshooting and deterministic checks
4. Detailed digest
  4.1 Source extract from SOURCES.md (retrieved 2026-03-08)
5. Attribution and crawl metadata

1. Normalised extract

1.1 Core algorithm and deterministic contract
- For input integer n produce an Array of length n where the element at index (i-1) corresponds to integer i for i in 1..n inclusive.
- Mapping (apply in this exact priority order):
  - If i % 15 === 0 then element is the exact string FizzBuzz
  - Else if i % 3 === 0 then element is the exact string Fizz
  - Else if i % 5 === 0 then element is the exact string Buzz
  - Else element is the integer i (JavaScript Number value)
- MUSTs for implementations:
  - Returned array length MUST equal n.
  - Elements MUST be ordered to correspond to integers 1..n.
  - Elements that are not Fizz/Buzz/FizzBuzz MUST be Number typed values (not strings).

1.2 Input validation and canonical RangeError semantics (exact checks and messages)
- Perform the following checks in this exact order; on failure throw a RangeError with the exact message shown:
  1. If Number.isFinite(n) === false then throw new RangeError('n must be finite')
  2. If Number.isInteger(n) === false then throw new RangeError('n must be an integer')
  3. If n < 1 then throw new RangeError('n must be >= 1')
  4. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)
- Use RangeError exclusively for numeric domain/type violations; do not use TypeError for these checks.

1.3 API signature, return types, and module export
- Primary export name: fizzBuzz
- Exact function signature: export function fizzBuzz(n: number): Array<string | number>
- Behavior: returns an Array of length n where items are either the exact strings "Fizz", "Buzz", "FizzBuzz" or a JavaScript Number for non-matching positions.
- Export forms supported: ESM named export as above. Consumer may import with import { fizzBuzz } from 'pkg' or require the package when a CommonJS build target / interop exists; verify package.json "main"/"module" fields.

1.4 Module resolution and package type notes
- package.json "type" affects .js interpretation: "module" makes .js ESM, absent or "commonjs" makes .js CommonJS. Use .mjs for forced ESM and .cjs for forced CommonJS.
- For bare specifiers ensure the package exposes an entry via "exports" or "main" to be consumable by import/require and bundlers.

2. Supplementary details

2.1 Constants and implementation knobs
- MAX_N: recommended constant value used for upper bound checks. Use MAX_N = 10000000 unless project-specific constraints demand change.
- Complexity: O(n) time, O(n) additional space for returned array. Avoid generating large arrays above MAX_N.

2.2 Testing and CI commands (Vitest, npm)
- Unit test runner: Vitest. Typical scripts:
  - npm test -> runs vitest for unit tests (vitest --run tests/unit/*.test.js)
  - npm run test:unit -> runs vitest with coverage
- CI reproducible install: use lockfile-driven install: npm ci or yarn install --frozen-lockfile.

2.3 Integration and packaging (npm) checklist
- Inspect package before use: npm view fizzbuzz --json to get package.json metadata.
- Pin versions in CI: npm install --save fizzbuzz@<version> or lock via package-lock.json.
- Verify exports: check package.json "main", "module", "types", and "bin" to determine programmatic vs CLI usage.

3. Reference details

3.1 Precise validation logic (stepwise, exact messages)
- Step 1: if (Number.isFinite(n) === false) throw new RangeError('n must be finite')
- Step 2: if (Number.isInteger(n) === false) throw new RangeError('n must be an integer')
- Step 3: if (n < 1) throw new RangeError('n must be >= 1')
- Step 4: if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)
- Rationale: Number.isFinite and Number.isInteger are the canonical ECMAScript checks; RangeError is the canonical error type for numeric domain violations.

3.2 Function signature and return typing (exact)
- export function fizzBuzz(n: number): Array<string | number>
- Return contract: Array length === n; each element is either exactly one of the strings: Fizz, Buzz, FizzBuzz or a Number corresponding to the integer position.

3.3 Implementation pattern (stepwise, complexity)
- Initialize result array of length n (or push in loop). Loop i from 1 to n inclusive and apply mapping priority for each i.
- Prefer simple branch checks: if (i % 15 === 0) -> FizzBuzz; else if (i % 3 === 0) -> Fizz; else if (i % 5 === 0) -> Buzz; else -> i.
- Ensure numeric outputs are actual Number values, not string representations.
- Complexity: single pass, O(n) time and O(n) memory.

3.4 Configuration options and effects
- MAX_N controls the upper bound; raising MAX_N increases memory/time risk; lowering it reduces supported input range.
- module type in package.json controls ESM vs CJS interpretation for .js extension; set according to intended consumers.

3.5 Troubleshooting and deterministic checks
- If tests fail due to element types being strings for non-Fizz outputs, ensure numeric values are not coerced to strings anywhere in the pipeline.
- If array length mismatches expected n, confirm loop bounds and off-by-one indexing (index = i-1 mapping).
- If import fails in consumer projects, verify package.json exports/main/module and the consumer's module resolution configuration (.mjs/.cjs or type field).

4. Detailed digest

4.1 Source extract from SOURCES.md (retrieved 2026-03-08)
- Sources consulted: https://en.wikipedia.org/wiki/Fizz_buzz ; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules ; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger ; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError ; https://www.npmjs.com/package/fizzbuzz ; https://vitest.dev/guide/ .
- Retrieved: 2026-03-08 (source list consolidated in repository SOURCES.md).

5. Attribution and crawl metadata
- Attribution: consolidated from the URLs listed above as recorded in repository SOURCES.md.
- Crawl data size: aggregated source index referenced ~6 URLs; extracted actionable content condensed to ~4 KB of technical directives in this document.
