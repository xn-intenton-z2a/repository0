CRAWL_EXTRACT

Table of contents
1. Normalised extract
  1.1 FizzBuzz algorithm and deterministic contract
  1.2 Input validation and canonical error semantics
  1.3 JavaScript module consumption and export patterns
  1.4 Number.isInteger / Number.isFinite exact semantics
  1.5 RangeError constructor and canonical messages
  1.6 NPM package handling for fizzbuzz
  1.7 Vitest commands and configuration essentials
2. Supplementary details and implementation knobs
3. Reference details (API signatures, exact messages, configs, method signatures)
4. Detailed digest (sources and retrieval metadata)
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz algorithm and deterministic contract
- For each integer i in the inclusive sequence 1..n, produce an output value at result index (i-1).
- Exact mapping (apply in this priority order):
  - If i % 15 === 0 then output the exact string: FizzBuzz
  - Else if i % 3 === 0 then output the exact string: Fizz
  - Else if i % 5 === 0 then output the exact string: Buzz
  - Else output the integer i as a JavaScript Number
- Deterministic contract requirements:
  - Returned array length MUST equal n.
  - Element order MUST correspond to integers 1..n.
  - Elements that are not Fizz/FizzBuzz/Buzz MUST be Number typed values when API is declared Array<string | number>.

1.2 Input validation and canonical error semantics
- Implement the following checks in the exact order below and throw the exact RangeError messages verbatim:
  1. If Number.isFinite(n) === false => throw new RangeError('n must be finite')
  2. If Number.isInteger(n) === false => throw new RangeError('n must be an integer')
  3. If n < 1 => throw new RangeError('n must be >= 1')
  4. If n > MAX_N => throw new RangeError('n must be <= ' + MAX_N) where MAX_N is an implementation-chosen safe upper bound (recommended value: 10000000)
- Use RangeError for numeric domain/type violations; do not use TypeError for these numeric range checks.

1.3 JavaScript module consumption and export patterns
- ESM vs CommonJS behaviour:
  - package.json "type": "module" => .js files are parsed as ESM.
  - .mjs files are always ESM; .cjs files are always CommonJS.
- Preferred public API export forms (explicit patterns):
  - ESM named export: export function fizzBuzz(n) { ... }
  - ESM default export (if desired): export default function fizzBuzz(n) { ... }
  - CommonJS compatibility: module.exports = { fizzBuzz } or exports.fizzBuzz = fizzBuzz
- Import patterns:
  - ESM static: import { fizzBuzz } from './fizz.js'
  - CommonJS require: const { fizzBuzz } = require('./fizz.cjs')
- For packages offering both entry points, include package.json fields: "main" for CommonJS, "module" or "exports" for ESM resolution.

1.4 Number.isInteger / Number.isFinite exact semantics
- Signatures and exact semantics:
  - Number.isInteger(value) -> boolean
    - Returns true only when Type(value) is Number, value is finite, and value has no fractional component.
    - Returns false for NaN, +Infinity, -Infinity, non-number types (string, boolean, object, null, undefined, BigInt, Symbol).
  - Number.isFinite(value) -> boolean
    - Returns true only when Type(value) is Number and value is finite (not NaN or ±Infinity).
- Polyfill considerations: ensure checks preserve the same order and short-circuit behaviour as the spec.

1.5 RangeError constructor and canonical messages
- Constructor signature: new RangeError(message?: string) -> RangeError instance
- Properties to rely on: name === 'RangeError'; instanceof RangeError === true; instanceof Error === true
- Canonical message conventions (examples used verbatim above):
  - 'n must be finite'
  - 'n must be an integer'
  - 'n must be >= 1'
  - 'n must be <= ' + MAX_N
- Use concise, parseable messages that start with the parameter name followed by the constraint.

1.6 NPM package handling for fizzbuzz
- Installation commands:
  - Production dependency: npm install --save fizzbuzz
  - Dev dependency: npm install --save-dev fizzbuzz
  - CI reproducible install: npm ci (requires package-lock.json)
  - Pin exact version: npm install --save fizzbuzz@x.y.z
- Inspection commands:
  - npm view fizzbuzz --json  -> returns package.json metadata (versions, main/module, types, dist.tarball)
  - npm pack --dry-run or npm pack to inspect tarball contents locally
  - Verify integrity: use npm audit and inspect tarball or unpack to review source files before use

1.7 Vitest commands and configuration essentials
- Installation: npm install -D vitest and (optional) a coverage provider such as @vitest/coverage-v8
- CLI usage:
  - Single-run test: vitest --run
  - Coverage: vitest --run --coverage
  - Specify config: vitest --config vitest.config.js or pass JS/TS config files
- Recommended package.json scripts (examples):
  - "test": "vitest --run tests/unit/*.test.js"
  - "test:unit": "vitest --run --coverage tests/unit/*.test.js"
- Config basics (defineConfig from 'vitest/config'):
  - test.include: array of glob strings to discover test files
  - test.exclude: globs to exclude
  - test.environment: 'node' or 'jsdom'
  - test.setupFiles: files run before tests

2. Supplementary details and implementation knobs
- Complexity: straightforward array implementation is O(n) time and O(n) memory. For large n consider streaming output or generator function to avoid O(n) memory use.
- MAX_N: recommended default MAX_N = 10_000_000 to avoid DoS or memory exhaustion; implementers may choose lower limits based on environment constraints.
- Streaming variant signature suggestion: function* fizzBuzzGenerator(MAX_N) or async iterable for very large sequences to reduce memory.
- Performance micro-optimizations:
  - Use simple integer modulus checks; check for (i % 15 === 0) first to fold combined case.
  - Pre-allocate array with new Array(n) and assign by index to avoid repeated push overhead in some engines.

3. Reference details (API signatures, exact messages, configs, method signatures)
- Primary API (ESM):
  - Signature: export function fizzBuzz(n: number): Array<string | number>
  - Behavior: returns an array 'out' where for each i in 1..n, out[i-1] follows the Fizz/Buzz mapping above.
  - Throws (in exact order):
    1. If Number.isFinite(n) === false -> throw new RangeError('n must be finite')
    2. If Number.isInteger(n) === false -> throw new RangeError('n must be an integer')
    3. If n < 1 -> throw new RangeError('n must be >= 1')
    4. If n > MAX_N -> throw new RangeError('n must be <= ' + MAX_N)
  - Return type: Array<string | number>

- Alternative API (CommonJS):
  - module.exports = { fizzBuzz }
  - Usage: const { fizzBuzz } = require('fizzbuzz')

- Streaming/generator API (optional):
  - Signature: export function* fizzBuzzGenerator(n: number): Iterable<string | number>
  - Same validation rules and throws as above. Yields values in order 1..n.

- Package.json integration notes:
  - For ESM-first packages: include "type": "module" at package root, set "module" or "exports" fields for ESM entry point and "main" for CJS fallback if required.

- Vitest config example keys to set (exact keys and expected types):
  - test.include: string[] (glob patterns)
  - test.exclude: string[] (glob patterns)
  - test.environment: string === 'node' | 'jsdom'
  - test.setupFiles: string[] (file paths)

4. Detailed digest (SOURCES.md excerpt and retrieval date)
- Sources consulted (retrieval date: 2026-03-08):
  - https://en.wikipedia.org/wiki/Fizz_buzz  (FizzBuzz algorithm definition and canonical description)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (ESM patterns, package.json type behavior)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (Number.isInteger semantics)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (RangeError constructor and semantics)
  - https://www.npmjs.com/package/fizzbuzz  (npm package metadata and install patterns)
  - https://vitest.dev/guide/  (Vitest CLI, config and usage)
- Retrieval date: 2026-03-08

5. Attribution and crawl data size
- Attribution: content condensed and normalized from the above URLs; derived content is an actionable technical extract for implementation.
- Crawl data size (aggregated content retrieved from sources listed in SOURCES.md at time of extraction): approximately 9 KB (9216 bytes) of raw text extracted and normalized into this document.

End of CRAWL_EXTRACT
