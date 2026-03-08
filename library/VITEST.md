VITEST

Table of contents
1. Normalised extract
2. Supplementary details
3. Reference details
4. Detailed digest (SOURCES.md extract)
5. Attribution and data size

1. Normalised extract

Actionable installation and CI commands
- Install as a development dependency: npm install --save-dev vitest
- Reproducible CI installs: npm ci && npm test
- Run tests once (CI mode): npx vitest --run
- Run with coverage: npx vitest --run --coverage or set coverage in config and use --coverage
- Run specific files: npx vitest --run tests/unit/*.test.js

Package.json scripts (exact examples)
- "test": "vitest --run tests/unit/*.test.js"
- "test:unit": "vitest --run --coverage tests/unit/*.test.js"
- "test:watch": "vitest"

Core test API (synchronous and async signatures)
- describe(name: string, fn: () => void | Promise<void>) -> void
- it(name: string, fn: () => any | Promise<any>, timeout?: number) -> void
- test(name: string, fn: () => any | Promise<any>, timeout?: number) -> void
- beforeEach(fn: () => void | Promise<void>) -> void
- afterEach(fn: () => void | Promise<void>) -> void
- beforeAll(fn: () => void | Promise<void>) -> void
- afterAll(fn: () => void | Promise<void>) -> void

Expect API (primary assertions and signatures)
- expect(actual).toBe(expected) -> void
- expect(actual).toEqual(expected) -> void
- expect(actual).toStrictEqual(expected) -> void
- expect(actual).toBeDefined() -> void
- expect(actual).toBeUndefined() -> void
- expect(actual).toBeNull() -> void
- expect(actual).toBeTruthy() / toBeFalsy() -> void
- expect(fn).toThrow(error?: string | RegExp | Error) -> void
- expect(promise).resolves / .rejects chains: expect(promise).resolves.toEqual(value)

Runner and environment
- Default CLI: npx vitest (interactive watch runner)
- CI-friendly run mode: --run to execute once and exit
- Environments: 'node' or 'jsdom' (configure in vitest.config.js as test: { environment: 'node' | 'jsdom' })
- Threading: tests run in workers by default; disable workers for debugging with --threads=false or config: test: { threads: false }

2. Supplementary details

Config file (vitest.config.js / vitest.config.ts)
- Import helper: import { defineConfig } from 'vitest/config'
- Minimal config example fields and types (exact keys):
  - test: { include?: string[], exclude?: string[], environment?: 'node' | 'jsdom', globals?: boolean, threads?: boolean, isolate?: boolean, setupFiles?: string[], setupFilesAfterEnv?: string[], deps?: { inline?: string[] }, timeout?: number }
  - coverage: { provider?: 'v8' | 'c8' | 'istanbul', reporter?: string[] | string, reportsDirectory?: string, all?: boolean, include?: string[], exclude?: string[] }
  - reporters: Array<string | [string, Record<string, unknown>]>
- Place config at project root as vitest.config.js or pass --config ./path/to/config

Common config values and effects
- test.include: array of glob strings for test entry files; commonly **/*.test.* and **/*.spec.*
- test.environment: 'node' forces Node-like globals; 'jsdom' provides DOM globals
- test.globals: when true, injects describe/it/test/expect into global scope
- test.timeout: per-test timeout in milliseconds (default 5000)
- test.threads: enable worker pool (true) improves parallelism; set false for single-process debugging
- coverage.provider: 'v8' (fast native V8 coverage) or 'c8'/'istanbul' depending on requirements
- coverage.reporter: array of reporter names (e.g., ['text','lcov'])

TypeScript and ESM notes
- Vitest supports ESM and TypeScript tests; if using ts, ensure tsconfig.json exists and Vite/tsconfig paths are aligned
- For ESM projects with "type": "module" use appropriate file extensions or transpilation as necessary

3. Reference details

Exact CLI flags and effects (commonly used)
- --run : boolean : run tests once and exit (CI)
- --coverage : boolean : collect coverage per coverage config
- --config <file> : string : use specified config file
- --threads <true|false|number> : control worker threads; false disables workers
- --reporter <name> : string : specify reporter (default, verbose, dot, json, etc.)
- --testNamePattern <string> : string : run tests whose names match pattern
- --update / -u : boolean : update snapshots

Exact vitest.config test options with types and typical defaults
- test.include: string[] | undefined
- test.exclude: string[] | undefined (node_modules excluded by default)
- test.environment: 'node' | 'jsdom' (default 'node')
- test.globals: boolean (default false)
- test.timeout: number (default 5000)
- test.threads: boolean (default true)
- test.isolate: boolean (default true)
- coverage.provider: 'v8' | 'c8' | 'istanbul'
- coverage.reporter: string[]
- coverage.reportsDirectory: string (default './coverage')

Expect/Matchers method signatures (representative)
- expect(value: any): { toBe: (expected: any) => void, toEqual: (expected: any) => void, toStrictEqual: (expected: any) => void, toBeNull: () => void, toBeUndefined: () => void, toBeTruthy: () => void, toBeFalsy: () => void, toContain: (item: any) => void, toHaveLength: (n: number) => void, toMatch: (regexpOrString: RegExp | string) => void, toThrow: (err?: string | RegExp | Error) => void }
- Async chains: expect(promise).resolves / expect(promise).rejects

Recommended minimal CI configuration (steps)
- npm ci
- npx vitest --run --coverage --reporter=verbose
- Collect coverage artifacts from coverage/ directory

4. Detailed digest (SOURCES.md extract) and retrieval date

Sources included for this extract (retrieved 2026-03-08):
- https://vitest.dev/guide/  (Vitest official guide)
- https://www.npmjs.com/package/fizzbuzz
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError

Retrieved date: 2026-03-08

5. Attribution and data size

Attribution: Vitest official documentation (https://vitest.dev/guide/) and MDN pages listed in SOURCES.md.
Data obtained during crawling: 5 source URLs, combined retrieved content approximately 6 KB (text only extraction).

End of VITEST document
