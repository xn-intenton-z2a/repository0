VITEST

Table of contents
- Purpose and quick start
- Test API primitives
- Assertion API (expect)
- Lifecycle hooks and grouping
- Running tests and configuration notes

Purpose and quick start
Vitest is a Vite-native test runner compatible with Jest-like APIs. Typical entry: import { describe, it, expect } from 'vitest'; write tests in tests/unit and run via vitest --run or npm test configured to invoke vitest.

Test API primitives
- describe(name, fn) groups tests. - it(name, fn) or test(name, fn) defines a test. - Async tests return a Promise or accept done callback.

Assertion API (expect)
- expect(value).toBe(expected) (strict equality). - expect(value).toEqual(expected) (deep equality). - expect(fn).toThrow() and expect(promise).rejects.toThrow(). - Matchers mirror Jest/Vitest common set.

Lifecycle hooks and grouping
- beforeAll, afterAll, beforeEach, afterEach available for setup/teardown. - Hooks apply to the current describe block when nested.

Running tests and configuration notes
- CLI: vitest --run --reporter verbose ; package.json scripts typically: "test": "vitest --run tests/unit/*.test.js" - Use vitest.config.js for coverage, environment, or globals. - For DOM tests enable jsdom environment.

Reference details
- Main functions imported from 'vitest' module: describe(name, fn), it(name, fn), test(name, fn), expect(value) -> Expectation

Detailed digest
Source: Vitest guide (https://vitest.dev/guide/) retrieved 2026-03-15. Raw HTML size: 122499 bytes.

Attribution and crawl data
- Vitest docs — Getting started/Guide. Retrieved 2026-03-15. 122499 bytes.
