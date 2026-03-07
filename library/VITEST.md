NORMALISED EXTRACT

TABLE OF CONTENTS
1. CLI usage and npm scripts
2. Configuration file (vitest.config.js)
3. Test API and global helpers
4. Coverage provider and integration
5. Running tests in CI

1. CLI usage and npm scripts
- Common npm script: "test": "vitest --run tests/unit/*.test.js"
- Key CLI flags: --run to run tests in non-watch mode; --coverage to enable coverage; --watch for interactive watch mode; --reporter to choose output format.
- Use --run in CI to avoid interactive prompts.

2. Configuration file (vitest.config.js)
- Export configuration using defineConfig helper from 'vitest' or export default object.
- Common config fields:
  - test: { globals: boolean, environment: 'node' | 'jsdom', include: string[], exclude: string[] }
  - coverage: { provider: 'v8' | 'c8', reporter: string[] }
- Example exact keys: import { defineConfig } from 'vitest'
  - export default defineConfig({ test: { globals: true, environment: 'node', include: ['tests/unit/**/*.test.js'] }, coverage: { provider: 'v8' } })

3. Test API and global helpers
- Global functions available in tests: describe, it, test, expect, beforeEach, afterEach, vi (mocking)
- Mocking API: vi.fn(), vi.spyOn(obj, 'method'), vi.mock(modulePath, factory)
- Assertions follow Jest-like expect API: expect(value).toBe(expected), toEqual, toThrow, toHaveBeenCalled, etc.

4. Coverage provider and integration
- Use @vitest/coverage-v8 provider for V8-based coverage reporting; add the package and set coverage.provider = 'v8' in vitest config or CLI --coverage
- Coverage output formats controlled by coverage.reporter array (e.g., ['text', 'lcov'])

5. Running tests in CI
- Use npm ci && npm test or the repository's configured "test" script; ensure node version satisfies engines in package.json (>=24.0.0 in this repository)
- Set environment variables if tests require them; use --run to ensure headless CI execution.

SUPPLEMENTARY DETAILS

Exact config options and effects
- vitest --run: runs tests once and exits (non-watch)
- vitest.config.js test.environment: 'node' provides a Node environment; 'jsdom' provides DOM globals.
- Globals option: test.globals = true injects globals like describe/it in the global scope so imports are unnecessary.

REFERENCE DETAILS

Method signatures and usage
- describe(name: string, fn: () => void): void
- it(name: string, fn: () => void | Promise<void>): void
- test same as it
- expect(actual).matcher(expected): assertion
- vi.fn(implementation?: Function): MockFunction
- vi.mock(moduleSpecifier: string, factory?: () => any): void

Troubleshooting
1. Tests not found: verify include patterns in vitest.config.js and CLI arguments match test file locations.
2. Coverage missing or incomplete: ensure coverage.provider is set and instrumentation package (e.g., @vitest/coverage-v8) is installed.
3. Globals undefined: set test.globals = true in config or import functions from 'vitest' in each test file.

DIGEST
- Source: vitest.dev and package.json test scripts (as listed in SOURCES.md)
- Retrieval date: 2026-03-07
- Crawl size: 0 bytes fetched; content synthesised from SOURCES.md and local knowledge.

ATTRIBUTION
- Sources: vitest.dev, repository package.json