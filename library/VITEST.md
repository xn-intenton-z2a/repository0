VITEST

Table of contents
1. Normalised extract
  1.1 Purpose and scope
  1.2 Installation (exact commands)
  1.3 CLI commands and npm scripts (exact strings)
  1.4 Test file patterns and invocation semantics
2. Supplementary details
  2.1 Coverage provider integration (@vitest/coverage-v8)
  2.2 Config file keys and example values
  2.3 CI/lockfile-safe installation and execution
3. Reference details
  3.1 Exact CLI flag signatures and semantics
  3.2 Recommended vitest.config.js keys (types and effects)
  3.3 npm script mappings (script -> effect -> exit codes)
4. Detailed digest
  4.1 Extracted sources and retrieval metadata
5. Attribution and crawl data size

1. Normalised extract

1.1 Purpose and scope
- Vitest is the test runner used by this repository for unit tests. The repository uses vitest to run unit tests located under tests/unit and to produce coverage reports using the v8 coverage provider plugin @vitest/coverage-v8.

1.2 Installation (exact commands)
- Install for local development and CI as dev dependencies (exact commands):
  - npm install --save-dev vitest @vitest/coverage-v8
  - Or with yarn: yarn add --dev vitest @vitest/coverage-v8
- Reproducible CI install: npm ci  (uses package-lock.json) or yarn install --frozen-lockfile

1.3 CLI commands and npm scripts (exact strings)
- package.json scripts present in this repository (exact values):
  - "test": "vitest --run tests/unit/*.test.js"
    - Effect: synchronously run Vitest once against tests/unit/*.test.js and exit with process exit code 0 on success, non-zero on failures.
  - "test:unit": "vitest --run --coverage tests/unit/*.test.js"
    - Effect: run tests once and collect coverage using Vitest's configured coverage provider (coverage files and exit code semantics per Vitest defaults).
  - "test:behaviour": "npm run build:web && npx playwright test --config playwright.config.js"
    - Effect: builds web assets then runs Playwright E2E tests; kept for integration with Vitest unit pipeline but executed separately.
  - "start:cli": "node src/lib/main.js"
    - Effect: convenience entry to run the library CLI script; not a Vitest command but relevant for end-to-end local checks.

1.4 Test file patterns and invocation semantics
- Test invocation uses shell glob pattern tests/unit/*.test.js. Shell expansion rules apply when running via npm scripts (npm runs scripts in a shell on most platforms). Vitest also accepts glob patterns directly; providing an explicit pattern narrows tests to the listed files.
- --run flag ensures Vitest runs in non-watch mode and exits when finished.

2. Supplementary details

2.1 Coverage provider integration (@vitest/coverage-v8)
- Package is included in devDependencies: @vitest/coverage-v8.
- To enable v8 coverage provider in vitest.config.js, set coverage: { provider: 'v8' } and run vitest with --coverage or use the npm script test:unit which supplies --coverage.
- Coverage output: Vitest produces coverage artefacts according to the coverage config (reports directory, reporters). When using the v8 provider, the provider produces v8-format coverage which Vitest converts into reports per configured reporters.

2.2 Config file keys and example values
- Common vitest.config.js keys used by implementations and their types/effects:
  - test: { include: string[] | string, exclude?: string[], threads?: boolean | number }
    - include: glob(s) that select test files. Example: ['tests/unit/*.test.js']
    - threads: true | false | integer to control test worker threads; setting false forces single-threaded runs.
  - coverage: { provider?: 'v8' | 'istanbul', enabled?: boolean, reporter?: string[] , reportsDirectory?: string }
    - provider: selects coverage implementation; 'v8' used here to match @vitest/coverage-v8.
    - reporter: e.g., ['text', 'lcov']
  - environment: 'node' | 'jsdom'  (selects test environment)
  - reporters: array|string  (controls console output format)
  - watch: boolean  (when running without --run, enables watch mode)
- Place vitest.config.js at project root or pass --config <file> to CLI.

2.3 CI/lockfile-safe installation and execution
- Use npm ci in CI to ensure deterministic installs from package-lock.json.
- Run npm run test:unit in CI to execute unit tests with coverage and fail the job on non-zero exit codes from Vitest.

3. Reference details

3.1 Exact CLI flag signatures and semantics
- vitest --run [<pattern>]
  - --run: boolean, forces single-run (non-watch) mode. When supplied, Vitest executes tests and exits. Returns exit code 0 on all tests passing, non-zero if any test fails.
  - <pattern>: optional glob pattern(s) to select tests; if provided as tests/unit/*.test.js the runner restricts to those files.
- --coverage: boolean, instructs Vitest to collect coverage according to configured coverage provider and options.
- --config <file>: string, path to a Vitest config file to load instead of default discovery.
- --threads [true|false|number]: control test worker creation; true uses default worker count, false disables workers.
- Note: When running via npm scripts, provide flags after vitest in the script value.

3.2 Recommended vitest.config.js keys (types and effects)
- export default {
    test: {
      include: ['tests/unit/*.test.js'],       // string[]; globs selecting test files
      environment: 'node',                     // 'node' or 'jsdom'
      threads: false                           // boolean|number; false for single-threaded deterministic runs
    },
    coverage: {
      provider: 'v8',                          // 'v8' or 'istanbul'; selecting 'v8' requires @vitest/coverage-v8
      reporter: ['text', 'lcov'],              // reporters to generate
      reportsDirectory: 'coverage'             // output directory
    }
  }
- Place the config file at project root named vitest.config.js or pass --config path.

3.3 npm script mappings (script -> effect -> exit codes)
- "test": "vitest --run tests/unit/*.test.js"
  - Effect: runs unit tests; exit code 0 on success, non-zero on failures.
- "test:unit": "vitest --run --coverage tests/unit/*.test.js"
  - Effect: runs unit tests and records coverage; exit code non-zero also on coverage enforcement failures if a coverage threshold is configured to fail the run.

4. Detailed digest

4.1 Extracted sources and retrieval metadata
- Sources used to create this document:
  - package.json (repository root) — exact npm scripts and devDependencies entries referencing vitest and @vitest/coverage-v8
  - SOURCES.md (repository) — references vitest.dev/guide
  - External documentation implied by SOURCES.md: https://vitest.dev/guide/ (guide consulted during crawl)
- Retrieval date: 2026-03-08 (UTC)

5. Attribution and crawl data size
- Attribution: vitest.dev (Vitest guide) and this repository's package.json and SOURCES.md entries.
- Data size obtained during crawling: approximately 2.5 KB of combined package.json and SOURCES.md vitest-related content.


Detailed digest end.
