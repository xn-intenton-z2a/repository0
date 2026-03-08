FIZZBUZZ_CORE

Table of contents
1. Normalised extract
  1.1 Function signature and return contract
  1.2 Per-integer mapping rules (exact priority)
  1.3 Input validation sequence and exact thrown errors/messages
  1.4 Behavioral invariants and complexity
2. Supplementary details
  2.1 Module export and package configuration
  2.2 Implementation bound and MAX_N usage
  2.3 Testing and CI commands (Vitest & npm)
3. Reference details
  3.1 API signature and method contract
  3.2 Exact Error constructors, types and message strings
  3.3 package.json fields and their exact effects
  3.4 Vitest CLI commands and options used in CI
  3.5 Troubleshooting steps for deterministic failures
4. Detailed digest and sources
5. Attribution and crawl data size

1. Normalised extract

1.1 Function signature and return contract
Function signature:
- fizzBuzz(n: number) -> Array<string | number>

Return contract:
- The function returns an Array whose length is exactly n.
- The element at index (i - 1) corresponds to integer i for 1 <= i <= n.
- Non-Fizz/Buzz/FizzBuzz entries MUST be Number typed values (not strings).

1.2 Per-integer mapping rules (apply in this exact priority order for each integer i from 1..n)
- If i % 15 === 0 then value = "FizzBuzz" (string)
- Else if i % 3 === 0 then value = "Fizz" (string)
- Else if i % 5 === 0 then value = "Buzz" (string)
- Else value = i (native Number)

1.3 Input validation sequence and exact thrown errors/messages (perform checks in this order)
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
- Use TypeError only for non-number types; use RangeError for numeric/domain violations.
- Error message strings above are required verbatim for deterministic testing and machine parsing.

1.4 Behavioral invariants and complexity
- Time complexity: O(n).
- Space complexity: O(n) for an eager array return; a generator/lazy API MAY be offered separately.
- The order of checks and mapping must be exact to satisfy canonical tests.

2. Supplementary details

2.1 Module export and package configuration
- Recommended ESM export form: export function fizzBuzz(n) { ... }
- package.json: to use ESM by default set "type": "module" at package root. To provide both CJS and ESM, use file extensions (.cjs/.mjs) or provide an "exports" map.
- When publishing to npm, include "main" and/or "exports" to declare entry points; prefer "exports" to expose only intended entry signatures.

2.2 Implementation bound and MAX_N usage
- Implementations must define a MAX_N constant to guard against excessively large allocations.
- Exact upper-bound behavior: when n > MAX_N throw new RangeError('n must be <= ' + MAX_N).
- Choose MAX_N appropriate for environment (example: 1e7 may be too large for eager allocation; pick a value that prevents OOM in CI).

2.3 Testing and CI commands (Vitest & npm)
- Unit test runner: Vitest. Recommended script examples in package.json:
  - "test": "vitest --run tests/unit/*.test.js"
  - "test:unit": "vitest --run --coverage tests/unit/*.test.js"
- CI reproducible installs: use lockfile-driven installs: npm ci or yarn install --frozen-lockfile.

3. Reference details

3.1 API signature and method contract
- API: fizzBuzz(n: number) => Array<string | number>
- Parameter: n - required; type Number; must satisfy validation sequence in 1.3.
- Return: array length n; index mapping i->array[i-1]; values exactly as per mapping rules in 1.2.

3.2 Exact Error constructors, types and message strings
- Type errors:
  - new TypeError('n must be a number') for non-number inputs.
- Range errors:
  - new RangeError('n must be finite') when Number.isNaN(n) || !Number.isFinite(n)
  - new RangeError('n must be an integer') when !Number.isInteger(n)
  - new RangeError('n must be >= 1') when n < 1
  - new RangeError('n must be <= ' + MAX_N) when n > MAX_N

3.3 package.json fields and their exact effects
- "type": "module" => .js files parsed as ESM.
- "main" => entry point for CommonJS consumers when "exports" is absent.
- "exports" => explicit conditional exports mapping, preferred to control ESM/CJS entry points.
- "engines": { "node": ">=24.0.0" } => CI should enforce node version; tests may assume Node >= 20+ for Vitest.

3.4 Vitest CLI commands and options used in CI
- Local run: npx vitest or npm run test
- CI run for unit tests with coverage: vitest --run --coverage tests/unit/*.test.js
- Discovery: Vitest finds files with .test. or .spec. in their filename by default.

3.5 Troubleshooting steps for deterministic failures
- If tests expect exact error messages, verify the thrown error constructor and message string match exactly.
- If failing due to type mismatch, confirm typeof n is 'number' and not a Number object wrapper.
- If memory errors on large n, reduce MAX_N or provide a generator-based API to stream results instead of allocating an array.
- For differing module resolution failures, check package.json "type" and file extensions (.mjs/.cjs) and ensure CI node version matches "engines".

4. Detailed digest and sources
- Sources consulted (as listed in repository SOURCES.md):
  - https://en.wikipedia.org/wiki/Fizz_buzz  (canonical algorithm and mapping rules)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (module type and package.json "type" effects)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (Number.isInteger semantics)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (RangeError usage and messages)
  - https://www.npmjs.com/package/fizzbuzz  (npm package metadata and install patterns)
  - https://vitest.dev/guide/  (Vitest commands, discovery, and CI usage)
- Retrieval date: 2026-03-08

5. Attribution and crawl data size
- Attribution: content extracted and condensed from the above sources listed in SOURCES.md.
- Crawl data size (approximate): 15 KB of combined source material extracted.

---

End of FIZZBUZZ_CORE
