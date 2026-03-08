VITEST

Table of contents
1. Normalised extract
  1.1 Installation and invocation
  1.2 CLI commands and flags
  1.3 Configuration schema (vitest.config.js / .ts)
  1.4 Test lifecycle and helpers
  1.5 Coverage configuration
2. Supplementary details
  2.1 Recommended CI usage
  2.2 Performance and worker controls
  2.3 Common troubleshooting steps
3. Reference details
  3.1 Exact CLI flags and types
  3.2 Config object schema with keys, types and default values
  3.3 Coverage config keys and effects
  3.4 Example operational commands for CI and local development
4. Detailed digest
  4.1 Source: https://vitest.dev/guide/ (retrieved 2026-03-08)
5. Attribution and crawl data size

1. Normalised extract

1.1 Installation and invocation
- Install as a dev dependency: npm install --save-dev vitest
- Run test suite once (CI mode): npx vitest run OR use npm script: vitest --run tests/unit/*.test.js
- Run in watch/development mode: npx vitest OR npm script configured without --run
- Use node version matching engines in package.json; ensure ESM/CommonJS alignment when using vitest with project type: module

1.2 CLI commands and flags
- vitest run -- execute tests once and exit (CI-friendly)
- vitest --watch -- start interactive watch mode, reruns on file changes
- Common flags and meanings:
  --run: boolean: run once and exit
  --watch: boolean: watch for file changes
  --config <path>: string: use explicit config file path
  --environment <env>: 'node' | 'jsdom' | 'happy-dom' : choose test environment
  --coverage: boolean: enable coverage collection for the run
  --reporter <name|path>: string | string[]: use named or custom reporter(s)
  --threads <number|false>: number | false: control worker threads (false disables workers)
  --testNamePattern | -t <pattern>: string: run tests matching the name pattern
  --update: boolean: update snapshots
  --silent: boolean: suppress console output from runner
  --clearCache: boolean: clear vitest cache before running

1.3 Configuration schema (vitest.config.js / .ts)
- Export form: export default defineConfig({ test: { ... } }) where defineConfig is provided by 'vitest/config'.
- Root config shape (key: type — default):
  test.include: string[] — default: ['tests/**'] — glob patterns of files to include
  test.exclude: string[] — default: ['node_modules'] — glob patterns to exclude
  test.environment: 'node' | 'jsdom' | 'happy-dom' — default: 'node'
  test.globals: boolean — default: false — enable global test APIs (describe, it, expect without import)
  test.setupFiles: string | string[] — default: undefined — files to run before test environment is initialized
  test.threads: boolean | number — default: true — worker threads control
  test.isolate: boolean — default: false — run tests in isolated processes to avoid shared state
  test.timeout: number — default: 5000 (ms) — per-test timeout
  test.retries: number — default: 0 — number of retries for flaky tests
  test.reporters: string[] — default: [] — reporters to use
  test.coverage: object — nested coverage options (see section 3.3)

1.4 Test lifecycle and helpers
- Lifecycle hooks and when they run:
  beforeAll(fn): runs once before all tests in the current scope
  afterAll(fn): runs once after all tests in the current scope
  beforeEach(fn): runs before each individual test
  afterEach(fn): runs after each individual test
- Global test DSL when test.globals = true: describe, test/it, expect available without import
- Mocking utilities: vitest.mock(modulePath, factory?) and vi.spyOn(object, method) — use vi.* APIs to create spies, mocks and timers
- Timer control: vi.useFakeTimers(), vi.advanceTimersByTime(ms), vi.runAllTimers() — use vi.restoreAllTimers() to return to real timers

1.5 Coverage configuration
- Coverage provider options: 'v8' or 'c8' (strings) — provider affects speed and output format
- Coverage config keys (inside test.coverage):
  provider: 'v8' | 'c8' — default: 'v8'
  enabled: boolean — default: false
  reporter: string[] — default: ['text'] — e.g., ['text','lcov']
  include: string[] — default: ['src/**'] — files to include in coverage
  exclude: string[] — default: ['tests/**','node_modules']
  all: boolean — default: false — include all files matching include patterns even if untested
  reportsDirectory: string — default: coverage

2. Supplementary details

2.1 Recommended CI usage
- Use vitest --run in CI; add --coverage in CI if coverage is required
- Ensure node version in CI matches local development; pin versions in engines or CI image
- Use npm ci for reproducible installs, then run npx vitest run
- Configure reporters or JUnit reporter in CI for integration with test reporting dashboards

2.2 Performance and worker controls
- For deterministic CI runs disable worker threads by passing --threads=false if tests share global mutable state or when debugging
- Increase threads (number) to parallelize tests on CI agents with many cores (test.threads: number)
- Use test.isolate: true to avoid shared in-memory state across worker threads but expect higher resource usage
- Use coverage provider 'v8' for fast collection in Node.js environments

2.3 Common troubleshooting steps
- Environment mismatches: set test.environment explicitly to 'jsdom' when DOM APIs are required
- Flaky tests: increase test.timeout or set retries in config or via CLI (--retries)
- Snapshot mismatches: run with --update to refresh snapshots when intentional changes occur
- Clearing cache: use --clearCache or remove node_modules/.vitest cache when corrupted
- Disabling threads: use --threads=false to run tests in the main process for easier debugging

3. Reference details

3.1 Exact CLI flags and types
- --run: boolean — run once and exit
- --watch: boolean — watch mode
- --config <path>: string — path to config file
- --environment <string>: 'node'|'jsdom'|'happy-dom' — set environment
- --coverage: boolean — enable coverage collection
- --reporter <string|array>: reporter name(s)
- --threads <number|false>: number or false — how many worker threads or false to disable
- -t, --testNamePattern <string>: string — run tests with matching names
- --update: boolean — update snapshots
- --clearCache: boolean — clear vitest cache
- --silent: boolean — suppress runner logs

3.2 Config object schema with keys, types and default values
- export default defineConfig({
    test: {
      include: string[] (default ['tests/**']),
      exclude: string[] (default ['node_modules']),
      environment: 'node'|'jsdom'|'happy-dom' (default 'node'),
      globals: boolean (default false),
      setupFiles: string | string[] (default undefined),
      threads: boolean | number (default true),
      isolate: boolean (default false),
      timeout: number (ms, default 5000),
      retries: number (default 0),
      reporters: string[] (default []),
      coverage: {
        provider: 'v8'|'c8' (default 'v8'),
        enabled: boolean (default false),
        reporter: string[] (default ['text']),
        include: string[] (default ['src/**']),
        exclude: string[] (default ['tests/**','node_modules']),
        all: boolean (default false),
        reportsDirectory: string (default 'coverage')
      }
    }
  })

3.3 Coverage config keys and effects
- provider: 'v8' uses V8 native coverage, faster in Node.js; 'c8' uses c8/istanbul for different output formats
- enabled: toggles coverage collection; enabling will add runtime overhead
- reporter: controls report outputs; include 'lcov' for CI integration with coverage services
- include/exclude: control which files are instrumented and reported
- all: when true, include files without tests to show zero coverage for missing tests

3.4 Example operational commands for CI and local development
- CI (run once, collect coverage): npm ci && npx vitest run --coverage
- Local quick run: npx vitest --watch
- Run specific tests by name: npx vitest -t "should return fizz"
- Disable workers for debugging: npx vitest --run --threads=false

4. Detailed digest
4.1 Source: https://vitest.dev/guide/ (retrieved 2026-03-08)
- Extracted sections used: installation, CLI reference, configuration guide, test API (vi global), coverage provider guidance, best practices and troubleshooting notes
- Data size obtained: approximately 24 KB (HTML and main guide content)

5. Attribution and crawl data size
- Source: vitest.dev/guide/
- Retrieved: 2026-03-08
- Estimated bytes extracted: 24,576 bytes
