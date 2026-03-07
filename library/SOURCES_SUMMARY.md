SOURCES_SUMMARY

Table of Contents
1. FizzBuzz: core rules and input validation
2. Number.isInteger: exact semantics and polyfill
3. Array.map: operational semantics and holes
4. RangeError: when to throw and message guidance
5. Node assert: API signatures and usage patterns
6. Vitest: test patterns, commands, and coverage
7. NPM fizzbuzz package: API surface and usage

1. FizzBuzz: core rules and input validation
- Core rules: For each integer n in a sequence starting at 1, output "Fizz" if divisible by 3, "Buzz" if divisible by 5, "FizzBuzz" if divisible by both, otherwise the number itself.
- Deterministic mapping: For integer input n, compute result by checking divisibility in order: (n % 15 === 0) -> "FizzBuzz"; (n % 3 === 0) -> "Fizz"; (n % 5 === 0) -> "Buzz"; else String(n).
- Input validation: Accept only finite integers in the expected range; use Number.isInteger(x) to confirm integer-ness and Number.isFinite for safety. On invalid input, throw RangeError with a clear message indicating expected integer range.
- Edge behavior: Define behavior for zero and negatives explicitly; typical conventions start at 1; if supporting zero allow % rules to apply (0 -> "FizzBuzz").

2. Number.isInteger: exact semantics and polyfill
- Semantics: Returns true only for values of type number that are finite and have no fractional part. Specifically: typeof value === 'number' && isFinite(value) && Math.floor(value) === value.
- Polyfill (specification-equivalent): function isInteger(value) { return typeof value === 'number' && isFinite(value) && Math.floor(value) === value; }
- Edge cases: NaN, Infinity, -Infinity -> false; numeric strings -> false; BigInt -> false.

3. Array.map: operational semantics and holes
- Signature: Array.prototype.map(callback[, thisArg]) -> newArray
- Execution order: Iterate indices from 0 to length-1; for each present element, call callback(currentValue, index, array) and assign result to new array at the same index.
- Sparse arrays: Absent indices (holes) are skipped; resulting array retains holes at corresponding indices unless callback creates value.
- Side effects: callback may mutate source array; the map operation uses the current state of the array at each index when callback is invoked.
- Complexity: O(n) time and O(n) additional space (new array of same length).

4. RangeError: when to throw and message guidance
- Usage: Throw RangeError for numeric argument outside allowed range or invalid length values (e.g., invalid array length, out-of-range indexes, non-integer sizes).
- Construction: throw new RangeError('message describing expected numeric range and received value');
- Best practice: Include expected bounds and received value in message for debugging, e.g., `Expected integer in [1, 100], received: ${x}`.

5. Node assert: API signatures and usage patterns
- Core functions (Node assert module):
  - assert.ok(value[, message]) -> void: throws AssertionError if value is falsy.
  - assert.equal(actual, expected[, message]) -> void: loose equality (==) check.
  - assert.deepEqual(actual, expected[, message]) -> void: deep equality using structural comparison.
  - assert.throws(fn[, error][, message]) -> void: asserts that function throws; `error` can be constructor, RegExp, or validation function.
  - assert.doesNotThrow(fn[, message]) -> void: asserts function does not throw.
- AssertionError properties: name, message, actual, expected, operator, stack.
- Best practice: Use clear messages; prefer strict deep equality assertions for deterministic tests; use assert.throws with exact constructor or matcher to validate error type and message.

6. Vitest: test patterns, commands, and coverage
- Commands:
  - Run tests: npm test -> runs vitest --run tests/unit/*.test.js
  - Run unit tests with coverage: npm run test:unit -> vitest --run --coverage tests/unit/*.test.js
- Test file structure: place unit tests under tests/unit/*.test.js; use describe/it or test blocks and Node assert or expect matchers.
- Coverage: @vitest/coverage-v8 can be enabled via --coverage flag; configure vitest.config.js for thresholds and reporters.
- Best practices: Keep unit tests deterministic, use setup/teardown only when necessary, validate error cases with assert.throws, and isolate side effects.

7. NPM fizzbuzz package: API surface and usage
- Typical package API: export a function that accepts an integer n (or a range) and returns an array or mapping of results following FizzBuzz rules.
- Validation: function should validate input using Number.isInteger and throw RangeError on invalid values.
- Common signatures:
  - fizzbuzz(n) -> returns array of length n with Fizz/Buzz results for 1..n
  - fizzbuzz(start, end) -> returns array for inclusive range or mapping of index->result
- Implementation patterns: generate results via a single pass loop, minimizing allocations by reusing string constants and pushing to an array; avoid per-iteration object allocations.

Supplementary Details
- String constants: const FIZZ = 'Fizz', BUZZ = 'Buzz', FIZZBUZZ = 'FizzBuzz' to avoid repeated allocations.
- Division checks: use modulo operations with integers; ensure operands are integers (use Number.isInteger) to avoid JS fractional behavior.
- Performance: For very large ranges, produce streaming/iterator API instead of full in-memory array to reduce memory pressure.
- Error messages: Standardize messages for easier test assertions and internationalization if needed.

Reference Details (API specifications and signatures)
- Number.isInteger(value): returns boolean. Polyfill: function isInteger(value) { return typeof value === 'number' && Number.isFinite(value) && Math.floor(value) === value; }
- Array.prototype.map(callback, thisArg): returns new array. Callback signature: (currentValue, index, array) => any.
- RangeError(message): constructor takes a message string describing the numeric range violation.
- assert.ok(value, message): throws AssertionError if !value.
- assert.throws(fn, expected, message): expected can be Error constructor, RegExp, or validation function; throws if fn does not throw matching error.
- fizzbuzz(n) -> Array<string|number>: validate n with Number.isInteger and n >= 1; throws RangeError if invalid.

Troubleshooting and Implementation Patterns
- Validation fails: confirm typeof checks and use Number.isFinite to exclude Infinity/NaN.
- Tests failing due to sparse arrays: coerce to dense arrays when comparing or use deepStrictEqual that treats holes appropriately.
- Unexpected non-integer inputs: coerce only when intended; prefer explicit validation and errors rather than silent coercion.
- Performance issues on large n: switch to generator function: function* fizzbuzzGenerator(start=1, end) { for (let i=start;i<=end;i++) yield compute(i); }

Digest
- Source set: Wikipedia Fizz Buzz (rule set), MDN Number.isInteger (semantics & polyfill), MDN Array.map (semantics), MDN RangeError (usage), Node assert docs (API signatures), Vitest guide (commands & patterns), npm fizzbuzz package page (typical API patterns).
- Retrieval date: 2026-03-07
- Extract size: approximately 8 source pages summarized into ~1200 bytes of actionable content.

Attribution
- Crawled sources: https://en.wikipedia.org/wiki/Fizz_buzz; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError; https://nodejs.org/api/assert.html; https://vitest.dev/guide/; https://www.npmjs.com/package/fizzbuzz
- Data size obtained: estimated 8 pages, ~40 KB total content crawled.
