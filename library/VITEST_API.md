TITLE: VITEST_API

Table of contents:
1. Normalised extract (core API signatures and behaviour)
2. Supplementary details (runner modes, config, common flags)
3. Reference details (matcher list, mocking API signatures, lifecycle hooks)
4. Running tests in this repo
5. Digest (source, retrieval date, bytes retrieved)
6. Attribution

1) Normalised extract (core API signatures and behaviour)
- Test registration:
  - test(name: string, fn: function) registers a test; returns a promise if fn is async.
  - it(...) is an alias of test(...); describe(name, fn) groups tests.
- Lifecycle hooks:
  - beforeAll(fn), afterAll(fn), beforeEach(fn), afterEach(fn) accept synchronous or async functions.
- Assertions (expect API):
  - expect(value).toBe(expected) for strict equality (===).
  - expect(value).toEqual(expected) for deep equality.
  - expect(fn).toThrow() checks that the function throws; supports matching by message or error type.
- Running modes: vitest (interactive/watch) and vitest --run for single-run CI mode.

2) Supplementary details (runner modes, config, common flags)
- Use vitest --run to execute tests once (CI). Use default vitest to run in watch/dev mode.
- Coverage: enable via vitest --coverage or configure coverage provider (e.g., @vitest/coverage-v8) in vitest.config.js.
- Test file selection: vitest respects include/exclude globs in configuration; the repo uses script: "vitest --run tests/unit/*.test.js" per package.json.

3) Reference details (matcher list, mocking API signatures, lifecycle hooks)
- Common matchers: toBe, toEqual, toStrictEqual, toBeNull, toBeUndefined, toBeTruthy, toBeFalsy, toContain, toHaveLength, toMatch (regex/string), toBeGreaterThan, toBeLessThan.
- Mocking API (vi):
  - vi.fn(implementation?) -> returns a mock function.
  - vi.mock(moduleName, factory?) -> mock an imported module (factory returns mocked exports).
  - vi.spyOn(object, methodName) -> create a spy wrapper around existing method; returns a mock function reference that can be restored.
  - vi.clearAllMocks(), vi.resetAllMocks(), vi.restoreAllMocks() for cleanup between tests.
- Lifecycle hooks signatures: beforeEach(fn: () => void|Promise), afterEach(fn), beforeAll(fn), afterAll(fn).
- Test selection helpers: test.only(name, fn), test.skip(name, fn) to focus or skip tests.

4) Running tests in this repo
- Use npm test (script: vitest --run tests/unit/*.test.js) for CI-style runs.
- Use npx vitest or vitest locally for watch mode and interactive failure debugging.
- Place unit tests under tests/unit/ and name files *.test.js to match common patterns; the repo uses ESM imports so tests should import named exports with file extensions when referencing local modules.

5) Digest
- Source URL: https://vitest.dev/api/
- Retrieval date: 2026-03-21
- Bytes retrieved during crawl: 214964

6) Attribution
- Condensed from the official Vitest API documentation retrieved 2026-03-21 (214964 bytes). Vitest: https://vitest.dev/
