NORMALISED EXTRACT

Table of contents
- Running tests
- Common assertions and patterns
- Testing error conditions
- Test file organisation for this repo

Running tests
- package.json exposes test script: vitest --run tests/unit/*.test.js. Use npm test to run unit tests.
- For single-file runs use npx vitest <path> or configure test runner in CI similarly.

Common assertions and patterns
- Import helpers from vitest: import { describe, it, expect } from 'vitest'.
- Use expect(actual).toEqual(expected) for deep equality of arrays and objects.
- Use expect(value).toBe(expected) for strict equality comparison when appropriate.

Testing error conditions
- Use expect(() => fn()).toThrow(ErrorConstructor) to assert thrown error types (e.g., RangeError).
- Use expect(() => fn()).toThrow('message substring') to assert specific error messages.

Test file organisation for this repo
- Place unit tests in tests/unit/ and name them *.test.js; package.json test script already matches tests/unit/*.test.js.
- For fizzBuzz, add tests covering: normal output for 1..n, fizzBuzzSingle for 3,5,15, non-integer input TypeError, negative input RangeError, n=0 -> [].

SUPPLEMENTARY DETAILS
- Vitest supports running with coverage and CI integration; ensure tests are deterministic and not environment-dependent.
- Use toEqual for comparing arrays exactly; toStrictEqual is unnecessary for simple primitives in arrays but acceptable.

REFERENCE DETAILS
- Common matchers:
  - expect(value).toEqual(expected)
  - expect(value).toBe(expected)
  - expect(fn).toThrow(ErrorConstructor)
  - expect(fn).toThrow('message')
- Running in CI: npm test calls vitest --run which runs tests once and exits (non-watch mode).

DETAILED DIGEST
- Vitest guide documents API for describe/it/expect, matchers, and running tests; it is the recommended test runner for fast, Vite-compatible unit testing.
- Retrieval date: 2026-03-21
- Data size obtained during crawling: 113697 bytes

ATTRIBUTION
- Source: https://vitest.dev/guide/
- Retrieved: 2026-03-21
- Content-Length (reported by server): 113697 bytes
