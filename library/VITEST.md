VITEST

1) Normalised extract

Table of contents:
- Running tests
- Test API
- Assertions for errors and values
- File layout and naming
- Troubleshooting

Running tests:
- The repository's package.json defines test scripts; run tests with npm test which executes vitest --run tests/unit/*.test.js.
- Run unit tests with coverage using npm run test:unit.

Test API (essential):
- Import or use globals: describe(name, fn), it(name, fn) / test(name, fn), expect(value).matcher()
- Common matchers used for this mission: toEqual(expected), toBe(expected), toThrow(ErrorConstructor), toThrow(/message regex/)

Assertions for errors and values (exact patterns recommended):
- Assert that a call throws a specific Error subclass: expect(() => fizzBuzz(-1)).toThrow(RangeError)
- Assert that a call throws for non-integer input: expect(() => fizzBuzz(2.5)).toThrow(TypeError)
- Assert array equality: expect(fizzBuzz(15)).toEqual(["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"])

File layout and naming:
- Place unit tests in tests/unit/, e.g., tests/unit/main.test.js
- Name test files with .test.js to match the npm test glob used by the project

Troubleshooting:
- If toThrow assertions fail because of message mismatch, use toThrow(/expected message regex/) or check instanceof in a manual try/catch in the test.
- Ensure vitest runs under ESM if the project uses ES modules (package.json type: module) — vitest supports ESM.
- If coverage or run patterns differ locally, inspect package.json scripts and adjust the glob or command accordingly.

2) Supplementary details
- Vitest supports both inline import of test helpers and global functions; the example patterns above are compatible with either approach depending on test runner configuration.
- Use clear, deterministic test inputs and assert both return values and thrown error types to meet acceptance criteria.

3) Reference details
- Key API elements: describe(name, fn), it(name, fn), expect(value).toEqual(expected), expect(fn).toThrow(ErrorConstructor)
- Runner commands: npm test -> vitest --run tests/unit/*.test.js; npm run test:unit -> vitest --run --coverage tests/unit/*.test.js

4) Detailed digest
- Source: https://vitest.dev/guide/
- Retrieved: 2026-03-21
- Data size fetched: 113697 bytes
- Extracted content: Vitest guide documents the test runner commands, global helpers, matchers, and patterns for asserting thrown errors and equality useful for the FizzBuzz unit test suite.

5) Attribution
- Attribution: Vitest project documentation; retrieved 2026-03-21; raw HTML captured during crawl: 113697 bytes.
