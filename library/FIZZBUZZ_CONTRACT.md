FIZZBUZZ_CONTRACT

Table of contents
1. Normalised extract
  1.1 Core contract and algorithm
  1.2 Input validation and canonical error semantics (exact checks and messages)
  1.3 API signature, types and module export
  1.4 Implementation constraints and complexity
2. Supplementary details
  2.1 Constants and configuration knobs
  2.2 Module consumption and packaging notes (ESM/CommonJS)
  2.3 Testing and CI integration
3. Reference details
  3.1 Exact validation logic and RangeError messages (executable pattern)
  3.2 Function signature, parameters and return types
  3.3 Numeric helpers and semantics (Number.isInteger, Number.isFinite)
  3.4 NPM installation and inspection commands
4. Detailed digest (SOURCES.md excerpt and retrieval metadata)
5. Attribution and crawl data size

1. Normalised extract

1.1 Core contract and algorithm
- For input integer n produce an Array of length n where element at index (i-1) corresponds to integer i for i in 1..n inclusive.
- Mapping priority (apply in this exact order):
  - If i % 15 === 0 then output the exact string FizzBuzz
  - Else if i % 3 === 0 then output the exact string Fizz
  - Else if i % 5 === 0 then output the exact string Buzz
  - Else output the integer i as a JavaScript Number value
- Implementation MUST satisfy: returned array length equals n; elements are ordered mapping to integers 1..n; non-Fizz/Buzz entries are Number typed values (not strings).

1.2 Input validation and canonical error semantics (exact checks and messages)
- Perform checks in this exact order and throw RangeError with the precise message shown when a check fails:
  1. If Number.isFinite(n) === false then throw new RangeError('n must be finite')
  2. If Number.isInteger(n) === false then throw new RangeError('n must be an integer')
  3. If n < 1 then throw new RangeError('n must be >= 1')
  4. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)
- Use RangeError exclusively for numeric domain/type violations; do not use TypeError for these numeric range checks.

1.3 API signature, types and module export
- Primary exported function name: fizzBuzz
- Function signature (conceptual): export function fizzBuzz(n: number) : Array<string | number>
- Behavior: deterministic mapping described in 1.1; throws RangeError for validation failures described in 1.2.
- Export style: provide an ES module named export (export function fizzBuzz) and ensure package provides CommonJS interoperability if consumers require require() (see 2.2).

1.4 Implementation constraints and complexity
- Time complexity: O(n) single pass producing n outputs.
- Space complexity: O(n) for returned array.
- Do not convert non-Fizz outputs to strings; preserve Number type.
- Deterministic exact strings are Fizz, Buzz, FizzBuzz (case-sensitive, exact text).

2. Supplementary details

2.1 Constants and configuration knobs
- MAX_N: recommended default constant used for upper bound validation. Example value present in sources: 10000000. Implementations should expose or document MAX_N if different.
- Messages are machine-parseable short strings starting with parameter name and constraint: e.g., "n must be an integer".

2.2 Module consumption and packaging notes (ESM/CommonJS)
- package.json type field: when "type": "module" .js files are ESM; .mjs always ESM; .cjs always CommonJS.
- To support both consumers: provide an ESM export (export function fizzBuzz) and either provide a CommonJS build or a dual-entry in package.json exports (./dist/index.cjs and ./dist/index.mjs) so require() resolution works.
- If distributing as an npm package, set "main" and/or "module" or use the "exports" map for precise resolution.

2.3 Testing and CI integration
- Unit test: assert outputs for representative inputs (1, 3, 5, 15) and boundary/validation error cases (non-finite, non-integer, <1, >MAX_N).
- Vitest CLI for CI: use npm script test:unit -> vitest --run --coverage tests/unit/*.test.js
- Reproducible CI installs: npm ci for lockfile-driven installs; pin versions in package.json for deterministic behavior.

3. Reference details

3.1 Exact validation logic and RangeError messages (executable pattern)
- Ordered checks (exact code pattern):
  if (!Number.isFinite(n)) throw new RangeError('n must be finite')
  if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
  if (n < 1) throw new RangeError('n must be >= 1')
  const MAX_N = 10000000
  if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)
- Use RangeError for all four checks; message strings must match exactly for consumers/tests that assert specific messages.

3.2 Function signature, parameters and return types
- Signature: function fizzBuzz(n)
  - Parameters: n (Number) — required
  - Returns: Array where each element is either a Number (for plain integers) or a String (exactly one of: 'Fizz', 'Buzz', 'FizzBuzz')
  - Throws: RangeError with the messages listed in 3.1 when validation fails.

3.3 Numeric helpers and semantics (Number.isInteger, Number.isFinite)
- Number.isInteger behavior: returns true only for values of type Number that are finite and have no fractional component.
- Number.isFinite behavior: returns false for NaN, +Infinity, -Infinity and non-number types; use it as the first validation step.

3.4 NPM installation and inspection commands
- Install as dependency: npm install --save fizzbuzz
- Install reproducibly in CI: npm ci
- Inspect package metadata: npm view fizzbuzz --json
- Pin exact version: npm install --save fizzbuzz@1.2.3

4. Detailed digest
- Extract from SOURCES.md (retrieved 2026-03-08T18:20:44.740Z):
  - Sources list includes: https://en.wikipedia.org/wiki/Fizz_buzz; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError; https://www.npmjs.com/package/fizzbuzz; https://vitest.dev/guide/.
  - Collated implementation rules in this document are directly extracted and normalised from those sources: algorithm mapping, validation ordering and messages, API signature and module rules, and testing/packaging commands.
- Retrieval date: 2026-03-08T18:20:44.740Z

5. Attribution and crawl data size
- Attribution: content extracted from the URLs listed in SOURCES.md; primary authoritative references were MDN pages for Number.isInteger and RangeError, Wikipedia for FizzBuzz definition, npm for package metadata, and Vitest guide for test integration.
- Sources count: 6 URLs
- Raw SOURCES.md file byte size at crawl time: 482 bytes

End of document.
