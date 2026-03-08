CRAWL_DIGEST

Table of contents
1. Normalised extract
  1.1 FizzBuzz algorithm and deterministic contract
  1.2 Input validation and canonical error semantics (exact checks and messages)
  1.3 API signature and return types
  1.4 JavaScript module resolution and module-type effects
  1.5 Number.isInteger / Number.isFinite exact semantics
  1.6 RangeError constructor, identity and exact messages
  1.7 NPM package handling for fizzbuzz (install, inspect, pin)
  1.8 Vitest commands, config and usage for CI
2. Supplementary details (implementation knobs and constants)
3. Reference details (exact API signatures, method parameters, return types, config snippets)
4. Detailed digest (sources and retrieval metadata)
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz algorithm and deterministic contract
- For each integer i in the inclusive integer range 1..n produce an element at result index (i-1).
- Mapping (apply in this exact priority order):
  - If i % 15 === 0 then element = the exact string FizzBuzz
  - Else if i % 3 === 0 then element = the exact string Fizz
  - Else if i % 5 === 0 then element = the exact string Buzz
  - Else element = the integer i (JavaScript Number when API declares Array<string | number>)
- Contract rules that implementations MUST satisfy:
  - Returned array length MUST equal n.
  - Element ordering MUST correspond to integers 1..n.
  - Elements that are not Fizz/Buzz/FizzBuzz MUST be Number typed values (not strings).

1.2 Input validation and canonical error semantics (exact checks and messages)
- Perform checks in the following order and throw RangeError with the exact message shown when a check fails:
  1. If Number.isFinite(n) === false then throw new RangeError('n must be finite')
  2. If Number.isInteger(n) === false then throw new RangeError('n must be an integer')
  3. If n < 1 then throw new RangeError('n must be >= 1')
  4. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)
- Use RangeError exclusively for numeric domain/type violations as above; do not use TypeError for these numeric checks.

1.3 API signature and return types
- Primary exported function signature (ESM style):
  - export function fizzBuzz(n: number): Array<string | number>
- Behavior: Accepts a single numeric parameter n; returns an array of length n where each index maps to integer 1..n via the mapping in 1.1.
- Implementations may also expose a CLI entry in package.json "bin" if providing a command-line tool, but the functional API must match the signature above.

1.4 JavaScript module resolution and module-type effects
- package.json field "type":
  - "module" -> .js files are ESM; "commonjs" or absent -> .js files are CommonJS. File extensions override: .mjs always ESM, .cjs always CommonJS.
- Exports and imports:
  - Export forms: named exports (export const name), default (export default ...), re-exports (export * from './x').
  - Import forms: static imports (import {x} from './x.js'), namespace imports (import * as ns from './x.js'), default imports, and dynamic import(expression) -> Promise resolving to module namespace.
- Resolution rules: relative specifiers resolve to files (extension resolution rules apply); bare specifiers resolve using node_modules package resolution and package.json "exports"/"main".

1.5 Number.isInteger / Number.isFinite exact semantics
- Number.isInteger(value) -> boolean
  - Returns true iff typeof value === 'number', value is finite (not NaN or ±Infinity), and value has no fractional component.
  - Returns false for non-number types, NaN, ±Infinity, and numbers with fractional components.
- Number.isFinite(value) -> boolean
  - Returns true iff typeof value === 'number' and is finite (not NaN or ±Infinity).

1.6 RangeError constructor, identity and exact messages
- Constructor signature: new RangeError(message?: string) -> RangeError
- Properties: name === 'RangeError'; instanceof RangeError === true; instanceof Error === true; message is the provided string or ''
- Canonical messages for this mission (must be used verbatim by validation logic):
  - 'n must be finite'
  - 'n must be an integer'
  - 'n must be >= 1'
  - 'n must be <= ' + MAX_N

1.7 NPM package handling for fizzbuzz (install, inspect, pin)
- Install commands:
  - npm install --save fizzbuzz
  - yarn add fizzbuzz
  - dev-only: npm install --save-dev fizzbuzz
- Reproducible CI installs: use lockfile-driven installs (npm ci) or yarn install --frozen-lockfile
- Pin exact version: npm install --save fizzbuzz@<X.Y.Z>
- Inspect package metadata: npm view fizzbuzz --json (returns package.json fields including main/module/bin/exports/types)
- Verify tarball: npm pack fizzbuzz@<version> then inspect contents of produced tarball

1.8 Vitest commands, config and usage for CI
- Installation: npm install --save-dev vitest and an optional coverage provider (e.g., @vitest/coverage-v8)
- Common CLI usage: vitest --run (single run), vitest (watch mode), vitest --run --coverage
- Package.json scripts examples: "test": "vitest --run tests/unit/*.test.js"; "test:unit": "vitest --run --coverage tests/unit/*.test.js"
- Config snippet (ESM):
  - import { defineConfig } from 'vitest/config'
    export default defineConfig({ test: { include: ['tests/unit/*.test.js'], environment: 'node', coverage: { provider: 'v8' } } })
- Test API surface: import { describe, it, test, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'
- Expect matchers: toBe, toEqual, toStrictEqual, toContain, toMatch, toThrow, resolves/rejects helpers for Promises

2. Supplementary details (implementation knobs and constants)
- Recommended MAX_N constant for public APIs: 10000000 (10,000,000). Implementations may choose a different safe upper bound but MUST use that bound in the thrown message.
- Performance: generating an Array of length n with sequential checks is O(n) time and O(n) memory; for very large MAX_N consider streaming or generator-based APIs for memory-sensitive contexts.
- Export compatibility: provide both ESM named export fizzBuzz and, if supporting CommonJS consumers, a CommonJS default export via module.exports = { fizzBuzz } or an index.cjs wrapper when package type is "module".
- CLI: if providing a CLI, validate argv-parsed n using the same validation path and exit with nonzero status on RangeError, printing the message to stderr.

3. Reference details (exact API signatures, parameters, returns, config snippets and messages)
- API function signature (TypeScript-style):
  - export function fizzBuzz(n: number): Array<string | number>
  - Parameters: n (required) - finite integer, 1 <= n <= MAX_N
  - Returns: Array of length n; elements are either the exact strings 'Fizz', 'Buzz', 'FizzBuzz' or the Number value for non-multiples of 3/5.
- Validation pseudocode (order of checks and exact messages):
  - if (!Number.isFinite(n)) throw new RangeError('n must be finite')
  - if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
  - if (n < 1) throw new RangeError('n must be >= 1')
  - if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)
- RangeError constructor: new RangeError(message?: string) -> RangeError
- package.json type impact: "type": "module" -> .js ESM; omit or "commonjs" -> .js CJS. .mjs always ESM; .cjs always CJS.
- Vitest config example (ESM file):
  - import { defineConfig } from 'vitest/config'
    export default defineConfig({ test: { include: ['tests/unit/*.test.js'], environment: 'node' } })
- NPM commands (exact):
  - npm install --save fizzbuzz
  - npm ci (CI reproducible install; requires package-lock.json)
  - npm view fizzbuzz --json
  - npm pack fizzbuzz@<version>

4. Detailed digest (sources and retrieval metadata)
- Source list used to construct this digest (as listed in repository SOURCES.md):
  - https://en.wikipedia.org/wiki/Fizz_buzz
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - https://www.npmjs.com/package/fizzbuzz
  - https://vitest.dev/guide/
- Retrieval date used for this digest: 2026-03-08
- Crawl note: content was consolidated from local repository extracts derived from the listed sources; implementation details above are verbatim where the source specified exact messages, signatures or command lines.

5. Attribution and crawl data size
- Attribution: extracts and technical specifics derived from the listed URLs (Wikipedia Fizz_buzz, MDN JavaScript modules, MDN Number.isInteger, MDN RangeError, npm fizzbuzz package page, Vitest guide).
- Number of distinct sources processed: 6
- Data size obtained during crawling: 12 KB (consolidated extract size from repository source excerpts)

End of CRRAWL_DIGEST
