FIZZBUZZ_SPEC

Table of contents
1. Normalised extract
  1.1 Function signature and exact mapping rules
  1.2 Input validation sequence and exact thrown errors/messages
  1.3 Return contract and invariants
2. Supplementary details
  2.1 Packaging and module layout (package.json keys and effects)
  2.2 NPM integration and install/inspect commands
  2.3 Testing and Vitest minimal configuration
3. Reference details
  3.1 Exact API signatures, parameter types and returns
  3.2 Error constructors and message strings
  3.3 package.json fields with exact accepted values and effects
  3.4 Vitest CLI flags and config keys used in CI
4. Detailed digest and retrieval metadata
5. Attribution and crawl size

1. Normalised extract

1.1 Function signature and exact mapping rules
Function signature:
- fizzBuzz(n: number) -> Array<string | number>

Per-integer mapping (apply in this exact priority order for each integer i from 1..n):
- If i % 15 == 0 then output the exact string FizzBuzz
- Else if i % 3 == 0 then output the exact string Fizz
- Else if i % 5 == 0 then output the exact string Buzz
- Else output the integer i as a native Number value

1.2 Input validation sequence and exact thrown errors/messages
Perform validation in this exact order and throw the specified error types/messages:
1. Type check:
   - If typeof n !== 'number' then throw new TypeError('n must be a number')
2. Finite numeric check:
   - If Number.isNaN(n) || !Number.isFinite(n) then throw new RangeError('n must be finite')
3. Integer check:
   - If !Number.isInteger(n) then throw new RangeError('n must be an integer')
4. Lower bound check:
   - If n < 1 then throw new RangeError('n must be >= 1')
5. Upper bound check (implementation bound):
   - If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)

Notes:
- Use TypeError only for non-number types; use RangeError for numeric domain violations.
- Exact message strings above are required for deterministic tests and machine parsing.

1.3 Return contract and invariants
- Returned array length MUST equal n.
- returnedArray[i - 1] MUST correspond to integer i for 1 <= i <= n.
- Non-Fizz/Buzz/FizzBuzz entries MUST be Numbers (not strings).
- Time complexity: O(n); Space complexity for eager variant: O(n). A generator/lazy API may be provided as an alternative.

2. Supplementary details

2.1 Packaging and module layout (package.json keys and effects)
- package.json "type" field semantics:
  - "type": "module" => .js files are parsed as ESM. Without this field .js is CommonJS.
  - Use .mjs for ESM and .cjs for CommonJS to explicitly set file-level module type.
- Entry point fields and consumer resolution:
  - "main": legacy CJS entry path (string).
  - "module": conventional ESM entry path for bundlers (string; not used by Node resolver).
  - "exports": object mapping subpath specifiers to file paths; when present, it restricts which internal files can be imported by consumers.
- Interop strategy:
  - If offering native ESM API (export function fizzBuzz), set "type":"module" and provide named exports.
  - If supporting CJS consumers, provide a .cjs bridge file or an exports map that provides both CJS and ESM entry points.

2.2 NPM integration and install/inspect commands
- Install:
  - npm install --save fizzbuzz
  - npm install --save-dev fizzbuzz (if only dev/cli usage)
  - npm ci for CI reproducible installs (requires package-lock.json)
  - Pin exact version: npm install --save fizzbuzz@1.2.3
- Inspect package before use:
  - npm view fizzbuzz --json  (inspect package.json fields)
  - Download and inspect tarball if needed to verify contents
- Security and CI best practice:
  - Run npm audit; pin versions in CI; use lockfile-driven installs; avoid installing unpinned transient dependencies.

2.3 Testing and Vitest minimal configuration
- Recommended package.json scripts:
  - "test": "vitest"  (interactive/watch)
  - "test:run": "vitest run"  (single-run for CI)
  - "coverage": "vitest run --coverage"
- Minimal vitest config items relevant to unit tests:
  - test.include: ['tests/unit/*.test.js'] or use defaults (*.test.* or *.spec.*)
  - test.environment: 'node' for pure algorithm tests
  - test.setupFiles: [] if no global setup required
- CI invocation:
  - npm ci && npm run test:run
- Disable interactive auto-install checks in CI with environment variable:
  - VITEST_SKIP_INSTALL_CHECKS=1

3. Reference details

3.1 Exact API signatures, parameter types and returns
- fizzBuzz(n: number) -> Array<string | number>
  - Parameter: n (number)
  - Returns: Array where elements are exactly: 'Fizz', 'Buzz', 'FizzBuzz' (strings) or the integer (Number)
  - Side effects: none

3.2 Error constructors and message strings
- TypeError('n must be a number')
- RangeError('n must be finite')
- RangeError('n must be an integer')
- RangeError('n must be >= 1')
- RangeError('n must be <= ' + MAX_N)
- Use these exact messages for deterministic assertions in tests.

3.3 package.json fields with exact accepted values and effects
- "type": "module" | "commonjs"  (affects .js parsing semantics)
- "main": string (legacy CJS entry)
- "module": string (convention for bundlers to point to ESM entry)
- "exports": object mapping specifier subpaths (e.g., ".": "./lib/index.js", "./cjs": "./lib/index.cjs")
- Node resolution: bare specifiers resolve via node_modules and package.json exports/main; relative specifiers require explicit extensions for browser ESM

3.4 Vitest CLI flags and config keys used in CI
- vitest run  -> run tests once (non-watch)
- vitest run --coverage  -> run with coverage collection
- --config <path>  -> specify config file path
- Environment variable: VITEST_SKIP_INSTALL_CHECKS=1  disables interactive install prompts

4. Detailed digest and retrieval metadata
- Sources extracted (from repository SOURCES.md):
  - https://en.wikipedia.org/wiki/Fizz_buzz
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - https://www.npmjs.com/package/fizzbuzz
  - https://vitest.dev/guide/
- Retrieval date (this document): 2026-03-08T21:02:12.819Z
- Crawl extraction notes: distilled canonical algorithm rules (Wikipedia/MDN), JS module packaging semantics (MDN), Number.isInteger and RangeError exact semantics (MDN), npm package integration patterns (npmjs), and Vitest configuration/CLI patterns (vitest.dev).

5. Attribution and crawl size
- Attribution: Content extracted from the URLs listed above as recorded in repository SOURCES.md.
- Estimated extracted data size across sources: approximately 60 KB (aggregate of distilled extracts: Vitest ~13 KB, JS Modules ~12 KB, combined MDN and Wikipedia sections ~20 KB, npm package metadata and other extracts ~15 KB).

[END OF FIZZBUZZ_SPEC]
