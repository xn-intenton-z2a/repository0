VITEST

Table of contents:
- Installation and run commands
- Core test API signatures
- Expect API and common matchers
- Assertions for thrown errors
- Test file discovery and CLI flags
- Async tests and lifecycle hooks
- Recommended patterns for fizzBuzz tests
- Detailed digest and retrieval info
- Attribution and data size

NORMALISED EXTRACT
Installation and run
- Install as a dev dependency: npm install --save-dev vitest
- Run tests: npx vitest --run or use npm test if package.json test maps to vitest

Core test API signatures (plain-text)
- test(name, fn) where name is a string and fn is a synchronous or async function returning void or a Promise.
- expect(value) returns an expectation object with matcher methods.
- beforeEach(fn), afterEach(fn) for per-test setup/teardown.

Expect API and common matchers
- toBe(expected) compares by strict equality (===)
- toEqual(expected) compares by deep equality
- toStrictEqual(expected) compares by strict deep equality including types
- toBeTruthy(), toBeFalsy(), toBeNull(), toBeUndefined()
- toBeGreaterThan(number), toBeLessThan(number)
- toContain(item) for arrays or strings

Assertions for thrown errors
- To assert a function throws: expect(() => fn()).toThrow(ErrorConstructorOrMessage)
- To assert async throw: await expect(asyncFn).rejects.toThrow(ErrorConstructorOrMessage) (async matcher pattern supported)

Test file discovery and CLI flags
- By default vitest finds files matching patterns; use --run to execute once in CI.
- Use --coverage or configure coverage provider (e.g., @vitest/coverage-v8) to collect coverage data.

Async tests and lifecycle hooks
- test can be async: test('async', async () => { await something(); expect(...).toBe(...) })
- Use beforeAll/afterAll for global fixtures and beforeEach/afterEach for per-test fixtures.

Recommended patterns for fizzBuzz tests (mission-aligned)
- Unit tests for fizzBuzzSingle: assert exact returns for sample inputs: 3 -> Fizz, 5 -> Buzz, 15 -> FizzBuzz, 7 -> "7".
- Unit tests for fizzBuzz: assert fizzBuzz(15) returns 15-element array with correct trailing element "FizzBuzz" and fizzBuzz(0) returns []
- Edge-case tests: non-integer input should cause TypeError assertion, negative input should cause RangeError assertion.
- Use explicit expect(fn).toThrow(TypeError) and expect(fn).toThrow(RangeError) to ensure correct error types.

DETAILED DIGEST
Extracted technical content retrieved: 2026-03-22
- The Vitest guide documents installation, test and expect APIs, matchers, lifecycle hooks, and CLI options appropriate for implementing unit tests for the project.

ATTRIBUTION AND CRAWL SIZE
Source: https://vitest.dev/guide/
Retrieved: 2026-03-22
Bytes downloaded during crawl: 113697
