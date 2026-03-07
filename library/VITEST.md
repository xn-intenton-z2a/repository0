DOCUMENT: VITEST

Table of Contents
1. Quick Start Commands
2. Test File Structure and Conventions
3. Core APIs and Signatures
4. Configuration Options (vitest.config.js / package.json)
5. Assertions and Matchers (Node assert + expect)
6. Coverage with @vitest/coverage-v8
7. Running, Filtering and Watch Modes
8. Best Practices and Troubleshooting

1. Quick Start Commands
- Install (from this repo): devDependency already listed: vitest@^4.0.18 and @vitest/coverage-v8.
- Run unit tests: npm run test or npx vitest --run tests/unit/*.test.js
- Run single test file: npx vitest tests/unit/example.test.js --run
- Run in watch mode (dev): npx vitest --watch
- Run coverage: npm run test:unit uses --coverage and runs tests/unit/*.test.js

2. Test File Structure and Conventions
- Place unit tests under tests/unit/ and name files *.test.js to match the project's test script pattern.
- Use describe/it (or test) blocks for structure: describe('module', ()=>{ it('does x', ()=>{...}) })
- Keep tests deterministic and isolated: avoid network I/O, use stubs/mocks for external dependencies.
- Export fixtures and small helper factories to reduce duplication across tests.

3. Core APIs and Signatures
- vitest (CLI) options used by scripts:
  - --run: run tests once and exit
  - --coverage: enable coverage collection
  - --watch: watch files and re-run tests on change
  - Pattern arguments: pass file globs to run selected tests
- Test lifecycle functions (global):
  - beforeAll(fn: Function | AsyncFunction): void
  - afterAll(fn: Function | AsyncFunction): void
  - beforeEach(fn: Function | AsyncFunction): void
  - afterEach(fn: Function | AsyncFunction): void
- Test declaration:
  - test(name: string, fn: Function | AsyncFunction): Promise<void> | void
  - it(name: string, fn: Function | AsyncFunction): Promise<void> | void

4. Configuration Options (vitest.config.js / package.json)
- Basic config structure (vitest.config.js):
  - export default defineConfig({
      test: {
        include: ['tests/unit/**/*.test.js'],
        environment: 'node',
        threads: true | false,              // enable worker threads
        isolate: true | false,              // isolate modules per test file
        setupFiles: ['./tests/setup.js'],   // run before tests
        coverage: {
          provider: 'v8',                  // use @vitest/coverage-v8
          reporter: ['text', 'lcov'],
          exclude: ['tests/'],
        },
      }
    })
- package.json scripts (examples present in repo):
  - "test": "vitest --run tests/unit/*.test.js"
  - "test:unit": "vitest --run --coverage tests/unit/*.test.js"

5. Assertions and Matchers (Node assert + expect)
- Node assert (built-in):
  - assert.strictEqual(actual, expected, message?)
  - assert.deepStrictEqual(actual, expected, message?)
  - assert.throws(fn, error?)
  - Use for low-dependency, deterministic checks
- vitest expect (Jest-compatible):
  - expect(value).toBe(expected)
  - expect(value).toEqual(expected)
  - expect(fn).toThrow(error?)
  - expect(value).toBeTruthy(), toBeFalsy(), toContain(item)
- Use strict equality for primitives and deep equality for objects/arrays.

6. Coverage with @vitest/coverage-v8
- Provider: v8 (fast) via @vitest/coverage-v8
- Configure provider in vitest.test.coverage.provider = 'v8'
- Common reporters: text, lcov; configure thresholds in coverage.coverageThreshold if desired.
- Running: npm run test:unit will invoke vitest with --coverage flag as defined in this repo.

7. Running, Filtering and Watch Modes
- Run by pattern: npx vitest 'tests/unit/**/main.test.js' --run
- Use --testNamePattern to run tests matching a name regex
- Use --threads=false to debug single-threaded failures or inspect state
- Use --reporter verbose when troubleshooting failing test outputs

8. Best Practices and Troubleshooting
- Prefer small, focused tests that assert a single behaviour.
- Mock external I/O and timers with vi.fn(), vi.spyOn(), and vi.useFakeTimers().
- If tests fail nondeterministically, run with --run --threads=false and --isolate to reproduce in single process.
- For fast local iteration use --watch and filter by test name or file path.
- When coverage is unexpectedly low: ensure source files are included (not excluded) and avoid skipping instrumentation by running tests with --coverage.
- If Node engine mismatches cause native API issues, ensure node >=24 as specified in package.json engines.

Digest and Retrieval Metadata
- Extracted from: https://vitest.dev/guide/ and project package.json scripts
- Retrieval date: 2026-03-07
- Approximate data size: ~4KB of distilled actionable instructions

Attribution
- Source: Vitest documentation (https://vitest.dev/guide/), Node.js assertion docs, and project package.json.
