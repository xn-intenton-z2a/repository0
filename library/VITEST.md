VITEST

Table of contents
1. Normalised extract
2. Supplementary details
3. Reference details (API signatures, config keys, CLI)
4. Troubleshooting and best practices
5. Detailed digest (source and retrieval date)
6. Attribution and data size

1. Normalised extract

Installation and scripts
- Install as a dev dependency: npm install --save-dev vitest
- For V8-based coverage provider (used in this repo): npm install --save-dev @vitest/coverage-v8
- Recommended package.json scripts (exact):
  - "test": "vitest --run tests/unit/*.test.js"
  - "test:unit": "vitest --run --coverage tests/unit/*.test.js"
  - "test:watch": "vitest"
- CI installs: use npm ci to ensure reproducible installs using lockfile.

Core CLI behaviors and flags
- vitest --run
  - Runs tests once and exits (non-watch, CI-friendly). Exit code: 0 on success, non-zero on failures.
- vitest --coverage
  - Enables coverage collection using configured coverage provider and writes coverage artifacts.
- vitest --config <path>
  - Loads a custom config file instead of default resolution.
- vitest (no --run)
  - Starts interactive watch mode; reruns affected tests on file changes.
- vitest --update or -u
  - Updates stored inline or external snapshots.
- vitest --reporter <name>
  - Selects a reporter (builtin or third-party). Example reporters: default, verbose, json.
- vitest --threads [true|false|number]
  - Controls worker threads; --threads=false runs tests in-process for easier debugging.

Configuration surface (vitest.config.ts / vitest.config.js)
- Config pattern: export default defineConfig({ test: { ... } }) or module.exports = { test: { ... } } compatible with Vite.
- Core test options (exact keys and canonical effects):
  - test.include: string[] | undefined — glob(s) for test files; e.g., ["tests/unit/**/*.test.js"]
  - test.exclude: string[] | undefined — glob(s) to ignore; node_modules excluded by default
  - test.globals: boolean — when true, injects describe/it/test/expect as globals
  - test.environment: 'node' | 'jsdom' — sets runtime environment
  - test.threads: boolean | number — enable/disable and limit worker threads
  - test.isolate: boolean — isolate modules per test to avoid state leakage
  - test.setupFiles: string[] — files executed before tests for global setup
  - test.setupFilesAfterEnv: string[] — files run after environment setup
  - test.timeout: number — per-test timeout in milliseconds (default 5000)
  - test.deps: { inline?: string[] | boolean } — controls dependency pre-bundling/inline transform
  - test.coverage: { provider?: 'v8' | 'istanbul' | 'c8', reporter?: string[]; include?: string[]; exclude?: string[]; all?: boolean; reportsDirectory?: string }
    - coverage.provider: select 'v8' when using @vitest/coverage-v8 in CI for speed
    - coverage.reporter: e.g., ['text', 'lcov'] controls produced report formats

Test runtime API (globals if test.globals = true or via import 'vitest')
- describe(name: string, fn: () => void | Promise<void>): void
- it(name: string, fn?: () => any | Promise<any>, timeout?: number): void
- test(name: string, fn?: () => any | Promise<any>, timeout?: number): void
- beforeEach(fn: () => any | Promise<any>): void
- afterEach(fn: () => any | Promise<any>): void
- beforeAll(fn: () => any | Promise<any>): void
- afterAll(fn: () => any | Promise<any>): void

Expect API (selected matchers, TypeScript-like signatures)
- expect<T>(actual: T): Expect<T>
- Expect<T> (representative methods):
  - toBe(expected: T): void
  - toEqual(expected: any): void
  - toStrictEqual(expected: any): void
  - toBeTruthy(): void
  - toBeFalsy(): void
  - toBeNull(): void
  - toBeUndefined(): void
  - toBeDefined(): void
  - toContain(item: any): void
  - toHaveLength(length: number): void
  - toMatch(regexpOrString: RegExp | string): void
  - toThrow(err?: string | RegExp | Error): void
  - Async helpers: expect(promise).resolves / expect(promise).rejects chains for assertions on promises
  - Snapshot: toMatchSnapshot(name?: string): void and toMatchInlineSnapshot(snapshot?: string): void

Mocking and spies (vi namespace)
- vi.fn<T extends (...args: any[]) => any>(impl?: T): MockedFunction<T>
  - Returns a mock function with call tracking and mockImplementation utilities.
- vi.spyOn<T, K extends keyof T>(obj: T, method: K): SpyInstance
  - Tracks calls to obj[method]; supports mockImplementation and restore.
- vi.mock(moduleId: string, factory?: () => Record<string, any>): void
  - Mocks entire modules; resolution follows Vite module resolution.

2. Supplementary details

Vite integration and resolution
- Vitest executes tests through Vite's transform pipeline; imports and plugins behave like Vite dev server.
- For libraries with ESM-only builds or non-transpiled code in node_modules, use test.deps.inline or configure deps.inline to force Vite to transform those dependencies.

Environment selection and DOM testing
- test.environment = 'node' provides Node-like globals and a fast runtime.
- test.environment = 'jsdom' provides DOM APIs; ensure jsdom is available in the environment when required.

Coverage provider specifics
- provider: 'v8' — uses V8 native coverage (fast) and typically requires @vitest/coverage-v8; outputs report formats specified in coverage.reporter.
- provider: 'istanbul' or 'c8' — use when advanced source-map remapping or legacy tooling integration is required.
- coverage.reporter common values: ['text', 'lcov', 'json'] — lcov is standard for CI tools.

TypeScript support and file extensions
- Vitest supports TypeScript via Vite integration; keep tsconfig.json aligned to project needs and include test paths if using path mapping.
- For ESM projects with package.json "type": "module", ensure test files and imports use appropriate extensions or transpilation.

3. Reference details (API signatures, config keys, CLI)

Exact CLI flags and their immediate effects
- --run : boolean — run tests once and exit, suitable for CI.
- --coverage : boolean — enable coverage collection using configured provider and rules.
- --config <file> : string — specify a custom config file path.
- --threads <true|false|number> : control worker threads; use false for single-process runs.
- --reporter <name> : string — choose a reporter; many reporters accept additional options in config.
- --testNamePattern <string> : string — run only tests whose names match the pattern.
- --update / -u : boolean — update stored snapshots.

Config keys and exact parameter types (concise)
- test.include: string[] | string | undefined
- test.exclude: string[] | string | undefined
- test.environment: 'node' | 'jsdom'
- test.globals: boolean
- test.timeout: number
- test.threads: boolean | number
- test.isolate: boolean
- test.setupFiles: string[]
- test.setupFilesAfterEnv: string[]
- test.deps: { inline?: boolean | string[] }
- test.coverage: { provider?: 'v8' | 'istanbul' | 'c8', reporter?: string[], include?: string[], exclude?: string[], all?: boolean, reportsDirectory?: string }

Representative TypeScript-style signatures
- describe(name: string, fn: () => void | Promise<void>): void
- it(name: string, fn?: () => any | Promise<any>, timeout?: number): void
- expect<T>(value: T): { toBe(expected: T): void; toEqual(expected: any): void; toThrow(err?: any): void; /* etc */ }
- vi.fn<T extends (...args: any[]) => any>(impl?: T): T & { mock: { calls: any[] } }

4. Troubleshooting and best practices

Common failures and exact remediation steps
- Import failures for ESM dependencies
  - Step 1: Add problematic dependency to test.deps.inline in vitest config to force transform. Example: test: { deps: { inline: ['some-esm-only-package'] } }
  - Step 2: Re-run tests with --run to check CI behavior.
- Coverage missing or zero
  - Step 1: Verify test.coverage.provider matches installed provider (e.g., provider: 'v8' and @vitest/coverage-v8 present).
  - Step 2: Ensure source maps are preserved by build/transpile steps; set coverage.include to match files under test.
- Globals undefined
  - Set test.globals = true or import test functions from 'vitest' explicitly in test files.
- Flaky tests in watch mode
  - Run tests with --run to replicate CI environment; increase test.timeout for slow operations; isolate state with test.isolate = true and prefer beforeEach/afterEach cleanup.

Best practices (exact recommendations)
- Use vitest --run in CI to avoid interactive watch flakiness.
- Pin test and coverage-provider versions in CI for deterministic behavior.
- Use setupFiles for global polyfills or DB connections; prefer local cleanup in afterEach to avoid cross-test leakage.
- For fast coverage in CI prefer V8 provider when supported; use lcov reporter for CI artifact collection.

5. Detailed digest (source and retrieval date)

Primary source: Vitest official guide (https://vitest.dev/guide/)
Other referenced MDN pages included in project SOURCES.md for related JS semantics: modules, Number.isInteger, RangeError.
Content retrieved on: 2026-03-08
Extracted technical topics: installation commands, CLI flags (--run, --coverage, --config, --update, --reporter, --threads), vitest.config keys (include, exclude, globals, environment, threads, setupFiles, deps, coverage), runtime API signatures (describe/it/test/beforeEach/afterEach/expect), vi mocking API, coverage provider notes and report formats, Vite integration and ESM/TypeScript considerations.

6. Attribution and data size
- Attribution: Vitest official documentation (vitest.dev) and other SOURCES.md entries (MDN and npm) as listed in project SOURCES.md.
- Data size: SOURCES.md provided only URLs for this run; no remote page bodies were fetched by this operation. Local created/updated file size: approx. 8 KB.

End of VITEST document
