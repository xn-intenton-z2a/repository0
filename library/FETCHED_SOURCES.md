FETCHED_SOURCES

Table of contents
1. Normalised extract
   1.1 FizzBuzz algorithm and deterministic contract
   1.2 JavaScript modules (module type, resolution, import maps)
   1.3 Number.isInteger (signature and exact behavior)
   1.4 RangeError (constructor, when to throw, message conventions)
   1.5 Vitest (install, CLI, config, discovery)
   1.6 NPM package inspection (fizzbuzz package notes)
2. Supplementary details and implementation knobs
3. Reference details (API signatures, method parameters, return types, config options)
4. Detailed digest (sources, retrieval date: 2026-03-08)
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz algorithm and deterministic contract
- For each integer i in the inclusive range 1..n produce result at index (i-1).
- Output mapping (apply in this order): if i % 15 === 0 -> exact string FizzBuzz; else if i % 3 === 0 -> exact string Fizz; else if i % 5 === 0 -> exact string Buzz; else -> the integer i (type: Number).
- Contract requirements: returned array length MUST equal n; element ordering MUST map 1..n; non-Fizz/Buzz entries MUST be JavaScript Number values when typed as Array<string | number>.

1.2 JavaScript modules (module type, resolution, import maps)
- package.json "type" field: "module" makes .js files ESM; absent or "commonjs" treats .js as CommonJS; .mjs is always ESM; .cjs is always CommonJS.
- Resolution: relative/absolute specifiers resolve to path + extension rules; bare specifiers resolve via package resolution using node_modules, package.json exports/main, or require bundler/import map.
- Export forms: named exports (export const name), default exports (export default ...), aggregated exports (export {a, b}), re-exports (export * from "...").
- Import forms: static imports (import {a} from "./foo.js"), namespace imports (import * as ns from "./foo.js"), default imports (import def from "./mod.js"), dynamic import(expression) returns a Promise resolving to module namespace.
- Import maps: JSON object with imports and scopes keys; imports remap bare specifiers and scopes allow path-specific remaps; keys without trailing slash match whole specifier; keys with trailing slash act as prefix remaps; longest-match wins.
- MIME & server: servers must serve JS modules with JavaScript MIME type (e.g., text/javascript); .mjs may require correct server config.

1.3 Number.isInteger (signature and exact behavior)
- Signature: Number.isInteger(value) -> boolean
- Behavior: returns true only if Type(value) is Number, value is finite, and the mathematical value has no fractional component; returns false for NaN, +Infinity, -Infinity and non-number types.
- Edge cases: IEEE-754 precision means some fractional literals may be represented as integers (e.g., 5.0000000000000001 represented as 5) and will return true; values beyond Number.MAX_SAFE_INTEGER can lose integer semantics but isInteger may still return true if representable exactly.

1.4 RangeError (constructor, when to throw, message conventions)
- Constructor: new RangeError(message?: string) -> RangeError instance; RangeError.prototype.name === "RangeError"; instanceof RangeError === true.
- Canonical uses: numeric value out-of-domain violations (non-finite numbers, non-integer when integer required, lower/upper bound violations), illegal array length, or other API-specific range constraints.
- Recommended validation order and messages for numeric parameter n:
  1) If Number.isFinite(n) === false -> throw new RangeError('n must be finite')
  2) If Number.isInteger(n) === false -> throw new RangeError('n must be an integer')
  3) If n < 1 -> throw new RangeError('n must be >= 1')
  4) If n > MAX_N -> throw new RangeError('n must be <= ' + MAX_N) where MAX_N is an implementation-chosen bound (recommendation: 10000000).
- Message convention: short, machine-parseable messages starting with the parameter name then constraint.

1.5 Vitest (install, CLI, config, discovery)
- Install: npm install -D vitest or yarn add -D vitest; Vitest requires Vite >= 6 and Node >= 20.
- CLI: vitest (watch mode default), vitest run (--run) for single-run; --coverage to collect coverage; pass --config <file> to point to custom config.
- Config: export default defineConfig({ test: { include, exclude, environment, globals, threads, setupFiles, coverage } }) from 'vitest/config'; supported config file extensions: .js, .mjs, .cjs, .ts, .cts, .mts.
- Discovery: test files must include .test. or .spec. by default; test.include controls file discovery; use package.json scripts for CI: "test": "vitest --run".
- API: import { describe, it, test, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'.

1.6 NPM package inspection (fizzbuzz package notes)
- Package exists as npm package named fizzbuzz; integrate via standard npm workflows. Inspect metadata before use with: npm view fizzbuzz --json to obtain package.json fields including versions, main/module/types, and bin entries.
- Install reproducibly in CI with lockfile-driven installs: npm ci or yarn install --frozen-lockfile; pin exact version with npm install --save fizzbuzz@1.2.3.
- If direct fetch of npm registry metadata is blocked, use local npm client (npm view) or fetch the tarball via npm pack and inspect package contents.

2. Supplementary details and implementation knobs
- FizzBuzz performance: O(n) time, O(n) memory for array-return variant. For streaming output use generator or callback to avoid O(n) memory.
- MAX_N: choose an upper bound consistent with expected environment; recommended 10_000_000 for public APIs but adapt to memory/time constraints; throw RangeError if exceeded.
- Output typing mode: choose between Array<string | number> (numeric entries as Number) or Array<string> (always string) and document type; prefer mixed typing with explicit typing in TypeScript declarations.
- Module packaging: provide both ESM and CJS entry points when publishing: "exports" map and conditional exports in package.json; include "types" field for TypeScript definitions.
- Test patterns: use Vitest with deterministic test inputs, cover validation error messages, and include performance tests for large n if MAX_N is enforced.

3. Reference details (API signatures, method parameters, return types, config options)
- FizzBuzz function (recommended public signature):
  - Signature: export function fizzBuzz(n: number): Array<string | number>
  - Parameters: n (required) — integer, inclusive upper bound of sequence starting at 1.
  - Returns: Array with length === n where element at index i-1 corresponds to integer i and is either 'Fizz', 'Buzz', 'FizzBuzz', or the Number i.
- Number.isInteger:
  - Signature: Number.isInteger(value) -> boolean
  - Behavior as in 1.3 above.
- RangeError:
  - Signature: new RangeError(message?: string) -> RangeError
  - Use for numeric range violations; messages: 'n must be finite', 'n must be an integer', 'n must be >= 1', 'n must be <= ' + MAX_N.
- Vitest config snippet:
  - export default defineConfig({ test: { include: ['tests/unit/*.test.js'], environment: 'node', globals: true, coverage: { provider: '@vitest/coverage-v8' } } })
- package.json publish packaging (minimal fields):
  - "type": "module"
  - "main": "dist/index.cjs.js" (CJS entry)
  - "module": "dist/index.esm.js" (ESM entry)
  - "exports": { ".": { "import": "dist/index.esm.js", "require": "dist/index.cjs.js" } }
  - "types": "dist/index.d.ts"

4. Detailed digest (sources and retrieval metadata)
- Sources queried and retrieval date: 2026-03-08
  - https://en.wikipedia.org/wiki/Fizz_buzz — fetched content describing FizzBuzz rules and common variations; fetch succeeded; content length: small (wiki paragraph-level). Retrieval: 2026-03-08.
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules — fetched (truncated at 20000 characters by fetch limit); contains module types, .mjs vs .js, export/import forms, import maps, resolution, server MIME notes. Retrieval: 2026-03-08; content truncated at tool limit (20000 chars).
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger — fetched; includes syntax, parameter, return value, description, edge cases, and examples. Retrieval: 2026-03-08.
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError — fetched; includes constructor, description, examples of when to throw, and link to ECMAScript spec. Retrieval: 2026-03-08.
  - https://www.npmjs.com/package/fizzbuzz — registry fetch returned HTTP 403 from tool; recommend using local npm client (npm view) or npm pack for inspection. Retrieval attempt: 2026-03-08; content not fetched due to registry access policy.
  - https://vitest.dev/guide/ — fetched; contains installation steps, CLI usage, configuration details, project support, and examples. Retrieval: 2026-03-08.

5. Attribution and crawl data size
- Attribution: content extracted from the above listed sources (Wikipedia, MDN, Vitest site, npm registry metadata intent). Retrieval date for all successful fetches: 2026-03-08.
- Data size obtained during crawling: MDN Modules fetch truncated at 20,000 characters; other successful fetches completed within tool limits; npm registry responded 403 so no data obtained for that URL. Exact byte counts unavailable from fetch tool; where precise byte counts are required, run local npm view or curl from an environment with full registry access and record Content-Length.

End of document.
