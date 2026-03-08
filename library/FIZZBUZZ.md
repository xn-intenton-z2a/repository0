FIZZBUZZ

Table of contents
1. Normalised extract
   1.1 Function signature and return type
   1.2 Deterministic mapping rules (priority order)
   1.3 Validation and error contracts
   1.4 Performance and complexity
2. Detailed implementation instructions
   2.1 Input validation steps and exact error messages
   2.2 Core loop algorithm (explicit stepwise procedure)
   2.3 Return value shape and types
   2.4 Module export and packaging patterns for Node ESM
   2.5 CLI and npm packaging checklist
3. Supplementary details
   3.1 Test harness and Vitest integration
   3.2 CI reproducible install and pinning
   3.3 Edge-case handling and numeric limits
4. Reference details (exact API signatures, parameters, errors)
5. Troubleshooting and verification steps
6. Digest and retrieval metadata
7. Attribution and crawl data size

1. Normalised extract

1.1 Function signature and return type
fizzBuzz(n: number) -> Array<string | number>
- Parameter: n must be a Number value (IEEE-754 double) representing the positive integer count of items to produce.
- Return: an array of length n where element at index (i-1) corresponds to integer i and is either the exact string Fizz, Buzz, FizzBuzz or the numeric value i.

1.2 Deterministic mapping rules (priority order)
For each integer i from 1 to n (inclusive), apply the following in exact priority order:
- If i modulo 15 equals 0 then produce the exact string FizzBuzz
- Else if i modulo 3 equals 0 then produce the exact string Fizz
- Else if i modulo 5 equals 0 then produce the exact string Buzz
- Else produce the numeric value i as a native Number type

1.3 Validation and error contracts
- Validate n is of type Number: use Number.isInteger(n) behaviour to determine integerness (false for non-number types).
- Validate n is finite: Number.isFinite(n) must be true.
- Validate bounds: n must be >= 1 and, if an upper bound is required, n must be <= MAX_N (caller-defined). When a check fails, throw RangeError with one of the exact messages below.
- Exact RangeError messages to use (machine-parseable):
  - "n must be an integer"
  - "n must be finite"
  - "n must be >= 1"
  - "n must be <= <MAX_N>" (replace <MAX_N> with the numeric bound)

1.4 Performance and complexity
- Time complexity: O(n) across integers 1..n with constant work per element.
- Space complexity: O(n) for the returned array; generator/stream variants may be used to achieve O(1) additional memory at the cost of a streaming API.

2. Detailed implementation instructions

2.1 Input validation steps and exact error messages
1. If Type(n) is not Number, or Number.isInteger(n) === false, throw RangeError with message: "n must be an integer".
2. If Number.isFinite(n) === false, throw RangeError with message: "n must be finite".
3. If n < 1, throw RangeError with message: "n must be >= 1".
4. If an upper limit MAX_N is enforced and n > MAX_N, throw RangeError with message: "n must be <= " + MAX_N.

2.2 Core loop algorithm (explicit stepwise procedure)
1. Allocate an array result of length n (or prepare a generator/yield mechanism).
2. For i = 1 to n inclusive:
   a. If i % 15 === 0, push the string FizzBuzz into result.
   b. Else if i % 3 === 0, push the string Fizz into result.
   c. Else if i % 5 === 0, push the string Buzz into result.
   d. Else push the numeric value i into result.
3. Return result.
Notes: Apply modulo checks in the given order to preserve exact mapping semantics and test determinism.

2.3 Return value shape and types
- The resulting array must have length exactly n.
- Non-Fizz/Buzz/FizzBuzz entries must be numeric Number typed values, not strings.
- Fizz, Buzz, FizzBuzz must be exact ASCII strings: Fizz, Buzz, FizzBuzz (case-sensitive).

2.4 Module export and packaging patterns for Node ESM
- If package.json contains "type": "module", author modules as ECMAScript modules using named exports.
- Recommended export signature: export function fizzBuzz(n) { ... } where fizzBuzz is the named export; also consider export default fizzBuzz if the package is single-purpose.
- File extensions: use .js for ESM when type=module; .mjs may be used to avoid ambiguity.
- Consumers may import using: import { fizzBuzz } from 'your-package'; or import fizzBuzz from 'your-package' if default-exported.

2.5 CLI and npm packaging checklist
- package.json metadata: ensure name, version, description are present and semver pinned for releases.
- For CLI entry, set bin field to point to a small wrapper that invokes the same implementation with validated parsed arguments.
- CI: pin dev dependency versions and use lockfile-driven installs (npm ci) for reproducible builds.
- Security: audit package before publishing (npm audit / npm view / tarball inspection).

3. Supplementary details

3.1 Test harness and Vitest integration
- Test files should be named with .test. or .spec. (example: fizz.test.js) and placed under tests/unit/ for existing repo patterns.
- Use vitest CLI: vitest --run tests/unit/*.test.js or npm test script as defined in package.json.
- Test cases to include (deterministic examples):
  - fizzBuzz(1) -> [1]
  - fizzBuzz(3) -> [1, 2, Fizz]
  - fizzBuzz(5) -> [1, 2, Fizz, 4, Buzz]
  - fizzBuzz(15) -> element at index 14 must be FizzBuzz
  - boundary validation: fizzBuzz(0) throws RangeError "n must be >= 1"
  - type validation: fizzBuzz(3.5) throws RangeError "n must be an integer"

3.2 CI reproducible install and pinning
- Use npm ci in CI to enforce lockfile usage.
- Pin dependency ranges for critical builds and use exact install (fizzbuzz@x.y.z) for deterministic results.

3.3 Edge-case handling and numeric limits
- Decide and document MAX_N if needed to avoid huge allocations; validate and throw the exact RangeError message above when exceeded.
- Note IEEE-754 precision: values greater than Number.MAX_SAFE_INTEGER may behave oddly; if expecting > 2^53, consider BigInt-based variants and document API differences.

4. Reference details (exact API signatures, parameters, errors)
- Signature: fizzBuzz(n: number) -> Array<string | number>
- Errors thrown (exact constructors and messages):
  - throw new RangeError('n must be an integer') when Number.isInteger(n) === false
  - throw new RangeError('n must be finite') when Number.isFinite(n) === false
  - throw new RangeError('n must be >= 1') when n < 1
  - throw new RangeError('n must be <= ' + MAX_N) when n > MAX_N (if MAX_N enforced)
- Export recommendation: in ESM package.json type=module use "export function fizzBuzz(n) { ... }"; for default export use "export default fizzBuzz".

5. Troubleshooting and verification steps
- If tests fail for mapping: check modulo evaluation order (15 before 3 and 5).
- If values appear as strings for numeric entries: ensure non-Fizz/Buzz entries are pushed as numbers, not as stringified values.
- If length mismatch: ensure loop iterates inclusive to n and allocation logic returns array length n.
- For environment mismatch (CommonJS vs ESM): verify package.json "type" and import/require usage; use .mjs for ESM when necessary.

6. Digest and retrieval metadata
- Source sections extracted from SOURCES.md on 2026-03-08.
- Sources referenced: Wikipedia Fizz Buzz, MDN JavaScript Modules, MDN Number.isInteger, MDN RangeError, npm package fizzbuzz, Vitest guide.
- Crawl counts: 6 source URLs; total retrieved text approx 18 KB (aggregate of referenced docs).

7. Attribution and crawl data size
- Attribution: content consolidated from the following URLs retrieved 2026-03-08:
  - https://en.wikipedia.org/wiki/Fizz_buzz
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - https://www.npmjs.com/package/fizzbuzz
  - https://vitest.dev/guide/
- Aggregate data size during crawl: approx 18 KB total text
