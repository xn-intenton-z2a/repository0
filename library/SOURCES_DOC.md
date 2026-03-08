SOURCES_DOC

Table of contents
1. Normalised extract: core actionable technical points
2. Supplementary details: specifications and implementation knobs
3. Reference details: exact API signatures, error messages and config values
4. Detailed digest: SOURCES.md extract and retrieval metadata
5. Attribution and data size

1. Normalised extract: core actionable technical points

FizzBuzz rule set and deterministic contract
- For each integer i in the inclusive sequence 1..n produce an output at array index (i-1).
- Output mapping (priority order, exact string values):
  - If i % 15 === 0 then assign the exact string FizzBuzz
  - Else if i % 3 === 0 then assign the exact string Fizz
  - Else if i % 5 === 0 then assign the exact string Buzz
  - Else assign the numeric value i (JavaScript Number)
- Deterministic contract: returned array length MUST equal n; element at index (i-1) corresponds to integer i.

Input validation and canonical error semantics
- Use Number.isInteger(n) and Number.isFinite(n) for validation.
- Exact validation checks and throw semantics (implement these checks in this order):
  1. if (!Number.isFinite(n)) throw new RangeError('n must be finite')
  2. if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
  3. if (n < 1) throw new RangeError('n must be >= 1')
  4. const MAX_N = 10000000; if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)
- Use RangeError only for numeric domain violations; use TypeError for non-numeric type mismatches if applicable.

API surface and module consumption
- ESM named export (primary): export function fizzBuzz(n: number): Array<string | number>
  - Parameter: n (required) — finite integer, 1 <= n <= MAX_N
  - Return: Array of length n where each element is either the exact string 'Fizz', 'Buzz', 'FizzBuzz' or the numeric value i
- CommonJS consumption: require('package').fizzBuzz when package provides a CJS entry or CJS interop
- package.json "type" effects: when "type": "module" is present, .js files are ESM; .mjs is always ESM; .cjs is always CommonJS

Testing and tooling
- Install vitest as dev dependency: npm install --save-dev vitest
- Common test script: "test": "vitest --run tests/unit/*.test.js"
- CLI usage: npx vitest --run [--coverage] [--config <file>]

NPM package integration
- Install package: npm install --save fizzbuzz
- Inspect metadata: npm view fizzbuzz --json to read package.json fields including main, module, types and bin
- Reproducible CI install: npm ci (requires package-lock.json) or yarn install --frozen-lockfile

2. Supplementary details: specifications and implementation knobs

Performance and bounds
- Recommended safe upper bound: MAX_N = 10000000 (1e7). Implementations may choose a lower MAX_N depending on memory constraints and runtime environment. Expect O(n) time and O(n) memory when returning an array of length n.

Memory allocation pattern
- Allocate result array of length n up-front (var result = new Array(n)) to avoid repeated resizing.
- Fill by numeric index: for (let i = 1; i <= n; i++) { const j = i - 1; ... result[j] = value }

Divisibility check optimization
- Use combined test i % 15 === 0 first, or precompute flags (div3, div5), to ensure correct priority for FizzBuzz over Fizz/Buzz.

Error message conventions
- Messages must be short and machine-parseable: examples: 'n must be an integer', 'n must be >= 1', 'n must be <= 10000000', 'n must be finite'

3. Reference details: exact API signatures, parameters, return types, config values and effects

API signature
- export function fizzBuzz(n: number): Array<string | number>
  - Parameters: n: number (finite integer)
  - Returns: Array<string | number> of length n

Exact throw sites and messages (implement exactly)
- if (!Number.isFinite(n)) throw new RangeError('n must be finite')
- if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
- if (n < 1) throw new RangeError('n must be >= 1')
- const MAX_N = 10000000; if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)

Number.isInteger
- Signature: Number.isInteger(value) -> boolean
- Returns true only for Number-typed values that are finite and have no fractional component

RangeError
- Constructor: new RangeError(message?: string) -> RangeError instance with name = 'RangeError'
- Use for numeric domain violations; assert instanceof RangeError in tests where expected

package.json "type" handling (behavioral rules)
- "type": "module" -> interpret .js files as ESM
- "type": "commonjs" or absent -> .js files treated as CommonJS
- .mjs always ESM; .cjs always CommonJS

Vitest commands and scripts
- Install: npm install --save-dev vitest
- Run unit tests: npx vitest --run tests/unit/*.test.js
- Typical CI script: npm ci && npm test

4. Detailed digest: SOURCES.md extract and retrieval metadata

SOURCES.md content (extracted entries):
- https://en.wikipedia.org/wiki/Fizz_buzz
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
- https://www.npmjs.com/package/fizzbuzz
- https://vitest.dev/guide/

Retrieved on: 2026-03-08
Total sources: 6
Raw bytes in SOURCES.md at retrieval: 591 bytes

5. Attribution and data size

Attribution:
- Source list derived from project SOURCES.md maintained in repository root. Individual canonical reference materials: Wikipedia (Fizz_buzz), MDN JavaScript Modules guide, MDN Number.isInteger, MDN RangeError, npm package page for fizzbuzz, Vitest guide.

Data size obtained during crawling:
- SOURCES.md raw byte size: 591 bytes (file read from repository)
- No external HTTP crawl performed in this task; library documents in library/ reflect repository-provided extracts and duplicates which are marked deprecated.

End of document.
