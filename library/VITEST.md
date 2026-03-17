NORMALISED EXTRACT:
Overview and core API
- Vitest is a Vite-native testing framework exposing test runner primitives and matchers similar to other JS test frameworks. It provides test() / it() for cases, describe() for suites, lifecycle hooks beforeAll, beforeEach, afterEach, afterAll, and an expect(value) matcher API with standard matchers.

TABLE OF CONTENTS:
1. Installation and invocation
2. Core API signatures
3. Matchers overview
4. Lifecycle hooks
5. Configuration options
6. Running tests and CLI flags

DETAILED CONTENT:
1. Installation and invocation
- Typical run command: vitest --run [test-files]. For CI use the --run flag.
- Vitest integrates with Vite and leverages Vite's transformer pipeline for fast execution.

2. Core API signatures
- test(name: string, fn: Function | async Function): void
- it(name: string, fn: Function | async Function): void (alias)
- describe(name: string, fn: Function): void
- expect(value: any): MatcherChain where MatcherChain provides matcher methods (see section 3).

3. Matchers overview (common)
- toBe(expected): strict equality
- toEqual(expected): deep equality
- toBeTruthy(), toBeFalsy()
- toBeDefined(), toBeUndefined(), toBeNull()
- toContain(item) for arrays/strings
- toHaveLength(number)
- toThrow(error?) for functions that should throw
- spy/mocking matchers available when using Vitest mocking utilities (toHaveBeenCalled, toHaveBeenCalledWith)

4. Lifecycle hooks
- beforeAll(fn), afterAll(fn): setup/teardown run once per suite
- beforeEach(fn), afterEach(fn): setup/teardown per test

5. Configuration options (vitest config object keys)
- test.environment: 'node' | 'jsdom'
- test.globals: boolean (when true, exposes globals like describe/test without imports)
- test.include / test.exclude: glob patterns for tests
- coverage: configuration block for coverage collection
- resolve.alias and Vite config passthrough apply as for Vite

6. Running tests and CLI flags
- CLI: vitest [options] [files]
- Common flags: --run to run tests once (CI), --watch for watch mode in development, --coverage to collect coverage (with configured reporter)

SUPPLEMENTARY DETAILS:
- Import style: tests can import test primitives from 'vitest' when globals are disabled.
- Environment selection affects DOM availability and global APIs.
- Use mock and spy utilities from Vitest for isolated unit tests.

REFERENCE DETAILS (SPEC):
- API signatures (runnable):
  - test(name: string, fn: () => any | Promise<any>): void
  - describe(name: string, fn: () => void): void
  - expect(received: any): MatcherChain
  - beforeEach(fn: () => any | Promise<any>): void
- Configuration object keys: test.environment (string), test.globals (boolean), test.include (array|string), test.exclude (array|string)

DETAILED DIGEST:
Source: https://vitest.dev/
Retrieved: 2026-03-17
Data retrieved: 68.0 KB (HTML)
Extracted technical points: core API signatures, matcher list, lifecycle hooks, key configuration options and CLI flags for running tests.

ATTRIBUTION:
Content extracted and condensed from the Vitest documentation (URL above). Data size obtained during crawling: 68.0 KB.