IMPLEMENTATION_GUIDE

Table of contents
1. Normalised extract: core implementation points
  1.1 Function signature and return contract
  1.2 Input validation: exact checks and messages
  1.3 Core mapping algorithm and priority rules
  1.4 Memory and generator variants
2. Supplementary details: constants, packaging, and module rules
  2.1 MAX_N and memory safety
  2.2 Module resolution and package.json type
  2.3 NPM installation and verification
  2.4 Vitest commands and configuration
3. Reference details: explicit APIs, signatures, commands, config values, and patterns
  3.1 fizzBuzz API signature and return type
  3.2 Error types and exact messages
  3.3 Number.isInteger and Number.isFinite semantics
  3.4 Package.json fields and engine constraints
  3.5 CLI and test commands for CI
  3.6 Troubleshooting steps and test cases
4. Detailed digest: SOURCES.md extract and retrieval date
5. Attribution and crawl size

1. Normalised extract: core implementation points

1.1 Function signature and return contract
- Function declaration: fizzBuzz(n: number) -> Array<string | number>
- Contract: Return an array of length n where array[i-1] corresponds to integer i for i in 1..n.
- Allowed element values: exact ASCII strings Fizz, Buzz, FizzBuzz, or the native Number i for non-matching positions.
- Deterministic ordering: index 0 == 1, index n-1 == n.

1.2 Input validation: exact checks and messages
- Validation sequence (must be applied in this exact order):
  1) typeof n === 'number' otherwise throw new TypeError('n must be a number')
  2) Number.isFinite(n) === true otherwise throw new RangeError('n must be finite')
  3) Number.isInteger(n) === true otherwise throw new RangeError('n must be an integer')
  4) n >= 1 otherwise throw new RangeError('n must be >= 1')
  5) n <= MAX_N otherwise throw new RangeError('n must be <= ' + MAX_N)
- Message conventions: short, machine-parseable messages starting with parameter name and constraint exactly as shown.

1.3 Core mapping algorithm and priority rules
- For each i from 1 to n inclusive, apply in this exact priority:
  a) if (i % 15) === 0 then output 'FizzBuzz'
  b) else if (i % 3) === 0 then output 'Fizz'
  c) else if (i % 5) === 0 then output 'Buzz'
  d) else output the numeric value i (Number type)
- The check for 15 first enforces combined multiples precedence so that 15 -> FizzBuzz, not Fizz or Buzz.

1.4 Memory and generator variants
- Eager array builder: allocate new Array(n) and assign output[i-1] = value for throughput and predictable memory.
- Generator form: function* fizzBuzzGenerator(n) yields values in sequence; still must validate n at call time to the same constraints; useful to avoid allocating O(n) memory when n large.
- Streaming: pipe generator to consumer with backpressure to handle very large n; maintain same value types and ordering invariants.

2. Supplementary details: constants, packaging, and module rules

2.1 MAX_N and memory safety
- Recommended constant: export const MAX_N = 10000000 (10 million) as a default guard.
- Rationale: prevents excessive memory allocation by eager implementations; libraries may choose lower limits based on environment.
- Behavior: If n > MAX_N throw RangeError('n must be <= ' + MAX_N).

2.2 Module resolution and package.json type
- package.json "type" field controls .js interpretation: "module" -> .js as ESM; absent or "commonjs" -> .js as CommonJS.
- Use .mjs to always be ESM or .cjs to always be CommonJS when unambiguous behavior required.
- Exports: set "exports" in package.json to control entrypoints for import and require consumers; include both import and require subpaths if publishing both ESM and CJS.

2.3 NPM installation and verification
- Install as dependency: npm install --save fizzbuzz or yarn add fizzbuzz
- For reproducible CI installs use lockfile-driven install: npm ci or yarn install --frozen-lockfile
- Inspect package metadata before use: npm view fizzbuzz --json to retrieve package.json fields (main/module/types/bin/exports)
- Verify tarball: npm pack --dry-run or download the tarball and inspect package contents before use.

2.4 Vitest commands and configuration
- Install dev dependency: npm install -D vitest
- Run unit tests in CI: npm run test or vitest --run tests/unit/*.test.js
- Collection patterns: test files named *.test.* or *.spec.* are discovered by default; configure environment (node/jsdom) as needed in vitest.config.js.

3. Reference details: explicit APIs, signatures, commands, config values, and patterns

3.1 fizzBuzz API signature and return type
- Signature (explicit): fizzBuzz(n: number): Array<string | number>
- Return invariants: length === n; element types limited to 'Fizz'|'Buzz'|'FizzBuzz'|Number.
- Generator signature: function* fizzBuzzGenerator(n: number): Generator<string | number, void, unknown>

3.2 Error types and exact messages
- TypeError: thrown when typeof n !== 'number' with message exactly: "n must be a number".
- RangeError cases and exact messages:
  - Number.isFinite(n) === false -> "n must be finite"
  - Number.isInteger(n) === false -> "n must be an integer"
  - n < 1 -> "n must be >= 1"
  - n > MAX_N -> "n must be <= " + MAX_N
- Use RangeError only for numeric value-domain violations; use TypeError for wrong types.

3.3 Number.isInteger and Number.isFinite semantics
- Number.isInteger(value) returns true iff Type(value) is Number, value is finite, and value has zero fractional component.
- Number.isFinite(value) returns true iff Type(value) is Number and not NaN, +Infinity or -Infinity.

3.4 package.json fields and engine constraints
- Ensure package.json includes: "main" (CJS entry) and/or "module" (ESM entry) and/or "exports" mappings for robust resolution.
- Engines constraint example to match repo: "engines": { "node": ">=24.0.0" }

3.5 CLI and test commands for CI
- Install reproducibly: npm ci
- Run unit tests: npm run test  (maps to vitest --run tests/unit/*.test.js)
- Run coverage: npm run test:unit  (vitest with --coverage)
- Build web docs: npm run build:web

3.6 Troubleshooting steps and test cases
- Deterministic test cases to validate mapping:
  - fizzBuzz(1) -> [1]
  - fizzBuzz(3) -> [1, 2, 'Fizz']
  - fizzBuzz(5) -> [1, 2, 'Fizz', 4, 'Buzz']
  - fizzBuzz(15) -> last element at index 14 must be 'FizzBuzz' and checks for earlier positions as above
- If tests fail with type errors, assert input is validated in the exact specified order and throw expected messages.
- Memory failures: if allocation O(n) fails for large n, ensure generator variant is available and MAX_N is enforced.

4. Detailed digest: SOURCES.md extract and retrieval date
- Sources consulted (as listed in SOURCES.md):
  - https://en.wikipedia.org/wiki/Fizz_buzz  (canonical algorithm and pseudocode)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (module types and resolution)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (Number.isInteger semantics)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (RangeError usage)
  - https://www.npmjs.com/package/fizzbuzz  (npm package metadata and integration patterns)
  - https://vitest.dev/guide/  (Vitest installation, discovery, and CI usage)
- Retrieval date: 2026-03-08
- Extract summary: consolidated exact API signatures, validation ordering, exact error messages, module/package rules, install and CI commands, and test discovery patterns.

5. Attribution and crawl size
- Attribution: Content extracted and normalized from the URLs listed above.
- Sources retrieved: 6 URLs
- Approximate raw crawl data size: ~12 KB (aggregate of retrieved pages and metadata lines used to create this extract)

End of IMPLEMENTATION_GUIDE
