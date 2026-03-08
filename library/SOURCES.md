SOURCES

Table of contents
1. Normalised extract
2. Supplementary details
3. Reference details
4. Detailed digest and retrieval metadata
5. Attribution and data size

1. Normalised extract

This document consolidates technical, actionable details extracted from the crawled sources listed in the repository SOURCES.md relevant to the fizz-buzz mission. It presents implementation-ready rules, validation semantics, API signatures, configuration values, and testing/packaging commands.

Topics covered (TOC)
- FizzBuzz core algorithm and deterministic contract
- Input validation and canonical RangeError messages
- API signatures and module consumption (ESM and CommonJS)
- Module resolution effects from package.json "type"
- Number.isInteger and Number.isFinite exact semantics
- RangeError constructor usage and canonical messages
- NPM package handling for fizzbuzz package (install, inspect, pin)
- Vitest usage for unit testing (installation, CLI commands, scripts)

FizzBuzz core algorithm and deterministic contract
- For each integer i in the inclusive sequence 1..n, produce an output at result index (i-1).
- Output mapping (priority order):
  - If i % 15 === 0 -> exact string: FizzBuzz
  - Else if i % 3 === 0 -> exact string: Fizz
  - Else if i % 5 === 0 -> exact string: Buzz
  - Else -> the integer i (JavaScript Number when typed Array<string | number>)
- Contract: returned array length MUST equal n; element order MUST map to integers 1..n.

Input validation and canonical RangeError messages
- Use Number.isInteger(n) and Number.isFinite(n) for validation.
- Canonical checks and exact throw messages to implement verbatim:
  - if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
  - if (n < 1) throw new RangeError('n must be >= 1')
  - const MAX_N = 10000000; if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)
  - if (!Number.isFinite(n)) throw new RangeError('n must be finite')
- Use RangeError for numeric range/type violations; do not use TypeError for numeric range messages.

API signatures and module consumption
- ESM primary export signature: export function fizzBuzz(n: number): Array<string | number>
  - Parameter: n (required) — finite integer, 1 <= n <= MAX_N
  - Return: Array of length n; elements are exact strings 'Fizz', 'Buzz', 'FizzBuzz' or numeric values i
- CommonJS consumption: require('package').fizzBuzz when package provides CJS entry or interop
- package.json "type" effects: when "type": "module" present, .js files are ESM; .mjs always ESM; .cjs always CommonJS

Number.isInteger and Number.isFinite semantics
- Number.isInteger(value) -> boolean. Returns true only when typeof value === 'number' and value is finite and has no fractional part.
- Number.isFinite(value) -> boolean. Returns true only when typeof value === 'number' and value is finite (not NaN, Infinity, -Infinity).
- Edge behaviors: large numbers near Number.MAX_SAFE_INTEGER may be representable but suffer precision caveats; use integer checks before heavy computations.

RangeError constructor and message conventions
- Constructor: new RangeError(message?: string) -> RangeError instance where name === 'RangeError' and message is the provided string or empty.
- Message conventions: short, machine-parseable messages starting with the parameter name then constraint, e.g., 'n must be an integer', 'n must be >= 1', 'n must be <= 10000000'.

NPM package handling for fizzbuzz
- Install: npm install --save fizzbuzz
- Inspect metadata: npm view fizzbuzz --json to read package.json fields (versions, main, module, types, exports, repository)
- Pin exact version: npm install --save fizzbuzz@<version>
- Reproducible CI install: use npm ci (requires package-lock.json) or yarn install --frozen-lockfile
- Verify package files: npm pack --dry-run or download tarball and inspect package contents for entrypoints

Vitest usage (unit testing)
- Install dev dependency: npm install --save-dev vitest
- CLI: npx vitest --run [--coverage] [--config <file>]
- Typical script entries in package.json:
  - "test": "vitest --run tests/unit/*.test.js"
  - "test:unit": "vitest --run --coverage tests/unit/*.test.js"
- Run tests in CI with: npm ci && npm test

2. Supplementary details

Implementation pattern and complexity
- Allocate result = new Array(n)
- For i = 1; i <= n; ++i:
  - const idx = i - 1
  - if (i % 15 === 0) result[idx] = 'FizzBuzz'
  - else if (i % 3 === 0) result[idx] = 'Fizz'
  - else if (i % 5 === 0) result[idx] = 'Buzz'
  - else result[idx] = i
- Time complexity: O(n); Space: O(n) for result array. Avoid string concatenation in the loop; assign exact strings to minimize allocations.

Testing patterns
- Unit tests should cover:
  - n = 1 -> [1]
  - n = 3 -> [1,2,'Fizz']
  - n = 5 -> [1,2,'Fizz',4,'Buzz']
  - n = 15 -> check index 14 === 'FizzBuzz'
  - invalid inputs: fractional, NaN, Infinity, n < 1, n > MAX_N -> expect RangeError with exact message
- Use Vitest assertions with deepEqual for array equality and throws for RangeError messages.

Packaging and module resolution
- Provide both ESM and CommonJS entrypoints where consumers expect either form. If "type": "module" is used, provide a "exports" field for dual entry or provide .cjs alongside .js.
- For TypeScript typings, include a types field pointing to a .d.ts file when distributing.

3. Reference details (concrete specs and signatures)

Function signature (primary)
export function fizzBuzz(n: number): Array<string | number>
- Parameters:
  - n: number (finite integer, 1 <= n <= MAX_N)
- Returns: Array<string | number> of length n
- Throws (exact messages, verbatim):
  - RangeError('n must be an integer')
  - RangeError('n must be >= 1')
  - RangeError('n must be <= ' + MAX_N)
  - RangeError('n must be finite')

Validation predicates
- Number.isInteger(n) // boolean
- Number.isFinite(n) // boolean

RangeError constructor
- new RangeError(message?: string) -> RangeError

NPM commands
- npm install --save fizzbuzz
- npm view fizzbuzz --json
- npm install --save fizzbuzz@<version>
- npm ci

Vitest commands
- npm install --save-dev vitest
- npx vitest --run --coverage
- package.json scripts: "test": "vitest --run tests/unit/*.test.js"

4. Detailed digest and retrieval metadata

Source list (from repository SOURCES.md) and retrieval date: 2026-03-08
- https://en.wikipedia.org/wiki/Fizz_buzz  (retrieved 2026-03-08)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (retrieved 2026-03-08)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (retrieved 2026-03-08)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (retrieved 2026-03-08)
- https://www.npmjs.com/package/fizzbuzz  (retrieved 2026-03-08)
- https://vitest.dev/guide/  (retrieved 2026-03-08)

Raw SOURCES.md file size: 201 bytes

5. Attribution and data size
- Crawl source list: contents of repository SOURCES.md (file read on 2026-03-08)
- Data obtained during crawling: 201 bytes (SOURCES.md content only; no external HTTP fetches were performed by this run)

Usage notes
- This document is intended for direct consumption by implementers writing src/lib/fizz.js or src/lib/main.js and by CI scripts; copy exact validation messages and signatures into code to preserve API compatibility.

[NARRATIVE] Created a normalized SOURCES library document by extracting the repository SOURCES.md and consolidating actionable technical specifications for fizz-buzz implementation and related JS APIs.