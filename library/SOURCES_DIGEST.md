SOURCES_DIGEST

Table of contents
1. Normalised extract (core technical content)
2. Supplementary details (specs and implementation knobs)
3. Reference details (exact signatures, messages, CLI commands)
4. Detailed digest (source extracts and retrieval date)
5. Attribution and crawl data size

1. Normalised extract (core technical content)

FizzBuzz deterministic contract and core algorithm
- For each integer i in the inclusive sequence 1..n produce an output at array index (i-1).
- Output mapping (priority order, exact strings):
  - If i % 15 === 0 => exact string: FizzBuzz
  - Else if i % 3 === 0 => exact string: Fizz
  - Else if i % 5 === 0 => exact string: Buzz
  - Else => the integer i as a JavaScript Number value
- Implementation-critical: test combined divisibility first (i % 15 === 0) to enforce priority and avoid misclassification.
- Contract invariants: returned array length === n; element at index (i-1) corresponds to integer i; non-Fizz/Buzz elements are Numbers.

Input validation canonical checks and exact RangeError messages
- Use Number.isInteger(n) and Number.isFinite(n) for validation.
- Canonical checks and exact throw messages (use RangeError):
  - if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
  - if (n < 1) throw new RangeError('n must be >= 1')
  - const MAX_N = 10000000; if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)
  - if (!Number.isFinite(n)) throw new RangeError('n must be finite')
- Use RangeError for numeric domain violations; do not use TypeError for numeric range errors.

Number.isInteger precise semantics
- Signature: Number.isInteger(value) -> boolean
- Returns true only if Type(value) is Number, value is finite, and value has zero fractional component (within IEEE-754 representation limits).
- Returns false for NaN, +Infinity, -Infinity and non-number types (strings, booleans, objects, BigInt).
- Precision caveat: floating values that represent integers due to IEEE-754 rounding (e.g., 5.0000000000000001) will return true.

RangeError construction and identity
- Constructor: new RangeError(message?: string) -> RangeError instance
- Instance properties: name === 'RangeError', message === provided string or ''
- instanceof RangeError and instanceof Error evaluate true for instances.
- Recommended message conventions: short, machine-parseable strings beginning with parameter name (e.g., "n must be an integer").

JavaScript module resolution and module type behavior (practical rules)
- package.json "type" field effects:
  - "type": "module" -> .js files are parsed as ESM; .mjs always ESM; .cjs always CommonJS
  - absence or "commonjs" -> .js files are CommonJS by default
- File extensions and parsing rules: .mjs -> ESM, .cjs -> CJS, .js -> depends on package "type"
- Export patterns:
  - Named export: export function fizzBuzz(n) { ... }
  - Aggregate export: export { name, draw }
  - Default export: export default value
- Import patterns:
  - Static named import: import { fizzBuzz } from './fizz.js'
  - Namespace import: import * as lib from './lib.js'
  - Dynamic import: await import('./module.js')
- Import maps (browser): imports and scopes keys map bare specifiers or prefixes to URLs; trailing slash indicates prefix remapping; longest key wins when matching.
- CommonJS interop: require('pkg').fizzBuzz works if package exposes CJS entry or interop layer; ESM-only packages require dynamic import or loader interop.

Testing with Vitest (practical usage)
- Install: npm install -D vitest (or yarn add -D vitest)
- CLI: npx vitest or add script: "test": "vitest"
- Run once (no watch): vitest run  or npm run test with configuration
- Test file naming: default pattern requires .test. or .spec. in file name
- Config: vitest reads vite.config if present; vitest.config.* can override; supported extensions: .js, .mjs, .cjs, .ts, .cts, .mts

2. Supplementary details (specs and implementation knobs)

Performance and bounds
- Choose a safe MAX_N (example MAX_N = 10_000_000) to limit memory and time; allocate result array length n once to avoid repeated resizing.
- Time complexity: O(n) with simple modulo checks per element; memory O(n) for result array.
- For extremely large n prefer streaming or iterator-based API variants to avoid materializing the whole array.

Error handling and type-safe API surface
- Public API signature (ESM named export): export function fizzBuzz(n: number): Array<string | number>
  - Parameter: n (finite integer, 1 <= n <= MAX_N)
  - Returns: Array of length n containing exact strings 'Fizz', 'Buzz', 'FizzBuzz' or Number values
- Optionally provide a streaming/iterator API: export function* fizzBuzzGenerator(n) { yield ... } for memory-constrained use cases.

Module packaging recommendations
- When publishing to npm and wanting both ESM and CJS consumers, include both module entrypoints via package.json fields: "main" (CJS), "module" (ESM), and/or exports map for fine-grained entry control.
- If using "type": "module" set at package root, provide a fallback CJS build or use conditional exports to avoid breaking older Node consumers.

Testing patterns using Vitest
- Unit test: assert array length === n and spot-check positions for combined and single divisibility cases (e.g., 3 -> 'Fizz', 5 -> 'Buzz', 15 -> 'FizzBuzz').
- Assert thrown RangeError messages exactly when invalid inputs are provided to validate canonical messages.
- Use coverage: vitest run --coverage and add script "test:unit": "vitest --run --coverage tests/unit/*.test.js" if desired.

3. Reference details (exact signatures, messages, CLI commands)

API signatures and returns
- export function fizzBuzz(n: number): Array<string | number>
- (optional) export function* fizzBuzzGenerator(n: number): IterableIterator<string | number>

Exact validation throw messages (implement verbatim)
- "n must be an integer"
- "n must be >= 1"
- "n must be <= " + MAX_N
- "n must be finite"

Number.isInteger
- Number.isInteger(value) -> boolean
- Behavior: returns true if Type(value) is Number, is finite, and has no fractional component; false otherwise.

RangeError
- new RangeError(message?: string) -> RangeError
- Instance properties: name === 'RangeError'

Vitest commands and patterns
- Install dev dependency: npm install -D vitest
- Run tests once: npx vitest --run  OR npm run test  (if script configured)
- Run with coverage: npx vitest --run --coverage  OR npm run test:unit if script configured

NPM package inspection (recommended commands)
- Inspect metadata without fetching the package page: npm view fizzbuzz --json
- Fetch tarball to inspect: npm pack fizzbuzz@<version> then tar -xvf <tarball>

4. Detailed digest (source extracts and retrieval date)

Sources retrieved and key extracts (retrieval date: 2026-03-08)
- https://en.wikipedia.org/wiki/Fizz_buzz
  - Extract: game rules mapping divisibility by 3 -> "fizz", 5 -> "buzz", both -> "fizzbuzz"; used as canonical problem statement and interview screening example.
  - Approx size retrieved: ~1.5 KB
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - Extract: module authoring and consumption rules; package.json "type" field effects; .mjs vs .js; export/import syntax; import maps usage and semantics; caching and scoped imports.
  - Approx size retrieved: ~25 KB (truncated content returned by fetch)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - Extract: signature Number.isInteger(value) -> boolean; exact semantics and edge cases including IEEE-754 precision caveats and examples.
  - Approx size retrieved: ~3 KB
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - Extract: RangeError description, constructor signature, recommended usage examples for numeric bounds and message examples.
  - Approx size retrieved: ~2 KB
- https://www.npmjs.com/package/fizzbuzz
  - Attempted fetch returned HTTP 403 from npm web UI; npm registry inspection recommended via CLI: npm view fizzbuzz --json or npm pack.
  - No web content included due to 403; size: 0 KB
- https://vitest.dev/guide/
  - Extract: installation commands, test file naming conventions, configuration resolution with vite.config, CLI usage and run modes, examples and project support.
  - Approx size retrieved: ~18 KB

5. Attribution and crawl data size

Retrieval date: 2026-03-08
Sources crawled:
- Wikipedia (Fizz buzz) — en.wikipedia.org — ~1.5 KB retrieved
- MDN JavaScript Modules — developer.mozilla.org — ~25 KB retrieved (truncated)
- MDN Number.isInteger — developer.mozilla.org — ~3 KB retrieved
- MDN RangeError — developer.mozilla.org — ~2 KB retrieved
- npm package page fizzbuzz — npmjs.com — fetch returned 403 (no content retrieved)
- Vitest guide — vitest.dev — ~18 KB retrieved

Attribution: content excerpts taken from the above sources on 2026-03-08 as allowed by their respective terms. Use originals for verbatim quoting in downstream publications.

Notes and next steps
- The canonical API signatures and exact RangeError messages above should be implemented verbatim in src/lib/fizz.js or src/lib/main.js to match tests and external expectations.
- If publishing to npm, inspect the fizzbuzz package via npm view before depending on it; web UI may block automated fetches.

[END OF DOCUMENT]
