SOURCE_EXTRACT

Table of contents
1. Normalised extract
  1.1 FizzBuzz algorithm and deterministic contract
  1.2 Input validation and canonical error semantics (exact checks and messages)
  1.3 API signature and return types
  1.4 Module type resolution rules
2. Supplementary details
  2.1 Constants and configuration
  2.2 Installation and runtime commands
  2.3 Testing and CI commands
3. Reference details
  3.1 Exact function and language API signatures
  3.2 Exact validation logic and RangeError messages (executable pattern)
  3.3 package.json "type" and file-extension semantics
  3.4 Vitest CLI and config options (exact strings)
4. Detailed digest
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz algorithm and deterministic contract
- For each integer i in the inclusive integer sequence 1..n produce an element at result index (i-1).
- Mapping (apply in this exact priority order):
  - If i % 15 === 0 then element = the exact string FizzBuzz
  - Else if i % 3 === 0 then element = the exact string Fizz
  - Else if i % 5 === 0 then element = the exact string Buzz
  - Else element = the integer i (a JavaScript Number value)
- Contract rules that MUST be satisfied by implementations:
  - Returned array length MUST equal n.
  - Element ordering MUST correspond to integers 1..n.
  - Elements representing non-Fizz/Buzz results MUST be Number typed values (not strings).

1.2 Input validation and canonical error semantics (exact checks and messages)
- Perform checks in the following exact order and throw RangeError with the precise message shown when a check fails:
  1. If Number.isFinite(n) === false then throw new RangeError('n must be finite')
  2. If Number.isInteger(n) === false then throw new RangeError('n must be an integer')
  3. If n < 1 then throw new RangeError('n must be >= 1')
  4. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)
- Use RangeError exclusively for numeric domain/type violations; do not use TypeError for these numeric range checks.

1.3 API signature and return types
- Primary exported function (programmatic API):
  - Signature: export function fizzBuzz(n: number): Array<string | number>
  - Behavior: returns an Array of length n where index (i-1) corresponds to integer i in 1..n and each element follows the mapping in 1.1.
- CLI entry (if provided by package): check package.json "bin" or "main" fields; prefer programmatic import when embedding in libraries.

1.4 Module type resolution rules (concise actionable rules)
- package.json "type" accepts two meaningful values: "module" or "commonjs".
  - When "type": "module" is present at or above package root, files with .js extension are parsed as ESM.
  - When "type" is absent or set to "commonjs", .js files are parsed as CommonJS.
  - File extensions override package type: .mjs is always ESM; .cjs is always CommonJS.
- Effect: import/export syntax, live bindings, and top-level await semantics follow ESM when ESM resolution is in effect.

2. Supplementary details

2.1 Constants and configuration
- Recommended MAX_N constant used in validations: const MAX_N = 10000000
- Node engines in package.json (example from repository): "engines": { "node": ">=24.0.0" }

2.2 Installation and runtime commands (exact strings)
- Install package as dependency: npm install --save fizzbuzz
- Install as devDependency: npm install --save-dev fizzbuzz
- Pin exact version: npm install --save fizzbuzz@1.2.3
- Reproducible CI install: npm ci
- Run CLI (example project script): npm run start:cli  (resolves to node src/lib/main.js in this repo)

2.3 Testing and CI commands
- Run unit tests (repo scripts): npm test  (expands to vitest --run tests/unit/*.test.js)
- Run unit tests with coverage: npm run test:unit  (expands to vitest --run --coverage tests/unit/*.test.js)
- Build web docs as used by this repo: npm run build:web
- E2E behaviour test script: npm run test:behaviour (runs build:web then playwright test)

3. Reference details

3.1 Exact function and language API signatures
- Number.isInteger(value) -> boolean
- Number.isFinite(value) -> boolean
- RangeError constructor: new RangeError(message?: string) -> RangeError
- Exported fizzBuzz signature: export function fizzBuzz(n: number): Array<string | number>

3.2 Exact validation logic and RangeError messages (executable pattern)
- Validation pseudocode (apply in order):
  if (!Number.isFinite(n)) throw new RangeError('n must be finite')
  if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
  if (n < 1) throw new RangeError('n must be >= 1')
  if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)
- Use the messages exactly as shown for automated tests that match messages verbatim.

3.3 package.json "type" and file-extension semantics (exact values and effects)
- "type": "module" -> .js files parsed as ESM
- "type": "commonjs" or absent -> .js files parsed as CommonJS
- .mjs -> ESM always
- .cjs -> CommonJS always
- "main" and "exports" fields determine entry points for require/import; bare specifiers require package resolution or bundler support.

3.4 Vitest CLI and config options (exact strings to use)
- CLI single-run: vitest --run
- Run specific tests: vitest --run tests/unit/*.test.js
- Coverage provider flag (example via npm script): vitest --run --coverage
- Example config export (file types supported: .js, .mjs, .cjs, .ts):
  export default defineConfig({ test: { include: ['tests/unit/*.test.js'], environment: 'node', threads: false, setupFiles: [], coverage: { provider: '@vitest/coverage-v8' } } })
- Test API surface to import: { describe, it, test, expect, beforeAll, afterAll, beforeEach, afterEach, vi }

4. Detailed digest
- Sources referenced (retrieved 2026-03-08):
  - https://en.wikipedia.org/wiki/Fizz_buzz
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - https://www.npmjs.com/package/fizzbuzz
  - https://vitest.dev/guide/
- Retrieval date: 2026-03-08
- Crawl data: SOURCES.md contained 6 URLs and 13 lines in-repo; aggregated actionable extracts above were derived from those source references as of retrieval date.

5. Attribution and crawl data size
- Attribution: content extracted from the six source URLs listed in section 4 (Wikipedia, MDN modules, MDN Number.isInteger, MDN RangeError, npm fizzbuzz package page, Vitest guide).
- Data obtained during local crawl: 6 source URLs, SOURCES.md (13 lines). The library extracts stored here are concise, implementation-ready rules and exact strings intended for direct use in code, tests, and CI.
