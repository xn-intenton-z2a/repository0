NORMALISED EXTRACT

Table of Contents:
1. Purpose and scope
2. Core CLI usage
3. Test API and lifecycle
4. Configuration options
5. Watch mode and reporters
6. Implementation patterns and best practices
7. Troubleshooting

1. Purpose and scope
- Vitest is a Vite-native unit test framework for JavaScript/TypeScript offering jest-like APIs, fast cold-starts, and coverage integration.

2. Core CLI usage
- Run tests: vitest --run [glob]
- Run single file: vitest --run tests/unit/foo.test.js
- Coverage: use --coverage with @vitest/coverage-v8 to produce coverage reports

3. Test API and lifecycle
- Test definitions: test(name, fn) and it(name, fn)
- Assertions: expect(value).toBe(expected), expect(value).toEqual(obj), and matchers similar to Jest
- Hooks: beforeAll, beforeEach, afterEach, afterAll
- Asynchronous tests: support for promises and async/await; return a promise or declare async function

4. Configuration options
- vitest.config.js or vitest property in package.json to configure globals, test environment, coverage, reporters
- Important options: test.timeout, test.include, test.exclude, coverage.threshold

5. Watch mode and reporters
- Watch mode: vitest --watch enables file watching and rerun on changes
- Built-in reporters: default, verbose, json; CI environments often use --reporter=json

6. Implementation patterns and best practices
- Keep unit tests isolated and deterministic; mock external IO with vi.fn() or vi.mock()
- Use test.only/test.skip for local debugging but remove before committing
- Use setupFiles or globalSetup to prepare test fixtures conservatively

7. Troubleshooting
- If tests fail due to ESM/CJS interop, ensure test environment matches project type and use appropriate transform or module resolution
- For flaky tests, add deterministic seeds or remove time-based dependencies

DETAILED DIGEST

Source: https://vitest.dev/
Retrieved: 2026-03-09
Extracted technical content: CLI commands, test API method names and behavior, configuration knobs, recommended patterns for isolation and mocking
Data size obtained: ~10 KB
Attribution: Vitest documentation
