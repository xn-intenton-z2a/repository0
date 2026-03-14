VITEST

Table of contents
- Getting started (installation & config)
- Running tests (CLI patterns)
- Test structure and fixtures
- Mocking and spies
- Coverage and reporters
- Integration with Vite and ESM
- Best practices for fast unit tests
- Troubleshooting common failures
- Digest and attribution

Getting started
- Vitest is a Vite-native test runner. Install as dev dependency and run via vitest CLI
- Typical scripts: "test": "vitest --run tests/unit/*.test.js"

Running tests
- CLI flags: --run for non-watch, --coverage for coverage, --reporter to change reporter
- Use pattern globs to select test files

Test structure and fixtures
- Tests typically export or define describe/it/expect style suites similar to Jest
- Use beforeEach/afterEach hooks for setup/teardown

Mocking and spies
- Vitest provides mocking and spy utilities compatible with ESM environments
- Prefer explicit module mocking with vi.mock and restore mocks between tests

Coverage and reporters
- Use --coverage with appropriate coverage provider (e.g., @vitest/coverage-v8) configured in package.json or vitest.config.js

Integration with Vite and ESM
- Vitest runs under Vite dev server; supports ESM module resolution and Vite plugins
- Configure vitest in vitest.config.js to align with project build config

Best practices
- Keep unit tests fast and isolated; mock network and filesystem interactions
- Use explicit test file patterns and separate unit vs e2e suites

Troubleshooting
- Common issues: ESM import resolution errors — ensure vitest.config.js uses same alias and resolve settings as Vite
- For flaky tests, run with --run --threads=1 to isolate concurrency issues

Digest
- Source: Vitest Guide - Getting Started
- Retrieved: 2026-03-14

Attribution and data size
- URL: https://vitest.dev/guide/
- Crawl size: 122499 bytes
