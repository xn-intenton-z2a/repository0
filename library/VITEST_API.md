VITEST_API

NORMALISED EXTRACT

Table of contents
1. CLI and configuration
2. Test structure and lifecycle hooks
3. Global test APIs and signatures
4. Expect matchers and method signatures
5. Mocking API (vi) signatures and behaviors
6. Coverage and reporters (high-level options)

1. CLI and configuration
- CLI invocation: vitest or via npm scripts (e.g., "vitest --run tests/unit/*.test.js"). Common flags: --run (run once), --watch (watch mode), --coverage (enable coverage), --reporter <name>.
- Configuration file: vitest.config.js / vitest.config.ts exporting defineConfig({ test: { /* options */ } }) or module.exports for CJS. Important test options (exact keys):
  - test.environment: 'node' | 'jsdom' | custom
  - test.include / test.exclude: glob patterns or arrays
  - test.globals: boolean (if true, inject global test APIs)
  - test.setupFiles: string|array of modules to run before tests
  - test.coverage: object with coverage options when using coverage providers
  - test.testTimeout: number (ms)

2. Test structure and lifecycle hooks
- describe(name: string, fn: () => void | Promise<void>): Group tests. Can be nested.
- it(name: string, fn: () => any | Promise<any>): Define an individual test. alias: test(name, fn).
- Lifecycle hooks and signatures:
  - beforeAll(fn: () => any | Promise<any>)
  - afterAll(fn: () => any | Promise<any>)
  - beforeEach(fn: () => any | Promise<any>)
  - afterEach(fn: () => any | Promise<any>)
- Each hook can be async (return Promise) or call done-style when using callback patterns but prefer returning Promise or using async/await.

3. Global test APIs and signatures
- expect(actual): Expectation object with matchers. Signature: expect<T>(actual: T) -> Expect<T>
- expect.extend(matchers): Add custom matchers; matchers are functions receiving actual and expected; return { pass: boolean, message: () => string }.
- expect.objectContaining, expect.arrayContaining etc. (matcher families) mirror Jest's API closely.

4. Expect matchers and method signatures (common)
- toBe(expected): strict equality (===)
- toEqual(expected): structural deep equality
- toBeTruthy()/toBeFalsy(): truthiness assertions
- toThrow([expected? | matcher?]): assert that function throws; can provide error class, regex, or string
- toBeCalled()/toHaveBeenCalledTimes(n)/toHaveBeenCalledWith(...args): mock invocation assertions
- toContain / toHaveLength / toMatch for strings and arrays
- Matcher chain: expect(actual).not.toBe(...)

5. Mocking API (vi) signatures and behaviors
- vi.fn(implementation?): returns a mock function with properties:
  - mock.calls: Array of call argument arrays
  - mock.results: Array of results per call
- vi.spyOn(object, methodName): spies on object[methodName] and returns a mock function; signature: vi.spyOn<T, K extends keyof T>(obj: T, method: K)
- vi.mock(modulePath, factory?): mocks module imports; signatures vary with ESM/CJS; mock replacement must export same shape as original.
- vi.resetAllMocks(), vi.clearAllMocks(), vi.restoreAllMocks(): reset/clear/restore global mocks across tests.

6. Coverage and reporters (high-level)
- Coverage provider configuration: test.coverage.provider (e.g., 'v8' when using @vitest/coverage-v8), test.coverage.reporter: array of reporters (['text','lcov'])
- Reporters configured via CLI or vitest config; built-in reporters include 'default' and 'verbose'.

SUPPLEMENTARY DETAILS

- Type signatures (informal):
  - describe(name: string, fn: () => void | Promise<void>) => void
  - it(name: string, fn: () => any | Promise<any>) => void
  - expect<T>(actual: T) => Expect<T> where Expect<T> exposes matcher methods returning void or throwing on failure
  - vi.fn(impl?: (...args: any[]) => any) => MockFunction
  - vi.spyOn(obj: object, method: string) => MockFunction
- Global injection: when test.globals is true, API functions (describe, it, expect, vi, beforeEach, etc.) are available globally; otherwise import from 'vitest'.

REFERENCE DETAILS

- Exact config option keys (core):
  - test: {
      environment?: 'node' | 'jsdom' | string,
      globals?: boolean,
      include?: string | string[],
      exclude?: string | string[],
      setupFiles?: string | string[],
      testTimeout?: number,
      coverage?: { provider?: string, reporter?: string[] }
    }
- Commonly used import signatures:
  - import { describe, it, expect, beforeEach, vi } from 'vitest'
- Mock API specifics:
  - const mock = vi.fn((...args) => returnValue)
  - vi.spyOn(obj, 'method').mockImplementation(() => value)
  - vi.mock('module', () => ({ default: mockedDefaultExport, named: () => {} }))
- Expect matchers: Provide the full list at the source; above are the most used. Use expect.extend to add custom matcher functions: expect.extend({ toBeWithinRange(received, floor, ceiling) { const pass = received >= floor && received <= ceiling; return { pass, message: () => pass ? '...' : '...' } } })

DETAILED DIGEST

Source sections: https://vitest.dev/guide/ and https://vitest.dev/api/
Retrieved: 2026-03-07
Extracted technical content: CLI flags and their effect, vitest.config test options and exact keys, function signatures for describe/it/expect, matcher patterns and common names, mocking API (vi) signatures and lifecycle reset helpers, coverage configuration keys.

ATTRIBUTION
- Sources: Vitest Guide and API (vitest.dev)
- Retrieved: 2026-03-07
- Data size obtained during crawl: not recorded
