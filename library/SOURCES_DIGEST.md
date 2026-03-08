SOURCES_DIGEST

Table of contents
1. Normalised extract
  1.1 FizzBuzz implementation rules and function contract
  1.2 ES Module rules affecting packaging and exports
  1.3 Number.isInteger exact semantics
  1.4 RangeError usage and exact messages
  1.5 npm package integration and verification
  1.6 Vitest installation, discovery and CLI options
2. Supplementary details (specs and implementation notes)
3. Reference details (exact API signatures, parameters, returns, config keys)
4. Detailed digest (sources + retrieval date)
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz implementation rules and function contract
Function signature: fizzBuzz(n: number) -> Array<string|number>
Contract and mapping (apply in this priority order for each integer i from 1 to n):
- If i % 15 == 0 then output the exact string FizzBuzz
- Else if i % 3 == 0 then output the exact string Fizz
- Else if i % 5 == 0 then output the exact string Buzz
- Else output the integer i as a native Number value
Return invariants:
- Returned array length must equal n
- returnedArray[i-1] corresponds to integer i
- Non-Fizz/Buzz/FizzBuzz entries must be Numbers (not strings)
Performance:
- Time complexity O(n); space O(n) for eager array; generator variant permitted for lazy evaluation

Input validation (exact sequence and errors):
1. If typeof n !== 'number' then throw new TypeError('n must be a number')
2. If Number.isNaN(n) || !Number.isFinite(n) then throw new RangeError('n must be finite')
3. If !Number.isInteger(n) then throw new RangeError('n must be an integer')
4. If n < 1 then throw new RangeError('n must be >= 1')
5. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N) where MAX_N is an implementation bound

1.2 ES Module rules affecting packaging and exports
package.json "type" field effects:
- "type": "module" causes .js files to be parsed as ESM
- .mjs is always ESM; .cjs is always CommonJS
Resolution rules:
- Relative specifiers (./, ../) resolve to files using extension rules; bare specifiers follow node_modules package resolution and package.json exports/main
Export and import forms:
- Named exports: export function fizzBuzz(...) {}
- Default exports: export default function ...
- Consumers can use import { fizzBuzz } from 'pkg' or import fizzBuzz from 'pkg' depending on export form
Interoperability:
- When offering both CJS and ESM, provide explicit "exports" map or separate entry files (.cjs for CJS consumers)

1.3 Number.isInteger exact semantics
Signature: Number.isInteger(value) -> boolean
Algorithmic rules:
- Return false if Type(value) !== 'number'
- Return false if value is NaN, +Infinity or -Infinity
- Return true if value is finite and has no fractional component (mathematical integer)
Edge cases:
- Returns false for non-number types, NaN, Infinity
- IEEE-754 precision caveat: very large magnitudes may be integer-valued but arithmetic may be unsafe beyond Number.MAX_SAFE_INTEGER

1.4 RangeError usage and exact messages
Constructor: new RangeError(message?: string) -> RangeError; name property = 'RangeError'
When to throw RangeError (canonical conditions and exact message patterns):
- Non-finite numeric values: new RangeError('n must be finite')
- Non-integer numeric values: new RangeError('n must be an integer')
- Lower bound violation: new RangeError('n must be >= 1')
- Upper bound violation: new RangeError('n must be <= ' + MAX_N)
Message conventions: start with parameter name then constraint for machine parsing

1.5 npm package integration and verification (fizzbuzz package)
Installation commands:
- npm install --save fizzbuzz  (production dependency)
- npm install --save-dev fizzbuzz  (dev dependency)
- npm ci for lockfile-driven reproducible CI installs
Pin exact version: npm install --save fizzbuzz@X.Y.Z
Inspect package metadata:
- npm view fizzbuzz --json to retrieve package.json fields
- Download tarball and inspect package contents if needed
Runtime import patterns:
- If package exposes ESM: import { fizzBuzz } from 'fizzbuzz'
- If package exposes CJS: const { fizzBuzz } = require('fizzbuzz') or require the default export accordingly
Security and verification:
- Run npm audit; verify package integrity; pin versions in CI

1.6 Vitest installation, discovery and CLI options
Requirements:
- Node >= 20.0.0; Vite >= 6.0.0 for full integration
Install dev dependency:
- npm install -D vitest
Test discovery:
- Files matching *.test.* or *.spec.* are discovered by default
CLI common commands:
- vitest --run tests/unit/*.test.js  (run tests non-interactively)
- vitest --run --coverage tests/unit/*.test.js
CI:
- Use pinned versions and lockfile-driven installs (npm ci)
Environments:
- Execution environment can be node or jsdom/happy-dom per config

2. Supplementary details (specs and implementation notes)
- Export ESM functions as named exports and set package.json "type":"module" for native ESM consumers; provide .cjs entry or exports map for Node < module-support consumers
- Use short machine-parseable error messages for tests and assertion matching
- Prefer generator API if n may exceed available memory
- Validate inputs in the exact order listed to ensure consistent thrown error types for tests

3. Reference details (exact API signatures, parameters, returns, config keys)
APIs and signatures:
- fizzBuzz(n: number) -> Array<string|number>
  - Parameters: n (number) required
  - Returns: Array containing strings 'Fizz', 'Buzz', 'FizzBuzz' or Numbers
  - Throws:
    - TypeError('n must be a number') when typeof n !== 'number'
    - RangeError('n must be finite') when value is NaN/Infinity
    - RangeError('n must be an integer') when not integer
    - RangeError('n must be >= 1') when below 1
    - RangeError('n must be <= ' + MAX_N) when above MAX_N
- Number.isInteger(value) -> boolean (built-in)
- new RangeError(message?) -> RangeError
Configuration keys and effects:
- package.json: "type": "module" => .js parsed as ESM
- package.json: "main" and "exports" control CJS/ESM entry points and resolution
Vitest CLI flags and effects:
- --run: run tests and exit
- --coverage: collect coverage
- test file pattern defaults: *.test.* and *.spec.*

4. Detailed digest (sources + retrieval date)
Sources processed (from SOURCES.md):
- https://en.wikipedia.org/wiki/Fizz_buzz
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
- https://www.npmjs.com/package/fizzbuzz
- https://vitest.dev/guide/
Retrieved: 2026-03-08
Crawl notes: content extracted focused on the canonical algorithm, API contracts, input validation semantics, module packaging rules, package integration patterns, and test runner configuration

5. Attribution and crawl data size
Attribution: content extracted from the URLs listed above; original sources retained in SOURCES.md in repository root
Crawl data size: not recorded during this run (recommend recording HTTP response byte lengths in future crawls)

End of document
