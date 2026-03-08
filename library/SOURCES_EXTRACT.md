SOURCES_EXTRACT

Table of contents
1. Normalised extract
  1.1 FizzBuzz core algorithm and deterministic contract
  1.2 Input validation and canonical RangeError semantics (exact checks and messages)
  1.3 API signature and return types
  1.4 Module type and resolution notes
  1.5 Number helpers exact semantics (Number.isInteger, Number.isFinite)
  1.6 Tooling and CI commands (npm, yarn, vitest)
2. Supplementary details and implementation knobs
3. Reference details (exact API signatures, parameters, return types, commands)
4. Detailed digest (SOURCES.md excerpt and retrieval metadata)
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz core algorithm and deterministic contract
- For input integer n (1 <= i <= n) produce an array result of length n where result[i-1] corresponds to integer i.
- Mapping priority (apply in this exact order):
  - If i % 15 === 0 then element = the exact string FizzBuzz
  - Else if i % 3 === 0 then element = the exact string Fizz
  - Else if i % 5 === 0 then element = the exact string Buzz
  - Else element = the integer i (JavaScript Number value)
- Implementation must satisfy:
  - Returned array length MUST equal n.
  - Element ordering MUST correspond to integers 1..n.
  - Elements that are not Fizz/Buzz/FizzBuzz MUST be Number typed values (not strings).

1.2 Input validation and canonical RangeError semantics (exact checks and messages)
- Perform checks in the following exact order and throw RangeError with the precise message when a check fails:
  1. If Number.isFinite(n) === false then throw new RangeError('n must be finite')
  2. If Number.isInteger(n) === false then throw new RangeError('n must be an integer')
  3. If n < 1 then throw new RangeError('n must be >= 1')
  4. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)
- Use RangeError exclusively for numeric domain/type violations; do not use TypeError for these numeric range checks.
- Canonical constant: MAX_N = 10000000 (recommended upper bound for implementations referencing SOURCES.md).

1.3 API signature and return types
- Primary export name: fizzBuzz
- Function signature: fizzBuzz(n: number) -> Array<string | number>
- Behavior: returns an Array where indices 0..n-1 map to integers 1..n and entries are either the exact strings Fizz, Buzz, FizzBuzz or Number values for non-multiples.

1.4 Module type and resolution notes
- package.json "type" affects interpretation of .js files: "type": "module" treats .js as ESM; otherwise .js is CommonJS. Use .mjs for explicit ESM or .cjs for explicit CommonJS.
- Export forms: provide a named export fizzBuzz for ESM: export function fizzBuzz(n) { ... }
- For CommonJS, export as module.exports = { fizzBuzz } or module.exports = fizzBuzz when exposing a single function.
- Consumers must import using the matching module system or a compatible bundler/loader.

1.5 Number helpers exact semantics
- Number.isInteger(value): returns true iff Type(value) is Number, value is finite, and has zero fractional component.
- Number.isFinite(value): returns true iff Type(value) is Number and value is neither NaN nor +Infinity nor -Infinity.
- Use these helpers exactly as the canonical checks in validation order specified above.

1.6 Tooling and CI commands
- Install package: npm install --save fizzbuzz  OR yarn add fizzbuzz
- Pin exact version: npm install --save fizzbuzz@<version>
- CI reproducible install: npm ci  (requires package-lock.json) or yarn install --frozen-lockfile
- Inspect package metadata: npm view fizzbuzz --json
- Unit tests (Vitest): npm test  runs "vitest --run tests/unit/*.test.js"
- Coverage: npm run test:unit runs "vitest --run --coverage tests/unit/*.test.js"

2. Supplementary details and implementation knobs
- MAX_N: set to 10000000 to match canonical guidance; implementations may choose lower limits but must document deviation.
- Performance: algorithm is O(n) time, O(n) space; prefer single-pass loop from 1 to n, compute modulo checks in the priority order to avoid branching errors.
- Memory: allocate array of length n up-front when n is known and within memory budgets; when n is large consider streaming output rather than full allocation.
- Type consistency: ensure non-Fizz entries are Number typed; avoid stringifying numbers for consistent downstream numeric operations.
- Error messaging: keep messages machine-parseable and parameter-prefixed (e.g., "n must be an integer").

3. Reference details (exact API signatures, parameters, return types, commands)
- fizzBuzz:
  - Signature: function fizzBuzz(n: number): Array<string | number>
  - Parameters: n — Number (finite integer satisfying 1 <= n <= MAX_N)
  - Returns: Array whose elements are either the exact strings "Fizz", "Buzz", "FizzBuzz" or Number values corresponding to integers that are not multiples of 3 or 5.
  - Errors: Throws RangeError with messages exactly as specified in 1.2 when validation fails.
- RangeError:
  - Constructor: new RangeError(message?: string) -> RangeError
  - Use for numeric domain violations. Example messages: 'n must be finite', 'n must be an integer', 'n must be >= 1', 'n must be <= 10000000'.
- Number.isInteger(value): boolean
- Number.isFinite(value): boolean
- npm commands (exact): npm install --save fizzbuzz; npm install --save fizzbuzz@1.2.3; npm ci; npm view fizzbuzz --json
- vitest commands (exact): npm test  -> vitest --run tests/unit/*.test.js; npm run test:unit -> vitest --run --coverage tests/unit/*.test.js

4. Detailed digest
- Extract from SOURCES.md relevant section (retrieved 2026-03-08T18:50:32.183Z):
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
  - Use RangeError for numeric range/type violations; do not use TypeError for these checks.

5. Attribution and crawl data size
- Source list: URLs in project SOURCES.md including Wikipedia FizzBuzz, MDN modules, MDN Number.isInteger, MDN RangeError, npm fizzbuzz, Vitest guide.
- Retrieved on: 2026-03-08T18:50:32.183Z
- Approximate crawl data obtained: 9 KB (extracted sections used for this document).

End of document
