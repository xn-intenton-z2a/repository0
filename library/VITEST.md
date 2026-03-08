VITEST

Table of contents
1. Normalised extract
2. Focused table of contents (topics covered)
3. Detailed technical items
  3.1 Installation and CLI usage
  3.2 Test file discovery and naming
  3.3 Test API surface and lifecycle hooks
  3.4 Expect API (matchers) and signatures
  3.5 Mocking API (vi) and signatures
  3.6 Configuration (vitest.config) options and effects
  3.7 Coverage configuration and providers
  3.8 Projects and multi-config runs
  3.9 Common troubleshooting steps and fixes
4. Supplementary details (implementation knobs)
5. Reference details (exact signatures, parameters, returns, config examples)
6. Detailed digest (source and retrieval metadata)
7. Attribution and data size

1. Normalised extract
Actionable, implementation-focused details from the Vitest guide and supporting MDN references necessary to set up, configure, author, run, and troubleshoot unit tests in Node.js/ESM projects used by the mission.
- Installation: add vitest as a devDependency (npm install -D vitest) and install an appropriate coverage provider when collecting coverage (e.g., @vitest/coverage-v8).
- CLI: vitest supports interactive watch mode (default), single-run (--run), coverage (--coverage) and custom config (--config <file>); integrate via package.json scripts for CI.
- Config: export default defineConfig({ test: { include, exclude, environment, globals, threads, setupFiles, coverage } }) from 'vitest/config'; supported config file extensions: .js, .mjs, .cjs, .ts, .cts, .mts.
- Discovery: test.include controls file discovery (glob strings). Default includes filenames containing .test. or .spec.; explicit include patterns recommended for CI.
- API: import { describe, it, test, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'. test/it accept optional timeout; hooks accept sync or async functions.
- Matchers: expect(value) returns Matchers exposing toBe, toEqual, toStrictEqual, toContain, toMatch, toThrow, resolves/rejects helpers for promises.
- Mocks: vi.fn(), vi.spyOn(), vi.mock(), vi.clearAllMocks(), vi.resetAllMocks(), vi.restoreAllMocks(), vi.useFakeTimers(), vi.useRealTimers().
- Environment: test.environment controls runtime globals and DOM availability ('node' | 'jsdom' | 'happy-dom'); set explicit environment in config for deterministic behavior.
- Coverage: configure coverage.provider (e.g., 'v8'), coverage.reporter (['text','lcov','html']), include/exclude globs; CLI flag --coverage triggers collection.
- ESM considerations: align package.json "type" with module files (.js treated as ESM when "type":"module"); use .cjs/.mjs to force CJS/ESM when needed.

2. Focused table of contents (topics covered)
- Installation and lockfile guidance
- CLI commands and common script patterns
- Test discovery globs and naming conventions
- Test API: describe/test/it signatures and behaviors
- Lifecycle hooks signatures and timing
- Expect matchers and exact method signatures
- vi mocking API and lifecycle management
- Configuration file structure, key options and their effects
- Coverage setup and provider-specific options
- Projects/multi-config runs and merging strategies
- Troubleshooting: discovery, ESM, async tests, mocking leakage

3. Detailed technical items
3.1 Installation and CLI usage
- Install as devDependency: npm install --save-dev vitest
- Coverage provider v8: npm install --save-dev @vitest/coverage-v8
- CI reproducible installs: npm ci (requires package-lock.json) or yarn/pnpm equivalents with frozen lockfiles
- Common package.json scripts:
  - "test": "vitest"
  - "test:run": "vitest --run"
  - "test:unit": "vitest --run --coverage tests/unit/**/*.test.js"
- CLI flags:
  - --run : run tests once and exit
  - --coverage : collect coverage according to config
  - --config <file> : use specific config file
  - --reporter <name> : change reporter
  - -t/--testNamePattern : run tests matching pattern
  - --threads/--no-threads : toggle worker threads

3.2 Test file discovery and naming
- test.include: string | string[] — glob patterns to include test files (recommended explicit patterns: ['tests/unit/**/*.test.js']).
- test.exclude: string | string[] — globs to exclude (e.g., ['node_modules','dist']).
- Default filename matching: files containing .test. or .spec. in the base filename and common extensions.

3.3 Test API surface and lifecycle hooks
- Import signature: import { describe, it, test, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'
- describe(name: string, fn: () => void): void — groups tests and scopes hooks
- test(name: string, fn: () => any | Promise<any>, timeout?: number): void — supports returning Promise or async fn; timeout in ms optional
- it(...) alias for test
- beforeAll(fn: () => any | Promise<any>, timeout?: number): void
- afterAll(fn: () => any | Promise<any>, timeout?: number): void
- beforeEach(fn: () => any | Promise<any>, timeout?: number): void
- afterEach(fn: () => any | Promise<any>, timeout?: number): void
- Hooks may be nested within describe blocks to scope setup/teardown.

3.4 Expect API (matchers) and signatures
- expect(actual: any): Matchers
- Core matcher signatures:
  - toBe(expected: any): void
  - toEqual(expected: any): void
  - toStrictEqual(expected: any): void
  - toBeNull(): void
  - toBeUndefined(): void
  - toBeTruthy(): void
  - toBeFalsy(): void
  - toContain(item: any): void
  - toMatch(regexpOrString: RegExp | string): void
  - toHaveLength(length: number): void
  - toThrow(error?: string | RegExp | ErrorConstructor): void
  - toBeGreaterThan(n: number): void
  - toBeLessThan(n: number): void
- Promise helpers (use await):
  - await expect(promise).resolves.toEqual(value)
  - await expect(promise).rejects.toThrow(error)

3.5 Mocking API (vi) and signatures
- vi.fn(implementation?: (...args: any[]) => any): MockFn — creates mock function recording calls/results
- vi.spyOn(object: any, method: string): Spy — spies on existing method and returns spy that can be restored
- vi.mock(moduleId: string, factory?: () => any): void — replaces module import with factory implementation
- vi.unmock(moduleId: string): void — remove active mock for module
- vi.clearAllMocks(): void — clears call history
- vi.resetAllMocks(): void — resets mock implementations to initial state
- vi.restoreAllMocks(): void — restores original implementations for spies/mocks
- vi.useFakeTimers(): void — switch to fake timers; vi.runAllTimers(), vi.advanceTimersByTime(ms)
- vi.useRealTimers(): void — restore real timers
- Best practice: isolate mocks per-test with afterEach(() => { vi.restoreAllMocks(); vi.resetAllMocks(); vi.clearAllMocks(); })

3.6 Configuration (vitest.config) options and effects
- Config pattern: import { defineConfig } from 'vitest/config'; export default defineConfig({ test: { /* options */ } })
- Supported file extensions for config: .js, .mjs, .cjs, .ts, .cts, .mts
- Key test options and exact semantics:
  - include: string | string[] — discovery globs
  - exclude: string | string[] — excluded globs
  - environment: 'node' | 'jsdom' | 'happy-dom' | string — runtime environment for tests
  - globals: boolean — when true, injects globals (describe/test/expect) into global scope
  - setupFiles: string[] — modules executed before test files, useful for global setup
  - threads: boolean | number — worker thread control; false for single-threaded
  - reporters: string[] | Array<[string, Record]> — reporter names or tuples with options
  - coverage: object — provider, enabled, reporter, include, exclude
  - hookTimeout: number — default hook timeout in ms
  - testTimeout: number — default test timeout in ms
  - watch: boolean — watch mode default control
  - isolate: boolean — run tests in isolated environment per file when true
  - name/root: string — project name and root override for multi-project configs
- defineConfig returns a config object consumed by vitest; using defineConfig enables TypeScript typing in config files.

3.7 Coverage configuration and providers
- coverage.provider: 'v8' | 'c8' | provider-name — select based on installed provider package
- Install provider example: npm install -D @vitest/coverage-v8 for provider 'v8'
- coverage.reporter: string[] — e.g., ['text','lcov','html']
- coverage.include / coverage.exclude: string[] — globs to include/exclude instrumentation
- CLI --coverage flag triggers coverage collection; ensure provider installed and configured in CI
- Ensure source maps are preserved for transpiled languages to map coverage to original files

3.8 Projects and multi-config runs
- test.projects: Array< string | Record > — accepts config file paths, directories with config, or inline project config objects
- Inline project example shape: { test: { name: 'node', root: './tests/node', environment: 'node', setupFiles: ['./setup.node.ts'] } }
- Projects run in same vitest process and allow running the same suites under different environments/configs
- Use mergeConfig to combine base vite/vitest config with project-specific overrides

3.9 Common troubleshooting steps and fixes
- No tests found: verify test.include patterns and run vitest --run --reporter verbose --config ./vitest.config.js to see discovery details
- ESM import errors: set package.json "type":"module" for ESM .js files or use .cjs/.mjs extensions; ensure Node engine meets requirements
- Globals missing: either import test helpers from 'vitest' or set test.globals = true in config
- Flaky async tests: ensure async tests return Promise/are declared async and use await for assertions; use test(name, async () => { await expect(p).resolves.toBe(x) }) and increase per-test timeout: test(name, fn, timeout)
- Mock leakage across tests: call vi.restoreAllMocks() and vi.resetAllMocks() in afterEach hooks; prefer explicit local mocks
- Coverage shows 0%: confirm coverage.provider is installed and enabled, and that include globs cover source files; enable source maps for transpiled code

4. Supplementary details (implementation knobs)
- setupFiles: use for global polyfills, test database connections, or registering global mocks; executed before test files
- Use environment 'jsdom' for DOM tests; install jsdom or rely on Vitest prompting unless disabled by VITEST_SKIP_INSTALL_CHECKS
- For debugging and single-threaded stack traces, set threads = false in config or run vitest --run --no-threads
- Use process.env.VITEST or import.meta.env.MODE to branch runtime behavior inside code under test

5. Reference details (exact signatures, parameters, returns, config examples)
- Import signature: import { describe, it, test, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'
- describe(name: string, fn: () => void): void
- test(name: string, fn: () => any | Promise<any>, timeout?: number): void
- beforeAll(fn: () => any | Promise<any>, timeout?: number): void
- expect(actual: any): Matchers where Matchers contains methods listed in section 3.4
- vi.fn(impl?: (...args: any[]) => any): MockFn
- vi.spyOn(obj: any, method: string): Spy
- vi.mock(moduleId: string, factory?: () => any): void
- vi.clearAllMocks(): void; vi.resetAllMocks(): void; vi.restoreAllMocks(): void
- defineConfig(config: Record<string, any>): Record<string, any> — import from 'vitest/config'

Example minimal vitest.config.ts (schema-compliant snippet, not fenced):
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    include: ['tests/**/*.test.*', 'src/**/*.test.*'],
    exclude: ['node_modules', 'dist'],
    environment: 'node',
    globals: false,
    threads: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: { provider: 'v8', enabled: true, reporter: ['text', 'lcov'], include: ['src/**'], exclude: ['tests/**'] },
    hookTimeout: 20000,
    testTimeout: 5000,
  }
})

CLI usage examples (exact):
- npx vitest --run --coverage --config=vitest.config.js
- npx vitest --watch --reporter=verbose
- npm run test (where package.json script maps to "vitest")

6. Detailed digest (SOURCES.md extract and retrieval date)
- Primary source: Vitest guide (https://vitest.dev/guide/) — installation, CLI, config schema, API signatures, mocking and coverage sections were used to produce this document.
- Supporting sources: MDN JavaScript Modules (config extension and ESM notes), MDN Number.isInteger and RangeError (used as context for tests that validate numeric inputs), Wikipedia Fizz_buzz (mission domain context), npm package listing for fizzbuzz (not retrievable in crawl; returned 403).
- Retrieval date: 2026-03-08
- Extracted actionable text size (approx): 13 KB across vitest and supplementary MDN pages used for configuration and error semantics.

7. Attribution and data size
- Source URL: https://vitest.dev/guide/ (primary)
- Supporting: https://developer.mozilla.org/..., https://en.wikipedia.org/wiki/Fizz_buzz
- Data size obtained during crawl: vitest.dev ~13.5 KB; MDN modules ~14 KB; MDN Number.isInteger ~3.3 KB; MDN RangeError ~2.3 KB; Wikipedia Fizz_buzz ~3.2 KB; npm fizzbuzz page returned 403 (no data)

[END OF DOCUMENT]