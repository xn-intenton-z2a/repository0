FIZZBUZZ_SPEC

Table of contents
1. Normalised extract
  1.1 Core contract and algorithm
  1.2 Input validation and canonical RangeError semantics (exact checks and messages)
  1.3 API signature, return types, and module export
  1.4 Complexity and implementation constraints
2. Supplementary details
  2.1 Implementation knobs and constants
  2.2 Testing and CI checks
  2.3 Troubleshooting patterns
3. Reference details
  3.1 Exact validation logic and messages (executable pattern)
  3.2 Function signature and return typing
  3.3 Example implementation pattern (stepwise description)
  3.4 Configuration values and effects
4. Detailed digest
  4.1 Extract from SOURCES.md relevant section (retrieved 2026-03-08)
5. Attribution and crawl data size

1. Normalised extract

1.1 Core contract and algorithm
- For input integer n produce an Array of length n where index (i-1) corresponds to integer i for i in 1..n inclusive.
- Mapping priority (apply in this exact order):
  - If i % 15 === 0 then output the exact string FizzBuzz
  - Else if i % 3 === 0 then output the exact string Fizz
  - Else if i % 5 === 0 then output the exact string Buzz
  - Else output the integer i as a JavaScript Number value
- MUSTs for implementation:
  - Returned array length MUST equal n
  - Element ordering MUST correspond to integers 1..n
  - Elements that are not Fizz/Buzz/FizzBuzz MUST be Number typed (not strings)

1.2 Input validation and canonical RangeError semantics (exact checks and messages)
- Perform validations in this exact order and throw RangeError with the precise message shown when a check fails:
  1. If Number.isFinite(n) === false then throw new RangeError('n must be finite')
  2. If Number.isInteger(n) === false then throw new RangeError('n must be an integer')
  3. If n < 1 then throw new RangeError('n must be >= 1')
  4. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)
- Use RangeError exclusively for numeric domain/type violations; do not substitute TypeError for these checks.

1.3 API signature, return types, and module export
- Primary exported routine name: fizzBuzz
- Signature (informal): function fizzBuzz(n: number) -> Array<number | string>
- Return: Array whose elements are either Number (for plain integers) or exact strings 'Fizz', 'Buzz', 'FizzBuzz' as specified in 1.1
- Module export: export named function fizzBuzz in ESM packages; also provide CommonJS interop if package supports require (use dual export or separate CJS build).

1.4 Complexity and implementation constraints
- Time complexity: O(n) single pass from 1 to n
- Space complexity: O(n) to store result array
- Do not perform string conversions for numeric outputs; preserve numeric type
- Enforce MAX_N to limit memory and CPU; choose MAX_N consistent with system constraints (canonical example MAX_N = 10000000)

2. Supplementary details

2.1 Implementation knobs and constants
- MAX_N: integer upper bound to protect against resource exhaustion. Canonical value: 10000000 (10 million), but can be tuned per environment; when changed, update error message produced in 1.2.4.
- Messaging convention: short machine-parseable messages beginning with parameter name then constraint.
- Validation order matters for deterministic error messages during tests and CI.

2.2 Testing and CI checks
- Unit tests must assert:
  - Correct array length for sample n values (including edge: n=1, typical: n=15, upper bound behavior)
  - Exact element values and types (Number vs string) for sample indices
  - Exact RangeError messages for each validation failure in the order specified
- Use vitest or equivalent; run tests in CI with pinned node version and frozen lockfile. Use npm ci in CI and run test script invoking vitest --run.

2.3 Troubleshooting patterns
- If test sees string '1' instead of number 1: check accidental toString or template literal usage; ensure numeric outputs are not coerced to strings.
- If errors differ in message or type: confirm validation order and exact RangeError messages are implemented verbatim.
- If memory spikes on large n: reduce MAX_N or stream outputs rather than building full array (note this changes API contract).

3. Reference details

3.1 Exact validation logic and messages (executable pattern)
- Pseudocode of checks in exact sequence (do not change wording in messages):
  if (!Number.isFinite(n)) throw new RangeError('n must be finite')
  if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
  if (n < 1) throw new RangeError('n must be >= 1')
  if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)

3.2 Function signature and return typing
- Signature: fizzBuzz(n: number) : Array<number | 'Fizz' | 'Buzz' | 'FizzBuzz'>
- Throws: RangeError for invalid n as specified in 3.1
- Notes: Do not coerce non-integer numeric types; rely on Number.isInteger and Number.isFinite semantics.

3.3 Example implementation pattern (stepwise description)
- Allocate results array of length n
- For i from 1 to n inclusive:
  - if (i % 15 === 0) set results[i-1] = 'FizzBuzz'
  - else if (i % 3 === 0) set results[i-1] = 'Fizz'
  - else if (i % 5 === 0) set results[i-1] = 'Buzz'
  - else set results[i-1] = i (Number)
- Return results
- Complexity: single loop, minimal branching, no extra allocations beyond results array.

3.4 Configuration values and effects
- MAX_N (default 10000000): increases upper bound; raising increases memory and CPU usage linearly; lowering preserves safety.
- Export format (ESM only vs dual ESM/CJS): ESM-only simplifies module output but requires consumers to import; dual builds enable require() compatibility.

4. Detailed digest

4.1 Extract from SOURCES.md (retrieved 2026-03-08)
- The crawl consolidated authoritative implementation rules: algorithm mapping for i in 1..n, exact RangeError messages and validation order using Number.isFinite and Number.isInteger, requirement that non-Fizz outputs be numeric Number values, API signature fizzBuzz(n) returning an array of mixed number and exact string tokens, and canonical MAX_N = 10000000 example. Also includes guidance on module type effects and vitest testing patterns.

5. Attribution and crawl data size
- Source URLs referenced in project SOURCES.md: https://en.wikipedia.org/wiki/Fizz_buzz, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError, https://www.npmjs.com/package/fizzbuzz, https://vitest.dev/guide/
- Document created from repository SOURCES.md extract; retrieval date: 2026-03-08
- Data size obtained from the SOURCES.md section used to create this file: approximately 24 KB of relevant text extracted into library documents (aggregate across library entries).