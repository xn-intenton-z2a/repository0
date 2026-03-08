CRAWL_DIGEST

Table of contents
1. Normalised extract
  1.1 FizzBuzz function signature and exact mapping rules
  1.2 Input validation, error types, and exact messages
  1.3 Output invariants and complexity guarantees
2. Supplementary details
  2.1 Module export and package layout (ESM/CJS)
  2.2 npm installation, verification and CI install commands
  2.3 Vitest discovery and CLI usage for unit tests
3. Reference details
  3.1 API signatures, parameter types, returns
  3.2 Exact implementation pattern for fizzBuzz (loop, checks order)
  3.3 Configuration keys and exact command forms (package.json, vitest)
  3.4 Error messages, exceptions, and handling patterns
  3.5 Troubleshooting steps and deterministic tests
4. Detailed digest (sources and retrieval date)
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz function signature and exact mapping rules
Function signature:
- fizzBuzz(n: number) -> Array<string | number>

Domain and behaviour (apply in this exact priority order for each integer i from 1..n):
- If i % 15 == 0 then output the exact string FizzBuzz
- Else if i % 3 == 0 then output the exact string Fizz
- Else if i % 5 == 0 then output the exact string Buzz
- Else output the integer i as a native Number type

Return contract:
- Returned array length === n
- Index mapping: returnedArray[i - 1] corresponds to integer i
- Non-Fizz/Buzz/FizzBuzz entries are Numbers (not strings)

1.2 Input validation, error types, and exact messages
Validation sequence (perform in this order and throw exactly the specified error types/messages):
1. Type check:
   - If typeof n !== 'number' then throw new TypeError('n must be a number')
2. Finite check:
   - If Number.isNaN(n) || !Number.isFinite(n) then throw new RangeError('n must be finite')
3. Integer check:
   - If !Number.isInteger(n) then throw new RangeError('n must be an integer')
4. Lower bound:
   - If n < 1 then throw new RangeError('n must be >= 1')
5. Upper bound:
   - If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)

Notes:
- Use TypeError only for non-number type mismatches; use RangeError for numeric-domain violations.
- MAX_N is an implementation-chosen hard upper bound to avoid excessive memory/time; recommended default MAX_N = 1000000 (1e6) unless constrained by platform.

1.3 Output invariants and complexity guarantees
- Time complexity: O(n) using a single pass loop from 1 to n.
- Space complexity: O(n) for an eager array of length n; a generator API may be provided to reduce memory to O(1) additional space beyond iteration state.
- Deterministic mapping: identical input must always produce identical output sequence.

2. Supplementary details

2.1 Module export and package layout (ESM/CJS)
- Recommended source export (ESM): export function fizzBuzz(n) { ... }
- package.json: set "type": "module" to treat .js as ESM; use .cjs for CommonJS entrypoints when needed.
- package entry points: provide "main" for CommonJS, and "exports" or "module" for ESM consumers. Example minimal fields to include:
  - "type": "module"
  - "main": "src/lib/fizz.cjs"   (if providing CJS)
  - "exports": {"import": "dist/fizz.mjs","require": "dist/fizz.cjs"}
- When publishing: include "types" for TS declaration files if provided.

2.2 npm installation, verification and CI install commands
- Install in application:
  - npm install --save fizzbuzz
  - yarn add fizzbuzz
- Install for CI reproducible install:
  - npm ci   (requires package-lock.json)
  - yarn install --frozen-lockfile
- Pin exact version when required: npm install --save fizzbuzz@1.2.3
- Inspect package metadata before use: npm view fizzbuzz --json
- Inspect tarball contents: npm pack fizzbuzz@version && tar -tzf fizzbuzz-*.tgz
- Security audit: npm audit --production

2.3 Vitest discovery and CLI usage for unit tests
- Test runner command (project uses vitest): npm test -> vitest --run tests/unit/*.test.js
- Test file naming: files matching *.test.* or *.spec.* (e.g., main.test.js or main.spec.ts) are discovered by default
- Running coverage: npm run test:unit -> vitest --run --coverage tests/unit/*.test.js
- CI recommendation: pin vitest version in devDependencies and run via npm ci then npm test

3. Reference details

3.1 API signatures, parameter types, returns
- fizzBuzz(n: number): Array<string | number>
  - Parameters:
    - n: number (finite integer; 1 <= n <= MAX_N)
  - Returns:
    - Array of length n where each element is either the exact string 'Fizz', 'Buzz', 'FizzBuzz' or the Number value i
- Number.isInteger(value: any): boolean
  - Returns true if typeof value === 'number', value is finite, and has zero fractional component
- new RangeError(message?: string) -> RangeError
  - message: optional string; RangeError.name === 'RangeError'

3.2 Exact implementation pattern for fizzBuzz (loop, checks order)
- Implementation steps:
  1. Validate input using steps in 1.2
  2. Allocate const out = new Array(n) or use Array.from({length: n}, (_, idx) => compute(idx+1))
  3. Use a for loop for performance:
     for (let i = 1; i <= n; ++i) {
       if (i % 15 === 0) out[i-1] = 'FizzBuzz'
       else if (i % 3 === 0) out[i-1] = 'Fizz'
       else if (i % 5 === 0) out[i-1] = 'Buzz'
       else out[i-1] = i
     }
  4. Return out

Performance notes:
- Use modulus checks in the order shown; computing i % 15 is cheaper than nested modulus checks when checking both 3 and 5 divisibility.
- For extremely large n, prefer a generator function:
  - function* fizzBuzzGen(n) { /* same validation */ for (let i=1;i<=n;i++){ yield rule(i) } }

3.3 Configuration keys and exact command forms (package.json, vitest)
- package.json fragment (recommended):
  {
    "type": "module",
    "main": "dist/fizz.cjs",
    "exports": {"import":"dist/fizz.mjs","require":"dist/fizz.cjs"},
    "scripts": {
      "test": "vitest --run tests/unit/*.test.js",
      "test:unit": "vitest --run --coverage tests/unit/*.test.js"
    }
  }
- Vitest CLI flags used in repository:
  - --run : run tests once (non-interactive)
  - --coverage : collect coverage (requires coverage provider in config)
- Node engine constraint recommended in package.json: "engines": {"node": ">=24.0.0"}

3.4 Error messages, exceptions, and handling patterns
- Exact thrown messages used for validation MUST match test expectations and tooling that parses messages.
- Canonical messages (repeat for clarity):
  - TypeError('n must be a number')
  - RangeError('n must be finite')
  - RangeError('n must be an integer')
  - RangeError('n must be >= 1')
  - RangeError('n must be <= ' + MAX_N)

3.5 Troubleshooting steps and deterministic tests
- Unit tests to cover:
  - Valid small n (e.g., n=1..20) matching expected sequence
  - Boundary values: n=1, n=MAX_N, n=MAX_N+1 -> expect RangeError
  - Non-number inputs: '5', null, {} -> expect TypeError('n must be a number')
  - Non-finite numbers: NaN, Infinity -> expect RangeError('n must be finite')
  - Non-integer numbers: 3.14 -> expect RangeError('n must be an integer')
- Troubleshooting flow when tests fail:
  1. Re-run failing test with node --inspect and isolate failing assertion
  2. Log types via typeof and Number.isFinite/Number.isInteger checks to confirm which guard failed
  3. If ordering mismatches (e.g., 'Fizz' vs 'FizzBuzz'), verify modulus order and ensure 15-check precedes 3- and 5-checks
  4. If numeric entries are strings, verify the branch that sets non-matching entries assigns the numeric value i (not String(i))

4. Detailed digest (sources and retrieval date)
- Sources present in project SOURCES.md and used to produce this extract:
  - https://en.wikipedia.org/wiki/Fizz_buzz  (Wikipedia canonical algorithm)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (ESM/CommonJS rules, package.json type)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (Number.isInteger semantics)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (RangeError constructor and usage)
  - https://www.npmjs.com/package/fizzbuzz  (npm packaging and install patterns)
  - https://vitest.dev/guide/  (Vitest CLI, discovery and config)
- Retrieval date: 2026-03-08
- Extracted content: focused implementation-level rules, commands, API signatures, validation messages, and exact configuration snippets used by the project.

5. Attribution and crawl data size
- Attribution: content extracted and normalised from the listed URLs; canonical algorithm from Wikipedia FizzBuzz page; JavaScript runtime and error semantics from MDN; packaging and installation guidance from npm registry page; test runner rules from Vitest docs.
- Sources processed: 6 URLs
- Approximate extracted content size: ~24 KB of normalised technical text (implementation rules, signatures, and commands) collected from the source material included in project SOURCES.md.

End of document