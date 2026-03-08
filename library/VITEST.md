VITEST

Table of contents
1. Installation and CLI
2. Configuration schema (vitest.config.js / defineConfig)
3. Test lifecycle API (describe/it/test/before/after)
4. Assertion API (expect) — complete method signatures
5. Mocking API (vi) — functions and behaviors
6. Snapshot testing
7. Coverage configuration and options
8. Globals, environment and setup files
9. Running in CI, common CLI flags and exit codes
10. Troubleshooting and common fixes
11. Supplementary details (versions, compatibility)
12. Reference details (exact signatures, types)
13. Digest and retrieval
14. Attribution and data size

1. Installation and CLI
- Install: npm install --save-dev vitest
- Optional coverage provider: npm install --save-dev @vitest/coverage-v8
- CLI entrypoints and common flags:
  - npx vitest [--run] [--watch] [--update] [--config <file>] [--coverage] [--reporter <name>] [--threads <true|false>] [--silent]
  - Exit codes: 0 -> all tests passed, 1 -> test failures or fatal error (non-zero for CI detection)
  - Common scripts: "test": "vitest" ; "test:run": "vitest --run" ; "test:coverage": "vitest --run --coverage"

2. Configuration schema (vitest.config.js / defineConfig)
- Import helper: import { defineConfig } from 'vitest/config'
- Export pattern: export default defineConfig({ test: TestConfig })
- TestConfig object keys and types (explicit):
  - include: string[] | string    // glob(s) to include (default: ['**/*.test.*', '**/*.spec.*'])
  - exclude: string[] | string    // glob(s) to exclude (default: ['node_modules'])
  - environment: 'node' | 'jsdom' | string  // test environment
  - globals: boolean              // if true, provide global test APIs (describe, test, expect) without import
  - setupFiles: string[]          // paths to files run before tests (synchronous)
  - setupFilesAsync: string[]     // async setup files returning promise
  - reporters: Array<string|[string,any]>  // reporter names or tuples [name, options]
  - threads: boolean              // enable/disable worker threads
  - watch: boolean                // watch mode default
  - coverage: CoverageOptions     // see section 7
  - unsafe: { externalGlobals?: string[] } // advanced
- defineConfig signature: function defineConfig(cfg: Record<string, any>): Record<string, any>

3. Test lifecycle API (describe/it/test/before/after)
- describe(name: string, fn: () => void): void
- it(name: string, fn: () => void | Promise<any>): void
- test(name: string, fn: () => void | Promise<any>): void
- beforeAll(fn: () => void | Promise<any>, timeout?: number): void
- afterAll(fn: () => void | Promise<any>, timeout?: number): void
- beforeEach(fn: () => void | Promise<any>, timeout?: number): void
- afterEach(fn: () => void | Promise<any>, timeout?: number): void
- test.concurrent(name: string, fn: () => Promise<any>): void  // run test concurrently
- describe.each(table)(name, fn) and test.each(table)(name, fn) — parameterized table macros

4. Assertion API (expect) — complete method signatures
- expect(received: any): ExpectMatchers
- ExpectMatchers methods (primary subset with signatures):
  - toBe(expected: any): void
  - toEqual(expected: any): void
  - toStrictEqual(expected: any): void
  - toBeNull(): void
  - toBeUndefined(): void
  - toBeTruthy(): void
  - toBeFalsy(): void
  - toBeGreaterThan(expected: number): void
  - toBeGreaterThanOrEqual(expected: number): void
  - toBeLessThan(expected: number): void
  - toBeLessThanOrEqual(expected: number): void
  - toContain(item: any): void
  - toHaveLength(length: number): void
  - toMatch(regexpOrString: RegExp | string): void
  - toThrow(error?: string | RegExp | Error): void
  - toMatchSnapshot(snapshotName?: string | { id?: string }): void
  - toMatchInlineSnapshot(snapshot?: string): void
  - resolves / rejects helpers:
    - expect(Promise).resolves.toEqual(value)
    - expect(Promise).rejects.toThrow()
- Chaining: expect(value).not.toBe(x) — .not is supported returning inverted matcher set

5. Mocking API (vi) — functions and behaviors
- vi.fn(implementation?: Function): MockInstance
  - MockInstance shape: { (...args): any, mock: { calls: any[][], results: Array<{type:string, value:any}> } }
- vi.spyOn(object: Record<string, any>, method: string): SpyInstance
  - SpyInstance provides mock implementation overrides and restore(): void
- vi.mock(moduleId: string, factory?: () => object | Promise<object>, options?: { virtual?: boolean }): void
  - Behavior: module mocks must be hoisted; explicit vi.importActual available to import real module
- vi.clearAllMocks(): void  // clears mock call history
- vi.resetAllMocks(): void  // resets mock implementations to defaults
- vi.restoreAllMocks(): void  // restores spied implementations to originals
- vi.useFakeTimers(), vi.useRealTimers(), vi.advanceTimersByTime(ms: number): void — timer control for deterministic timing tests

6. Snapshot testing
- expect(value).toMatchSnapshot([name]) writes/compares a snapshot stored in __snapshots__ adjacent to test file
- To update snapshots: vitest -u or vitest --update
- Snapshot storage: files named <testfile>.snap or <testfile>__snapshots__/<testfile>.snap depending on runner; vitest follows Jest-compatible storage by default
- Inline snapshots supported: expect(value).toMatchInlineSnapshot(optionalSnapshotString)

7. Coverage configuration and options
- Enable via CLI or config: CLI --coverage or config.test.coverage: { enabled: true }
- Coverage provider options: 'v8' or 'c8' (provider: 'v8' recommended for Node 16+)
- CoverageOptions keys and types:
  - provider: 'v8' | 'c8'
  - enabled: boolean
  - reporter: string[]           // e.g., ['text', 'lcov']
  - reportsDirectory: string
  - include: string[] | string   // globs to include
  - exclude: string[] | string   // globs to exclude
  - all: boolean                 // collect coverage for all files
  - includeNodeModules: boolean
  - statements: number           // coverage thresholds (0-100)
  - branches: number
  - functions: number
  - lines: number
- Example usage: vitest --run --coverage --coverage-reporter=lcov

8. Globals, environment and setup files
- Globals option: when true, test APIs are exposed on global scope without imports
- environment options: 'node' (default for server tests) or 'jsdom' (for DOM tests)
- setupFiles: executed before test suite; use for global polyfills, test DB setup, env vars
- setupFilesAsync: supports async initialization returning a Promise
- teardown can be handled in afterAll hooks or custom teardown file referenced by configuration

9. Running in CI, common CLI flags and exit codes
- Recommended CI flags: --run --reporter=dot or --reporter=verbose --coverage
- Use --threads false in constrained CI containers if worker thread fork issues occur
- Exit codes: 0 success, 1 failures or fatal, 2 for configuration errors (consumer should check CLI docs for provider-specific codes)
- Parallelism: vitest spawns worker threads by default; set threads to false to force single-process deterministic run

10. Troubleshooting and common fixes
- "Cannot find module" when using vi.mock: ensure mock path matches resolved module id; use vi.mock(modulePath, {}, { virtual: true }) for virtuals
- Snapshot mismatches: run vitest -u to update snapshots after intended behavioral changes
- Coverage missing lines: ensure coverage.all true or include globs include source files, and provider set to 'v8'
- Globals not available: set globals: true in config or import test API from 'vitest'
- JSDOM DOM not found: set environment: 'jsdom' in config for DOM APIs in tests
- Worker/threads crashes in CI: use --threads false

11. Supplementary details (versions, compatibility)
- Recommended Node version: Node 16+ (Vitest supports modern Node; verify with vitest docs). Use Node >= 18 for best compatibility with v8 coverage provider.
- Typical devDependencies: "vitest": "^4.x", "@vitest/coverage-v8": "^4.x"
- File locations: vitest config file defaults: vitest.config.js or vitest.config.ts at repository root

12. Reference details (exact signatures, types)
- defineConfig(cfg: Record<string, any>): Record<string, any>
- describe(title: string, fn: () => void): void
- test(title: string, fn: () => void | Promise<any>, timeout?: number): void
- beforeEach(fn: () => void | Promise<any>, timeout?: number): void
- expect(value: any): ExpectMatchers
- ExpectMatchers.toBe(expected: any): void
- ExpectMatchers.toEqual(expected: any): void
- vi.fn(impl?: Function): MockInstance
- vi.mock(moduleId: string, factory?: Function | Record<string, any>, options?: { virtual?: boolean }): void
- vi.spyOn(obj: Record<string, any>, method: string): SpyInstance
- vi.useFakeTimers(): void ; vi.advanceTimersByTime(ms: number): void

13. Digest and retrieval
- Source: https://vitest.dev/guide/
- Retrieval date: 2026-03-08
- Extracted sections: Installation, CLI, Config schema, Test API, Assertions, Mocking, Snapshots, Coverage, Troubleshooting

14. Attribution and data size
- Attribution: content derived and condensed from Vitest official documentation at https://vitest.dev/guide/ (Vitest project)
- Data size obtained during crawling: approximately 48 KB (text extraction, approximate)
