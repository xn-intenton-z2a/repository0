FIZZBUZZ_SOURCES

Table of contents
1. Normalised extract: core algorithm and contract
2. Focused table of contents (topics covered)
3. Detailed technical items
   3.1 Rule set and deterministic output mapping
   3.2 Input validation checks and exact error messages
   3.3 API signature and module consumption rules
   3.4 Implementation pattern and complexity
4. Supplementary details: specifications and implementation knobs
5. Reference details: exact API signatures, parameter lists, return types, constructor specs, configuration values and effects, CLI/test commands
6. Troubleshooting and best practices
7. Detailed digest: extracted SOURCES.md content and retrieval metadata
8. Attribution and data size

1. Normalised extract: core algorithm and contract
For each integer i in the inclusive integer range 1..n produce a value at index (i-1) in the returned sequence. The mapping is strictly prioritized and exact-string sensitive:
- If i % 15 === 0 -> FizzBuzz
- Else if i % 3 === 0 -> Fizz
- Else if i % 5 === 0 -> Buzz
- Else -> numeric value i (Number)
Deterministic contract: returned array length MUST equal n; element order MUST map to integers 1..n; non-Fizz/Buzz elements MUST be JavaScript Number values when API is typed to Array<string | number>.

2. Focused table of contents (topics covered)
- Rule set and output mapping
- Input validation and canonical error semantics
- API signature (ESM named export) and CommonJS consumption
- Module resolution effects from package.json "type"
- Exact RangeError messages for invalid input
- MAX_N safe upper bound guidance and enforced message
- Testing CLI and Vitest invocation patterns
- NPM package inspection and safe install commands

3. Detailed technical items
3.1 Rule set and deterministic output mapping
- Algorithmic step sequence: allocate array of length n, loop i from 1 to n, evaluate divisibility with highest-priority combined test first (i % 15 === 0) then 3 then 5, assign the exact string values or the numeric i to result[i-1].
- Exact output tokens: Fizz, Buzz, FizzBuzz (case-sensitive, no surrounding whitespace).
- Type contract: numeric outputs are JavaScript Number values, not strings, unless API variant explicitly states string-only outputs.

3.2 Input validation checks and exact error messages
- Validation sequence (implement verbatim):
  1) if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
  2) if (!Number.isFinite(n)) throw new RangeError('n must be finite')
  3) if (n < 1) throw new RangeError('n must be >= 1')
  4) const MAX_N = 10000000; if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)
- Use RangeError for all numeric value or numeric-type domain violations; do not use TypeError for these numeric checks.
- Messages must match exactly where compatibility with tests or consumers is required (strings above).

3.3 API signature and module consumption rules
- Primary export signature (ESM named): export function fizzBuzz(n: number): Array<string | number>
  - Parameter: n — required, finite integer, 1 <= n <= MAX_N
  - Return: array length n, elements string or number per rule set above
- CommonJS consumption: require('package').fizzBuzz when package provides CommonJS entry or interop layer.
- package.json "type" semantics: when "type": "module" is present, .js files are parsed as ESM; .mjs is always ESM; .cjs is always CommonJS. Module resolution and loader behavior must respect this when shipping both ESM and CJS consumers.

3.4 Implementation pattern and complexity
- Time complexity: O(n) for single-pass generation.
- Space complexity: O(n) allocated result array of length n.
- Micro-optimizations: avoid repeated string allocations in loop by using constants for 'Fizz', 'Buzz', 'FizzBuzz'; compute combined condition as i % 15 === 0 instead of nested conditionals for speed and clarity.
- Safety bound: choose MAX_N = 10000000 to avoid uncontrolled memory usage; enforce via RangeError as above.

4. Supplementary details: specifications and implementation knobs
- MAX_N: recommended constant value 10000000 (10 million). Enforced with message 'n must be <= ' + MAX_N.
- Validation primitives: Number.isInteger(value) -> boolean; Number.isFinite(value) -> boolean. These reject NaN and infinite values.
- Error type: RangeError constructor semantics: new RangeError(message?) -> RangeError with name 'RangeError' and message as provided. Use for numeric-domain violations.
- Testing harness: vitest suggested. Typical script: "test": "vitest --run tests/unit/*.test.js". For coverage: use --coverage and configure test:unit script accordingly.
- NPM package handling: to inspect package metadata run npm view fizzbuzz --json; to pin versions use npm install --save fizzbuzz@<version> or npm ci for lockfile-driven installs.

5. Reference details: exact API signatures, parameter lists, return types, constructor specs, configuration values and effects, CLI/test commands
- Function signature (ESM): export function fizzBuzz(n: number): Array<string | number>
  - Parameters: n: number (finite integer)
  - Returns: Array<string | number> (length === n; index 0 corresponds to 1)
- CommonJS import form: const { fizzBuzz } = require('fizzbuzz') // available when package publishes CJS
- RangeError constructor: new RangeError(message?: string) -> RangeError instance with name 'RangeError' and message property equal to provided message.
- Exact validation messages (must be used verbatim in implementations relying on exact throws): 'n must be an integer', 'n must be finite', 'n must be >= 1', 'n must be <= ' + MAX_N
- MAX_N value: 10000000 (10 million)
- Vitest CLI: npx vitest --run [--coverage] [--config <file>]
- NPM commands:
  - Install: npm install --save fizzbuzz
  - Dev install: npm install --save-dev fizzbuzz
  - Inspect metadata: npm view fizzbuzz --json
  - Reproducible CI install: npm ci (requires package-lock.json)

6. Troubleshooting and best practices
- If tests fail due to thrown error messages, verify exact strings and error types; many unit tests assert both the thrown Error class and message string.
- Memory failures for large n: ensure MAX_N cap is enforced and documented; for very large streams consider generator-based API instead of array-return to avoid O(n) peak memory usage.
- Interop issues: when publishing, provide dual entry points or interop wrapper if consumers use CommonJS; declare "type" in package.json carefully to match shipped file formats.
- Precision caveat: Number.isInteger returns true for numeric values that are integral in IEEE-754 representation; do not rely on it to guarantee safe integer arithmetic beyond Number.MAX_SAFE_INTEGER.

7. Detailed digest: extracted SOURCES.md content and retrieval metadata
- Sources file lines consulted (SOURCES.md):
  - https://en.wikipedia.org/wiki/Fizz_buzz (FizzBuzz problem definition and variants)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules (Module types, package.json "type", .mjs/.cjs semantics)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger (Number.isInteger semantics and edge cases)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError (RangeError constructor and usage guidance)
  - https://www.npmjs.com/package/fizzbuzz (npm package metadata and installation patterns)
  - https://vitest.dev/guide/ (Vitest CLI usage and common test patterns)
- Retrieval datetime: 2026-03-08T15:40:14.761Z
- Extracted technical material: algorithm rules, exact validation logic and messages, API signature, module type effects, test and package commands, MAX_N recommendation.

8. Attribution and data size
- Attribution: content directly extracted from the URLs listed above as referenced in SOURCES.md; see SOURCES.md in repository root for original links.
- Data size obtained during extraction: approximately 9 KB of technical content consolidated into this document (derived from repository SOURCES.md and local library extracts).

END OF DOCUMENT
