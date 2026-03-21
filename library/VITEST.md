VITEST

Table of Contents:
- Overview
- Installation
- Running tests
- Test syntax and API
- Assertions and matchers
- Mocking and spying
- Coverage
- Configuration (vitest.config.js)
- Best practices for unit tests

Overview:
Vitest is a Vite-native test runner compatible with Jest-like APIs. It supports ESM, fast runs via Vite, snapshot testing, mocking, and built-in coverage via plugins.

Installation:
- npm install -D vitest
- Optionally add @vitest/coverage-v8 for V8 coverage integration

Running tests:
- npx vitest --run tests/unit/*.test.js
- npm script example: "test:unit": "vitest --run --coverage tests/unit/*.test.js"

Test syntax and API (core):
- describe(name, fn)
- it(name, fn) or test(name, fn)
- beforeEach(fn), afterEach(fn), beforeAll(fn), afterAll(fn)
- expect(value).toBe(expected), toEqual, toThrow, toBeDefined, etc.

Assertions and matchers:
- expect(fn).toThrow(ErrorConstructorOrMessage)
- expect(value).toBeDefined()
- Async: await expect(promise).resolves.toBe(value)

Mocking and spying:
- vi.fn() to create spies
- vi.spyOn(object, 'method') to spy
- vi.mock('module', () => ({ default: () => {} })) for module mocking

Coverage:
- Use --coverage flag and coverage provider; configure in vitest.config.js
- @vitest/coverage-v8 provides V8-based coverage reporting

Configuration (example keys):
- test: { include: ['tests/unit/*.test.js'], globals: false, environment: 'jsdom' }
- coverage: { provider: 'v8', reporter: ['text', 'lcov'] }

Best practices:
- Keep tests deterministic and isolated; use vi.resetAllMocks() in afterEach when using mocks.
- Use descriptive test names and group related cases with describe.
- Aim for focused unit tests that exercise single functions and edge cases (e.g., RangeError and TypeError for input validation).

Detailed digest:
Content retrieved from Vitest guide (retrieved 2026-03-21): vitest provides Jest-like APIs, runs via Vite, supports ESM, and is suitable for unit tests in this repository's setup.

Attribution and data size:
- Source: https://vitest.dev/guide/
- Retrieved: 2026-03-21
- Approx bytes fetched: 120 KB (page HTML)
