VITEST

Table of contents
- Purpose and scope
- Installation and CLI
- Common API: test, describe, it, expect
- Matchers (core)
- Running tests in CI and flags
- Writing unit tests for FizzBuzz (patterns)
- Supplementary details
- Reference details (commands and method signatures)
- Digest and retrieval
- Attribution and data size

Purpose and scope
Vitest is a next-generation test runner built on Vite. It provides a Jest-like API (test, describe, expect) with fast startup and native ESM support. It is suitable for unit tests in Node and browser-like environments.

Installation and CLI
- Install as a dev dependency: npm install -D vitest
- Common CLI commands:
  - npx vitest run  -> run tests once (CI-friendly)
  - npx vitest     -> start in watch mode (default interactive)
- Package.json script example: "test": "vitest" or "test:unit": "vitest --run" for non-watch CI runs.

Common API
- test(name, fn): define a test case where fn may be async; returns a Promise if async.
- describe(name, fn): group tests; fn contains nested tests and hooks.
- beforeEach(fn), afterEach(fn), beforeAll(fn), afterAll(fn): lifecycle hooks inside describe blocks.
- expect(value): assertion entry; returns an object with matcher methods.

Matchers (core)
- expect(value).toBe(expected): strict equality (===).
- expect(value).toEqual(expected): deep equality.
- expect(fn).toThrow(error?): assert function throws when called.
- expect(value).toBeTruthy()/toBeFalsy(), toContain, toMatch, etc.
- Asynchronous helpers: await expect(promise).resolves.toBe(value) style supported.

Running tests in CI and flags
- Use --run to disable watch mode in CI: npx vitest --run
- Coverage: vitest supports built-in coverage plugins; run with configuration or --coverage flags depending on setup.
- Node ESM: vitest supports ESM test files; ensure package.json type: "module" for native ESM.

Writing unit tests for FizzBuzz (patterns)
- Import functions as named exports: import { fizzBuzz, fizzBuzzSingle } from 'src/lib/main.js'
- Test normal behaviour: expect(fizzBuzz(15)).toEqual([...expected 15 items...])
- Test single values: expect(fizzBuzzSingle(3)).toBe('Fizz') etc.
- Edge cases: expect(fizzBuzz(0)).toEqual([]); expect(() => fizzBuzz(-1)).toThrow(RangeError); expect(() => fizzBuzz(1.2)).toThrow(TypeError).
- Use beforeEach to set up any shared fixtures or inputs; keep tests isolated and deterministic.

Supplementary details
- Vitest uses Vite under the hood; startup speed is high due to pre-bundling and native ESM.
- For Node-based libraries, run tests with environment node or jsdom as appropriate (configurable per test via test.environment).
- When testing exports in ESM modules, import files with exact relative paths including .js extension if necessary.

Reference details (commands and method signatures)
- Installation: npm install -D vitest
- Run (CI): npx vitest --run
- test(name: string, fn: (done?) => any | Promise<any>) -> registers a test
- describe(name: string, fn: () => void) -> defines a suite
- expect(actual).toBe(expected) -> matcher function signature
- Lifecycle hooks: beforeEach(fn), afterEach(fn), beforeAll(fn), afterAll(fn) where fn may be async

Digest and retrieval
- Source: vitest.dev (official project site and docs)
- Retrieved: 2026-03-19
- Crawl note: HTML fetched via curl and condensed for CLI-oriented usage guidance and API signatures.

Attribution and data size
- Source URL: https://vitest.dev/
- Data fetched: approximately 68.0 KB of HTML (raw page content) during crawl
- Attribution: Content condensed and normalised from the official Vitest documentation and website.
