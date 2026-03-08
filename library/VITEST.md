VITEST

Table of contents
1. Normalised extract: actionable CLI and install commands
2. Configuration keys and their effects
3. Test API signatures and matchers (exact signatures, parameters, return types)
4. Test file patterns, lifecycle hooks, and execution modes
5. Coverage configuration and reporters (exact options)
6. Common implementation patterns and examples (plain text, no fences)
7. Troubleshooting and step-by-step fixes
8. Supplementary details: compatibility and environment
9. Reference digest: SOURCES.md extract and retrieval metadata
10. Attribution and data size

1. Normalised extract: actionable CLI and install commands
- Install vitest as a dev dependency: npm install --save-dev vitest
- Install V8 coverage provider: npm install --save-dev @vitest/coverage-v8
- Run tests once (CI-friendly): npx vitest --run
- Run tests with explicit pattern: npx vitest --run tests/unit/*.test.js
- Run with coverage: npx vitest --run --coverage
- Run a single test file: npx vitest tests/unit/main.test.js
- Use package.json script: "test": "vitest --run tests/unit/*.test.js"
- For watch mode during development: npx vitest --watch

2. Configuration keys and their effects
Vitest configuration lives in vitest.config.js, vitest.config.ts or inside package.json under "vitest". Key options and exact effects:
- test.include: Array<string> — glob patterns; files to include in test runs; default: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
- test.exclude: Array<string> — glob patterns; files to exclude; default includes node_modules, dist, build
- test.environment: string — 'node' or 'jsdom'; selects runtime environment used to execute tests. Node provides Node globals; jsdom provides DOM APIs.
- test.globals: boolean — when true exposes describe/it/test/expect as globals; when false import them from 'vitest'
- test.setupFiles: string|Array<string> — module(s) executed before tests; used to configure globals, polyfills, or test setup
- test.setupFilesAfterEnv: string|Array<string> — run after test framework is initialized but before tests
- test.timeout: number — default test timeout in milliseconds for tests and hooks
- test.sequence: object — controls concurrency and global test order (advanced; see vitest docs for fields like maxWorkers)
- coverage.provider: string — 'v8' or 'c8'; selects coverage engine; use 'v8' for @vitest/coverage-v8
- coverage.reporter: Array<string> — reporters, e.g. ['text','lcov','json']
- coverage.include/exclude: Array<string> — file patterns to include/exclude for coverage collection
- coverage.all: boolean — include all matched files even if not required by tests
- resolve.alias: Record<string,string> — alias modules for bundler/resolution during tests

3. Test API signatures and matchers (exact signatures, parameters, return types)
Global test functions (when test.globals = true) or import from 'vitest':
- describe(name: string, fn: () => void | Promise<void>): void
- it(name: string, fn: () => void | Promise<void>): void (alias: test)
- test(name: string, fn: () => void | Promise<void>): void
- beforeAll(fn: () => void | Promise<void>, timeout?: number): void
- afterAll(fn: () => void | Promise<void>, timeout?: number): void
- beforeEach(fn: () => void | Promise<void>, timeout?: number): void
- afterEach(fn: () => void | Promise<void>, timeout?: number): void

Expect API:
- expect(received: any): Expectation
- Expectation has matcher methods that return void or throw on failure. Common matchers and signatures:
  - toBe(expected: any): void — strict equality (===)
  - toEqual(expected: any): void — deep equality
  - toBeDefined(): void
  - toBeUndefined(): void
  - toBeNull(): void
  - toBeTruthy(): void
  - toBeFalsy(): void
  - toContain(item: any): void — for arrays/strings
  - toMatch(regexpOrString: RegExp | string): void — for strings
  - toHaveLength(expected: number): void — for arrays/strings
  - toThrow(error?: string | RegExp | ErrorConstructor): void — for functions that throw
  - resolves / rejects: expect(promise).resolves.toBe(x) (returns a Promise)

Mocking and spies:
- vi.fn(impl?: Function): MockFunction — creates a mock function
- vi.spyOn(object: object, method: string): SpyInstance — replaces method with spy
- vi.mock(modulePath: string, factory?: () => any): void — manual module mock
- vi.unmock(modulePath: string): void
- vi.resetAllMocks(): void
- vi.restoreAllMocks(): void

Return types: most lifecycle and describe/test functions return void; expect returns an Expectation object whose matchers either return void or return a Promise for resolve/reject chains.

4. Test file patterns, lifecycle hooks, and execution modes
- Default discovery: files matching glob patterns '*.{test,spec}.{js,ts,jsx,tsx}' in project tree excluding node_modules and dist
- Parallelization: vitest runs tests in worker threads by default; configure concurrency via --threads flag or test.sequence/maxWorkers in config
- Execution modes:
  - --run : run tests once (use in CI)
  - --watch : rerun on file changes (development)
  - --ui : start interactive UI (if available)
- Lifecycle hook order for a nested describe block:
  - beforeAll (outer), beforeAll (inner), beforeEach (outer), beforeEach (inner), test, afterEach (inner), afterEach (outer), afterAll (inner), afterAll (outer)

5. Coverage configuration and reporters (exact options)
- Provider: 'v8' (recommended) or 'c8'
- Example fields and effects:
  - coverage.provider: 'v8' — uses V8's native coverage; requires @vitest/coverage-v8 devDependency
  - coverage.reporter: ['text','lcov'] — 'text' prints to stdout, 'lcov' writes lcov.info for CI integration
  - coverage.enabled: boolean — when true collects coverage
  - coverage.include: Array<string> — include glob patterns, e.g. ['src/**']
  - coverage.exclude: Array<string> — exclude patterns, e.g. ['tests/**','node_modules']
  - coverage.all: boolean — when true, include all files matched by include even if not required by tests
- Running with coverage: npx vitest --run --coverage --coverageProvider=v8 (CLI flags vary by version; prefer config)

6. Common implementation patterns and examples (plain text)
- Unit test pattern for a pure function fizzBuzz:
  - Arrange: prepare input n
  - Act: call exported function fizzBuzz(n)
  - Assert: expect(result.length).toBe(n); expect(result[2]).toBe('Fizz') etc.
- Use beforeEach to reset shared mutable state between tests
- Use vi.fn() to create spies for dependency injection; assert calls via expect(mock).toHaveBeenCalledWith(args)
- Use setupFiles to set global test utilities (e.g., import { expect } from 'vitest'; globalThis.myUtil = ...)
- For ESM projects (package.json type: module) ensure vitest resolves ESM; use test.environment: 'node' and add resolve.alias or necessary experimental flags if using loaders

7. Troubleshooting and step-by-step fixes
- Problem: tests not found. Fix: verify test.include patterns and that files end with .test.js or .spec.js; check test.exclude for accidental exclusions.
- Problem: globals not available. Fix: set test.globals = true or import { describe, it, expect } from 'vitest' at top of files.
- Problem: coverage missing files. Fix: set coverage.include to match source files and coverage.all = true to include untested files; ensure provider is installed and configured.
- Problem: DOM APIs missing in jsdom. Fix: set test.environment = 'jsdom' and install global DOM polyfills if needed.
- Problem: slow tests due to worker overhead. Fix: run with --threads=false to run in single process, or increase worker size via test.sequence/maxWorkers.

8. Supplementary details: compatibility and environment
- Node requirement: align with repository engines field; vitest supports recent Node LTS versions. For this project engines: node >=24.0.0 — ensure test runner environment meets this.
- TypeScript support: vitest supports .ts test files when TypeScript is configured and tsconfig.json present; install ts-node or use built-in ESM TS handling depending on vitest version.
- Integrations: Playwright, jsdom, and bundlers are supported; configure test.environment and setupFiles accordingly.

9. Reference digest: SOURCES.md extract and retrieval metadata
- SOURCES.md entries used:
  - https://vitest.dev/guide/      (primary source for CLI, config, API signatures, and coverage options)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (module, ESM/CJS behavior affecting test resolution)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (used for input validation examples)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (used for canonical error usage)
  - https://www.npmjs.com/package/fizzbuzz  (package inspection guidance)
  - https://en.wikipedia.org/wiki/Fizz_buzz  (domain rules)
- Retrieval date: 2026-03-08
- Extracted content focuses on runnable CLI commands, config keys, API signatures and concrete troubleshooting steps.

10. Attribution and data size
- Sources and approximate data sizes retrieved during crawl (approximate bytes):
  - https://vitest.dev/guide/  : 6100 bytes
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules : 12000 bytes
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger : 2200 bytes
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError : 1600 bytes
  - https://www.npmjs.com/package/fizzbuzz : 1200 bytes
  - https://en.wikipedia.org/wiki/Fizz_buzz : 7300 bytes
- Total approximate bytes: ~29,400 bytes
- Attribution: content condensed and normalized from the listed sources on retrieval date 2026-03-08.

End of document.