IMPLEMENTATION_GUIDE

Table of contents
1. Normalised extract
   1.1 FizzBuzz algorithm and deterministic contract
   1.2 Input validation and canonical RangeError semantics
   1.3 JavaScript module resolution and module type effects
   1.4 Number.isInteger and Number.isFinite precise semantics
   1.5 RangeError constructor and exact messages
   1.6 NPM package integration checklist for fizzbuzz
   1.7 Vitest essential setup and CLI usage
2. Supplementary details and implementation knobs
3. Reference details (exact API signatures, messages, configs)
4. Detailed digest (SOURCES.md excerpt and retrieval date)
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz algorithm and deterministic contract
- For each integer i in the inclusive integer range 1..n produce a result at index (i-1).
- Output mapping (checked in priority order):
  - If i % 15 === 0 then output the exact string: FizzBuzz
  - Else if i % 3 === 0 then output the exact string: Fizz
  - Else if i % 5 === 0 then output the exact string: Buzz
  - Else output the integer i (JavaScript Number when API is typed as Array<string | number>)
- Deterministic contract: returned array length MUST equal n; element order MUST map to integers 1..n; non-Fizz/Buzz entries MUST be numeric Number values when typed as Array<string | number>.

1.2 Input validation and canonical RangeError semantics
- Validation steps and exact checks (apply in this order):
  1. If Number.isFinite(n) === false then throw new RangeError('n must be finite')
  2. If Number.isInteger(n) === false then throw new RangeError('n must be an integer')
  3. If n < 1 then throw new RangeError('n must be >= 1')
  4. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)
- Recommended MAX_N for public APIs: 10000000 (10 million) but implementations may choose another safe upper bound; include the chosen MAX_N in the thrown message by concatenation.
- Use RangeError only for numeric domain violations; use TypeError for non-numeric type errors if needed but follow the numeric-RangeError pattern above for number inputs.

1.3 JavaScript module resolution and module type effects
- package.json "type" field behavior:
  - "type": "module" => files with .js are interpreted as ESM
  - Absent or "commonjs" => .js are CommonJS
  - Extensions override: .mjs always ESM, .cjs always CommonJS
- Resolution details: relative specifiers (./ ../ /) resolve to file paths using extension lookup rules; bare specifiers require package resolution via node_modules and package.json "exports" or "main".
- For library entry points: provide both CJS and ESM entry points using package.json fields (main, module, exports) when supporting both consumers.

1.4 Number.isInteger and Number.isFinite precise semantics
- Number.isInteger(value) -> boolean
  - Returns true only if typeof value == 'number', value is finite, and floor/ceil truncation equals value (no fractional part).
  - Returns false for NaN, +Infinity, -Infinity, and non-number types.
- Number.isFinite(value) -> boolean
  - Returns true only if typeof value == 'number' and is finite. Do not accept numeric strings.
- Polyfill guidance: implement the same type-first checks to avoid accepting non-number types.

1.5 RangeError constructor and exact messages
- Signature: new RangeError(message?: string) -> RangeError instance
- Canonical messages (use these exact strings in throws):
  - 'n must be finite'
  - 'n must be an integer'
  - 'n must be >= 1'
  - 'n must be <= ' + MAX_N
- Instances must preserve name === 'RangeError' and instanceof RangeError === true.

1.6 NPM package integration checklist for fizzbuzz
- Install commands:
  - npm install --save fizzbuzz
  - yarn add fizzbuzz
  - For reproducible CI installs: npm ci (requires package-lock.json) or yarn install --frozen-lockfile
- Pin exact version for deterministic CI: npm install --save fizzbuzz@<version>
- Inspect package metadata before use: npm view fizzbuzz --json to retrieve package.json fields (versions, main/module, types, exports, bin).
- Verify package contents by downloading tarball: npm pack fizzbuzz@<version> then inspect the extracted files.
- Use npm audit or CI security scanners to check for advisories.

1.7 Vitest essential setup and CLI usage
- Installation: npm install -D vitest and optional coverage provider npm install -D @vitest/coverage-v8
- CLI modes:
  - Default watch mode: vitest
  - Single run: vitest --run
  - Coverage: vitest --run --coverage
  - Custom config: vitest --config path/to/config
- Config file pattern: export default defineConfig({ test: { include, exclude, environment, globals, threads, setupFiles, coverage } }) with supported extensions .js .mjs .cjs .ts .cts .mts.
- Test API: import { describe, it, test, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'.

2. Supplementary details and implementation knobs
- Performance: generating an array of length n is O(n) time and O(n) memory; for very large n prefer streaming or generator APIs rather than returning a materialised array.
- Output mode option: provide a mode flag outputMode: 'number' | 'string' to return non-Fizz values as numbers or as their decimal string representation; default: number.
- API ergonomics: include an optional options object param for MAX_N override and outputMode, e.g., fizzBuzz(n, { maxN: 10000000, outputMode: 'number' }). Validate options separately and throw TypeError for wrong option types.
- Testing knobs: include deterministic seeds only if extending to randomized behavior; keep core algorithm pure and deterministic for unit tests.

3. Reference details (exact API signatures, messages, configs)
- Primary function signature (ESM): export function fizzBuzz(n: number): Array<string | number>
  - Parameters: n (required) - integer upper bound, inclusive start at 1
  - Returns: Array of length n where index (i-1) corresponds to integer i
- Alternate signature with options: export function fizzBuzz(n: number, options?: { maxN?: number, outputMode?: 'number' | 'string' }): Array<string | number>
- Exact validation and throws (implement verbatim):
  - if (!Number.isFinite(n)) throw new RangeError('n must be finite')
  - if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
  - if (n < 1) throw new RangeError('n must be >= 1')
  - const MAX_N = options?.maxN ?? 10000000; if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)
- Example module export patterns:
  - ESM only package.json: { "type": "module", "exports": {"./": "./src/"}, "main": "dist/index.js" }
  - Dual package: provide module field for ESM and main for CJS or use conditional exports for both.
- Vitest config minimal example keys:
  - test.include: ['tests/unit/*.test.js']
  - test.environment: 'node' or 'jsdom'
  - test.coverage.provider: 'v8' when using @vitest/coverage-v8

4. Detailed digest
- Source list (from SOURCES.md) and retrieval date: 2026-03-08
  - https://en.wikipedia.org/wiki/Fizz_buzz
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - https://www.npmjs.com/package/fizzbuzz
  - https://vitest.dev/guide/
- Excerpted technical points captured above were normalised from these sources on 2026-03-08 and encoded into this document for direct implementation use.

5. Attribution and crawl data size
- Attribution: content consolidated from the URLs listed in the digest above; see each provider for original copyright and licensing terms (Wikipedia, MDN, npm, Vitest project).
- Crawl data size: SOURCES.md read from repository, byte size 591 bytes, 13 lines (retrieved 2026-03-08).

Notes
- This document is implementation-focused; copy verbatim the validation error messages and API signatures into code to ensure compatibility with existing tests and consumers.
- If adding a generator or streaming API, maintain the same divisibility mapping and exact Fizz/FizzBuzz/Buzz strings.
