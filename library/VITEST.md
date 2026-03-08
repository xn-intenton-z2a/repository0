VITEST

Table of contents
1. Normalised extract
  1.1 CLI commands and usage
  1.2 Package installation and devDependencies
  1.3 Configuration file keys and types (vitest.config.js / .ts)
  1.4 Test API and helper signatures (describe/it/expect/vi)
  1.5 Coverage configuration (provider, reporters, include/exclude)
  1.6 Common runtime/environment flags and ESM considerations
2. Supplementary details
  2.1 Best practices and integration patterns
  2.2 CI/lockfile commands and reproducible runs
  2.3 Troubleshooting procedures (step-by-step)
3. Reference details
  3.1 Exact CLI flags and effects
  3.2 Configuration object schema with keys and types
  3.3 API function signatures with parameter and return types
  3.4 Coverage provider options and reporter values
4. Detailed digest
  4.1 Source: https://vitest.dev/ (retrieved 2026-03-08)
5. Attribution and crawl data size

1. Normalised extract

1.1 CLI commands and usage
- Install CLI and dependencies: npm install --save-dev vitest @vitest/coverage-v8
- Run tests (interactive/watching default): npx vitest
- Run tests in non-watch (CI) mode: npx vitest --run
- Run specific files or globs: npx vitest --run tests/unit/*.test.js
- Run with coverage collection: npx vitest --run --coverage
- Run with a specific config file: npx vitest --config=vitest.config.js
- Run via npm scripts (package.json): npm test  (runs: vitest --run tests/unit/*.test.js)
- Run unit tests with coverage via npm: npm run test:unit  (runs: vitest --run --coverage tests/unit/*.test.js)
- Show test names filter: npx vitest --run --testNamePattern="pattern"
- Produce coverage output for CI: npx vitest --run --coverage --coverage-provider=v8

1.2 Package installation and devDependencies
- Package names and versions: vitest (CLI/test runner), @vitest/coverage-v8 (coverage provider using V8).
- Install as devDependencies to avoid shipping test tooling: npm install --save-dev vitest @vitest/coverage-v8
- Use lockfile-driven install in CI: npm ci (requires package-lock.json) or yarn install --frozen-lockfile for Yarn.

1.3 Configuration file keys and types (vitest.config.js / .ts)
- Export form: export default defineConfig({ test: { ... } }) where defineConfig is imported from 'vitest/config'.
- Primary test key and accepted subkeys (types shown):
  - include: string[] — globs of test files to include, e.g. ['tests/unit/**/*.test.js']
  - exclude: string[] — globs to exclude
  - environment: string — 'node' | 'jsdom' | 'happy-dom' | 'browser'
  - globals: boolean — enable global test APIs (describe, it, expect) when true
  - setupFiles: string[] — files to run before tests for global setup
  - timeout: number — default test timeout in milliseconds
  - threads: boolean|number — enable/limit worker threads
  - watch: boolean — default watch mode behavior
  - reporters: string[] | string — reporter names or arrays
  - coverage: object — coverage configuration (see 1.5)

1.4 Test API and helper signatures (describe/it/expect/vi)
- describe(name: string, fn: () => void): void — group tests
- it(name: string, fn: (() => void) | (() => Promise<void>), timeout?: number): void — define a test; alias: test
- beforeEach(fn: (() => void) | (() => Promise<void>)): void
- afterEach(fn: (() => void) | (() => Promise<void>)): void
- beforeAll(fn: (() => void) | (() => Promise<void>)): void
- afterAll(fn: (() => void) | (() => Promise<void>)): void
- expect(actual: any): Expectation — core assertions with methods: toBe(expected), toEqual(expected), toStrictEqual(expected), toBeTruthy(), toBeFalsy(), toBeNull(), toBeUndefined(), toContain(item), toHaveLength(n), toMatchObject(obj), resolves / rejects utilities for Promise assertions
- vi.fn<T extends (...args: any[]) => any>(impl?: T): MockInstance<T> — create a mock function
- vi.mock(moduleId: string, factory?: () => any, options?: { virtual?: boolean }): void — stub module imports
- vi.spyOn(object: object, methodName: string): SpyInstance

1.5 Coverage configuration (provider, reporters, include/exclude)
- coverage object keys and types:
  - provider: 'v8' | 'c8' (string) — selects the coverage engine; use 'v8' with @vitest/coverage-v8
  - reporter: string[] — e.g., ['text', 'lcov']
  - include: string[] — globs to include in coverage
  - exclude: string[] — globs to exclude from coverage
  - all: boolean — whether to include all files, not only those touched by tests
  - reportsDirectory: string — directory to write coverage artifacts
- Example coverage providers: provider: 'v8' together with dependency @vitest/coverage-v8; provider 'c8' uses c8 under the hood.

1.6 Common runtime/environment flags and ESM considerations
- Node/Esm:
  - Vitest supports ESM projects. When package.json contains "type":"module", use .js as ESM or .cjs/.mjs as needed.
  - If tests run under ESM and import syntax fails, set test.environment to 'node' and ensure transformMode and resolver handle ESM, or provide a transpilation step in the build.
- Top-level await: supported when test environment and Node version permit; ensure Node version >= 16.8 for native top-level await and matching runner compatibility.
- Global APIs: enable globals: true in config to use describe/it without imports.

2. Supplementary details

2.1 Best practices and integration patterns
- Keep vitest and coverage provider as devDependencies and pin minor versions in CI to avoid surprises.
- Use explicit include globs in config to avoid accidental test pickup: include: ['tests/unit/**/*.test.js'].
- Use globals: true to shorten tests, but prefer explicit imports in libraries that may be consumed by other tools.
- Limit threads in CI if memory constrained: threads: 2 or threads: false to run in single-threaded mode.
- Prefer "npx vitest --run --coverage --coverage-provider=v8" in CI to produce consistent coverage artifacts.

2.2 CI/lockfile commands and reproducible runs
- For reproducible CI installs: npm ci
- Run tests in CI: npm test or npx vitest --run
- Cache node_modules and lockfile in CI pipeline; pin node engine to match local development (package.json engines: node >=24 in this repo).

2.3 Troubleshooting procedures (step-by-step)
- Symptom: tests failing only on CI but passing locally
  1. Verify Node version in CI matches local (node -v); ensure engine compliance.
  2. Run npm ci in CI to match lockfile; ensure lockfile is committed.
  3. Re-run tests with verbose output: npx vitest --run --reporter verbose
- Symptom: ESM import errors in tests
  1. Confirm package.json "type" field and test file extensions (.mjs/.cjs) match expectations.
  2. Set test.environment: 'node' in vitest.config to reduce browser-like transforms.
  3. Add transform step or use a compatible bundler/transpiler if using non-standard syntax.
- Symptom: coverage incomplete or missing files
  1. Ensure coverage.include globs match source file locations.
  2. Set coverage.all: true to include files not required by tests.
  3. Confirm coverage provider is installed and provider name matches (e.g., @vitest/coverage-v8 for provider 'v8').

3. Reference details

3.1 Exact CLI flags and effects
- --run: Run tests without interactive watch mode; exits with non-zero code on failures.
- --coverage: Enable coverage collection using configured coverage.provider.
- --config <file>: Use the specified configuration file.
- --testNamePattern <regex|string>: Run tests matching the provided pattern.
- --reporter <name|json>: Select reporter(s) for output formatting.
- --watch: Default for local runs; watches files and re-runs tests on change.
- --threads <number|false>: Set number of worker threads or disable parallelism.

3.2 Configuration object schema with keys and types (concise)
- Root export: defineConfig({ test: TestOptions }) where TestOptions is:
  - include?: string[]
  - exclude?: string[]
  - environment?: 'node' | 'jsdom' | 'happy-dom' | 'browser'
  - globals?: boolean
  - setupFiles?: string[]
  - timeout?: number
  - threads?: boolean | number
  - reporters?: string | string[]
  - coverage?: CoverageOptions
- CoverageOptions:
  - provider?: 'v8' | 'c8'
  - reporter?: string[]
  - include?: string[]
  - exclude?: string[]
  - all?: boolean
  - reportsDirectory?: string

3.3 API function signatures with parameter and return types
- describe(name: string, fn: () => void): void
- it(name: string, fn: (() => void) | (() => Promise<void>), timeout?: number): void
- test alias of it
- beforeEach(fn: (() => void) | (() => Promise<void>)): void
- afterEach(fn: (() => void) | (() => Promise<void>)): void
- beforeAll(fn: (() => void) | (() => Promise<void>)): void
- afterAll(fn: (() => void) | (() => Promise<void>)): void
- expect(actual: any): Expectation where Expectation includes assertion methods: toBe(expected: any): void; toEqual(expected: any): void; resolves: { toBe(value: any): Promise<void> } ; rejects: { toThrow(): Promise<void> }
- vi.fn<T extends (...args: any[]) => any>(impl?: T): MockInstance<T>
- vi.mock(moduleId: string, factory?: () => any, options?: { virtual?: boolean }): void
- vi.spyOn<T>(obj: T, method: keyof T): SpyInstance

3.4 Coverage provider options and reporter values
- provider: 'v8' — requires @vitest/coverage-v8; produces V8-native coverage; faster and compatible with Node versions shipping V8 coverage hooks
- reporter values: 'text', 'lcov', 'json', 'html', 'clover' — include multiple reporters as array
- reportsDirectory effect: sets output path for lcov and html artifacts

4. Detailed digest
4.1 Source section extracted from SOURCES.md and vitest.dev (retrieved 2026-03-08)
- Extracted actionable CLI commands, config keys, API signatures and CI patterns from vitest documentation and the project's package.json scripts which use: "test": "vitest --run tests/unit/*.test.js" and "test:unit": "vitest --run --coverage tests/unit/*.test.js". Retrieval date: 2026-03-08.

5. Attribution and crawl data size
- Source URL: https://vitest.dev/ (primary)
- Additional context: package.json scripts in repository root referencing vitest
- Data size obtained during crawl: approximately 4 KB of extracted text
- Attribution: content retrieved and condensed from vitest.dev documentation (Vitest project) on 2026-03-08
