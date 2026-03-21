VITEST_GUIDE

TABLE OF CONTENTS
- Normalised extract: test patterns
- Running tests and scripts
- Expect API reference signatures
- Assertions for errors and values
- File locations and naming conventions
- Detailed digest (retrieved content)
- Attribution and data size

NORMALISED EXTRACT: TEST PATTERNS
- Vitest provides describe/it/test blocks and the expect assertion API.
- Typical assertions used for this mission:
  - expect(value).toBe(expected)    -> strict equality
  - expect(value).toEqual(expected) -> deep equality
  - expect(() => fn()).toThrow(ErrorConstructor) -> assert a thrown error of given type
  - expect(array).toHaveLength(n) -> array length match

RUNNING TESTS AND SCRIPTS
- Package.json in this repo defines test: vitest --run tests/unit/*.test.js (use npm test to run unit tests as configured).
- Use --coverage when needed: npm run test:unit (project script) runs coverage.

EXPECT API REFERENCE (signatures)
- expect(received).toBe(expected): void
- expect(received).toEqual(expected): void
- expect(fn).toThrow(error?: string|RegExp|Function|Error): void
- expect(received).toHaveLength(length: number): void

ASSERTIONS FOR ERRORS AND EDGE CASES
- To assert that a function throws a TypeError: expect(() => fn()).toThrow(TypeError)
- To assert empty array output: expect(fizzBuzz(0)).toEqual([])
- To assert exact string: expect(fizzBuzzSingle(3)).toBe('Fizz')

FILE LOCATIONS AND NAMING
- Unit tests belong in tests/unit/ and follow pattern *.test.js; vitest matches tests/unit/*.test.js per package.json.
- Use clear test case names to cover both normal operation and edge cases (zero input, negative input, non-integer input).

DETAILED DIGEST (crawled section)
- Vitest documentation explains test structure, expect API, and examples for toThrow and equality assertions; use these APIs for all unit tests required by mission.
- Retrieved: 2026-03-21
- Data size obtained: 113697 bytes

ATTRIBUTION
- Source: https://vitest.dev/guide/
- Bytes fetched: 113697
