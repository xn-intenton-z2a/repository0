VITEST

Table of contents
1. Normalised extract
2. Supplementary details
3. Reference details
4. Detailed digest and retrieval metadata
5. Attribution and data size

1. Normalised extract

Installation and project setup
- Add Vitest as a dev dependency: npm install --save-dev vitest@^4 (or yarn add -D vitest).
- Optional coverage helper: install @vitest/coverage-v8 when using v8 provider: npm install --save-dev @vitest/coverage-v8.
- Recommended CI flow: use lockfile installs (npm ci) then run the test script (npm test) which maps to vitest CLI.
- Common package.json scripts:
  - "test": "vitest --run --reporter=dot"
  - "test:coverage": "vitest --run --coverage"

CLI invocation and common flags
- Usage: vitest [files/globs] [--options]
- Important flags and types:
  - --run (boolean) : run tests once and exit (CI-friendly).
  - --watch (boolean) : start watch mode and re-run affected tests.
  - --config <path> (string) : use specified vitest config file (default: vitest.config.js/ts).
  - --coverage (boolean) : enable coverage collection per config.
  - --reporter <name|string[]> : select reporter(s) (e.g., dot, verbose, json).
  - --environment <node|jsdom|string> : set test environment.
  - --testNamePattern <string> : run tests whose names match the pattern.
  - --threads / --no-threads (boolean) : enable/disable worker threads.
  - --update / -u (boolean) : update snapshots.

Configuration (vitest.config.js / vitest.config.ts) - actionable keys
- defineConfig({ test: { ... }, coverage: { ... }, reporters: [...] }) - export the configuration at project root.
- test.include: string[] - glob patterns included by test runner. Default examples: ["**/*.test.*", "**/*.spec.*"].
- test.exclude: string[] - globs excluded (node_modules default).
- test.environment: 'node' | 'jsdom' | string - runtime environment for tests.
- test.globals: boolean - when true, provide globals (describe, test, expect) without imports.
- test.threads: boolean - enable worker threads for parallel file execution.
- test.isolate: boolean - isolate each file's environment instance.
- test.setupFiles: string[] - synchronous setup modules executed before tests.
- test.setupFilesAfterEnv: string[] - modules run after environment init (for custom matchers).
- test.deps.inline: string[] - dependency patterns to force inline transform (Vite integration).
- test.testTimeout: number - per-test timeout in milliseconds.
- coverage.provider: 'v8' | 'c8' - coverage provider implementation.
- coverage.reporter: string[] - reporters to produce (e.g., ['text','lcov']).
- coverage.include / coverage.exclude: glob(s) to control coverage scope.
- coverage.all: boolean - collect coverage for all files, not just those touched by tests.

Runtime API and utilities
- Test structure and lifecycle:
  - describe(name: string, fn: () => void): void
  - it(name: string, fn: () => void | Promise<any>, timeout?: number): void
  - test(...) is alias of it.
  - beforeAll(fn: () => void | Promise<any>, timeout?: number): void
  - afterAll(fn: () => void | Promise<any>, timeout?: number): void
  - beforeEach(fn: () => void | Promise<any>, timeout?: number): void
  - afterEach(fn: () => void | Promise<any>, timeout?: number): void
  - test.concurrent(name, fn): run test concurrently when appropriate
  - describe.each(table)(name, fn) and test.each(table)(name, fn): parameterized tests
- Assertion API (expect):
  - expect(received).toBe(expected): void
  - expect(received).toEqual(expected): void
  - expect(received).toStrictEqual(expected): void
  - expect(received).toBeNull(): void
  - expect(received).toBeUndefined(): void
  - expect(received).toBeTruthy(): void
  - expect(received).toContain(item): void
  - expect(received).toHaveLength(n: number): void
  - expect(received).toMatch(regexpOrString: RegExp|string): void
  - expect(fn).toThrow(error?: string|RegExp|Error): void
  - Promise helpers: expect(promise).resolves/ rejects chaining for async assertions
- Mocks and spies (vi namespace):
  - vi.fn(impl?: Function): MockInstance — callable mock with mock.calls and mock.results recorded
  - vi.spyOn(object, methodName): Spy — spies on existing method and can restore original
  - vi.mock(moduleId, factory?, options?): void — hoisted module mocking; vi.importActual to import real module inside mock factory
  - vi.clearAllMocks(): void, vi.resetAllMocks(): void, vi.restoreAllMocks(): void
  - Timer utilities: vi.useFakeTimers(), vi.useRealTimers(), vi.advanceTimersByTime(ms: number)

Snapshot testing
- expect(value).toMatchSnapshot([name?]) writes or compares snapshot files stored adjacent to test file in __snapshots__ or similar.
- Inline snapshots supported via expect(value).toMatchInlineSnapshot(optionalSnapshotString)
- Update snapshots with CLI flag: --update or -u

Test selection and file patterns
- Test discovery obeys test.include/test.exclude or CLI file glob args.
- Use standard glob syntax: e.g., tests/**/*.test.js or **/*.spec.ts.
- Narrow runs via --testNamePattern or passing explicit file/glob to CLI.

Integrations and environment notes
- Vite integration: Vitest leverages Vite's transform pipeline; configure deps.inline to include specific dependencies that must be transformed.
- When using TypeScript config files (vitest.config.ts), ensure execution environment supports TS (esbuild/ts-node via Vite toolchain).
- For DOM-related tests, set environment: 'jsdom'; for server-only tests prefer 'node'.

Best practices and performance
- Use threads:true for parallel file execution on CI when tests are isolated; set threads:false for shared global state tests.
- prefer isolation (test.isolate true) and explicit teardown to avoid flaky tests.
- For coverage, provider 'v8' is faster for modern Node and recommended if available.
- Limit expensive fixtures and I/O in unit tests; prefer mocks and lightweight factories.

2. Supplementary details

Config resolution and load order
- Vitest resolves configuration from vitest.config.js, vitest.config.ts, or the "vitest" field in package.json at repository root.
- CLI --config overrides default resolution.
- When using TS-config, project must include necessary transform tooling via Vite/tsserver or esbuild pipeline.

Watch mode and incremental runs
- Watch mode re-runs tests matching changed files; initial run may execute only relevant tests unless --watchAll is requested.
- File watchers respect include/exclude globs and Vite's dependency graph; changes to dependencies may trigger broader re-runs.

Coverage specifics
- v8 provider collects coverage from V8 engine exposing coverage data; lcov reporter emits lcov.info usable by CI and coverage services.
- Ensure coverage.include covers source files; coverage.all true required to include untouched files.

3. Reference details

CLI flags (parameter types)
- --run: boolean
- --watch: boolean
- --config <path>: string
- --coverage: boolean
- --reporter <name|names>: string | string[]
- --environment <node|jsdom>: string
- --testNamePattern <string>: string (RegExp or substring)
- --threads / --no-threads: boolean
- --update / -u: boolean

Configuration schema (typed shape)
- type VitestConfig = {
  test?: {
    include?: string[]
    exclude?: string[]
    environment?: string
    globals?: boolean
    threads?: boolean
    isolate?: boolean
    setupFiles?: string[]
    setupFilesAfterEnv?: string[]
    deps?: { inline?: string[] }
    testTimeout?: number
    hookTimeout?: number
  }
  coverage?: {
    provider?: 'v8' | 'c8'
    reporter?: string[]
    include?: string[]
    exclude?: string[]
    all?: boolean
    reportsDirectory?: string
    statements?: number
    branches?: number
    functions?: number
    lines?: number
  }
  reporters?: Array<string | [string, Record<string, unknown>]>
}

Key API signatures (selected)
- defineConfig(cfg: Record<string, any>): Record<string, any>
- describe(title: string, fn: () => void): void
- test(title: string, fn: () => void | Promise<any>, timeout?: number): void
- beforeEach(fn: () => void | Promise<any>, timeout?: number): void
- expect(value: any): ExpectMatchers
- ExpectMatchers.toBe(expected: any): void
- vi.fn(impl?: Function): MockInstance
- vi.mock(moduleId: string, factory?: Function | Record<string, any>, options?: { virtual?: boolean }): void
- vi.spyOn(obj: Record<string, any>, method: string): SpyInstance

4. Detailed digest and retrieval metadata
- Source URL: https://vitest.dev/guide/
- Retrieval date: 2026-03-08
- Extracted sections: Installation, CLI, Configuration, Test API, Assertions, Mocking, Snapshots, Coverage, Troubleshooting

5. Attribution and data size
- Attribution: Vitest official documentation at https://vitest.dev/guide/ (Vitest project)
- Data size obtained during crawling: approximately 48 KB (extracted text size, approximate)
