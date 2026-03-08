FIZZ_BUZZ

Table of contents
1. Normalised extract
2. Supplementary details
3. Reference details
4. Detailed digest
5. Attribution and data size

1. Normalised extract

Function signature and contract
- fizzBuzz(n: number) -> Array<string | number>
- For input n (number), produce an ordered array of length n where array[i-1] corresponds to integer i for 1 <= i <= n.
- Return element values exactly as follows (apply in priority order per i):
  1. If i % 15 == 0 then value = FizzBuzz (string)
  2. Else if i % 3 == 0 then value = Fizz (string)
  3. Else if i % 5 == 0 then value = Buzz (string)
  4. Else value = i (native numeric value)

Input validation and error semantics
- Acceptable input types: Number only; non-number types must be rejected before numeric-domain checks.
- Validation steps to implement in order:
  1. If Type(n) !== Number -> throw TypeError('n must be a number')
  2. If Number.isNaN(n) || !Number.isFinite(n) -> throw RangeError('n must be finite')
  3. If !Number.isInteger(n) -> throw RangeError('n must be an integer')
  4. If n < 1 -> throw RangeError('n must be >= 1')
  5. If n > MAX_N -> throw RangeError('n must be <= ' + MAX_N)  where MAX_N is a chosen implementation bound
- Use RangeError only for numeric-domain violations; use TypeError for non-number type mismatches.

Behavioral invariants and performance
- Output array length must equal n. Order must strictly correspond to 1..n.
- Non-Fizz/Buzz/FizzBuzz entries must be numeric typed values (not strings).
- Time complexity: O(n). Space complexity: O(n) for eager array; a generator/lazy API may be used to reduce memory.

2. Supplementary details

Module and packaging conventions
- Export pattern (ESM): export function fizzBuzz(n) { ... }
- package.json "type" field: set to "module" to treat .js as ESM; use .cjs/.mjs to override.
- If publishing an npm package named fizzbuzz, include explicit "main" and/or "exports" to declare entry points and prefer module field when offering ESM.

Runtime usage patterns
- Synchronous eager API: const result = fizzBuzz(100)
- Lazy generator API (optional): function* fizzBuzzGenerator(max) { for (i=1;i<=max;i++) yield ... }
- CLI entry (optional) should accept a positive integer argument, validate using above rules, and print sequence joined by newlines.

Testing and CI integration (Vitest)
- Test file naming: use file.test.js or file.spec.js pattern (e.g., main.test.js). Vitest will discover these files by default.
- Example test assertions: assert array length equals n; assert exact mapping at sample indices (3 -> 'Fizz', 5 -> 'Buzz', 15 -> 'FizzBuzz'); assert non-multiple values are numbers.
- Local test command: npm test  (runs: vitest --run tests/unit/*.test.js)
- CI install: use lockfile-driven installs: npm ci or yarn install --frozen-lockfile for reproducible builds.

Security and packaging checks
- Before installing remote package, inspect metadata with: npm view fizzbuzz --json
- Install pinned version for reproducible builds: npm install --save fizzbuzz@<version>
- Run npm audit and review transitive dependencies when adding external packages.

3. Reference details

Exact API signatures and errors
- fizzBuzz(n: number): Array<string | number>
- RangeError constructor: new RangeError(message?: string) -> RangeError
- Number.isInteger(value): boolean  (internal algorithm: returns true iff Type(value) is Number, isFinite, and has zero fractional component)

Recommended error messages (machine-parseable, exact strings)
- TypeError for non-number: 'n must be a number'
- RangeError for non-finite: 'n must be finite'
- RangeError for non-integer: 'n must be an integer'
- RangeError for lower bound: 'n must be >= 1'
- RangeError for upper bound: 'n must be <= ' + MAX_N

Package and CLI commands (exact)
- Install as dependency: npm install --save fizzbuzz
- Install as dev dependency: npm install --save-dev fizzbuzz
- Reproducible CI install: npm ci
- Run tests: npm test
- Run unit tests with coverage: npm run test:unit

Vitest CLI flags and semantics
- Run tests once: vitest --run
- Run specific files: vitest --run tests/unit/*.test.js
- Coverage with vitest: vitest --coverage (or via test:unit script which runs vitest --run --coverage)

Module field semantics
- package.json "type": "module"  => .js files parsed as ESM
- .mjs always ESM, .cjs always CommonJS

4. Detailed digest

Sources referenced (retrieved 2026-03-08):
- https://en.wikipedia.org/wiki/Fizz_buzz  (canonical algorithm and mapping rules)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (module types, package.json "type" field, resolution rules)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (exact Number.isInteger semantics)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (RangeError usage and signature)
- https://www.npmjs.com/package/fizzbuzz  (npm packaging, install patterns)
- https://vitest.dev/guide/  (test discovery, CLI, configuration and CI integration)

5. Attribution and data size

Data retrieved from SOURCES.md which listed the above URLs. File read size (bytes) as reported by repository: see below for exact byte count.

