VITEST

Table of contents
1. Normalised extract: actionable items
2. Supplementary details: config and environment
3. Reference details: exact commands, signatures, and config snippets
4. Detailed digest (source and retrieval date)
5. Attribution and data size

1. Normalised extract: actionable items
- Installation
  - npm: npm install -D vitest
  - yarn: yarn add -D vitest
  - pnpm: pnpm add -D vitest
  - bun: bun add -D vitest
  - Requirements: Vite >= 6.0.0, Node >= 20.0.0
- Running tests
  - Script: add "test": "vitest" to package.json scripts
  - Run once (CI): npx vitest run  OR npm run test (if script set to "vitest" or "vitest run")
  - Coverage run: vitest run --coverage  OR npm run coverage (map to vitest run --coverage)
  - Development watch mode: vitest --watch or npx vitest --watch
- Test file discovery
  - Default pattern: files containing .test. or .spec. (e.g., sum.test.js)
- Disable automatic dependency prompts: set VITEST_SKIP_INSTALL_CHECKS=1
- IDE: official VSCode extension id: vitest.explorer

2. Supplementary details: config and environment
- Unified config: Vitest reads vite.config.* by default; create vitest.config.ts for higher-priority test-specific config.
- Supported config file extensions: .js, .mjs, .cjs, .ts, .cts, .mts (not .json)
- TypeScript helpers: add /// <reference types="vitest/config" /> at top of vite.config.ts when using Vitest types
- Exact defineConfig usage:
  import { defineConfig } from 'vitest/config'
  export default defineConfig({
    test: {
      // test options
    }
  })
- Merge Vite and Vitest config:
  import { defineConfig, mergeConfig } from 'vitest/config'
  import viteConfig from './vite.config.mjs'
  export default mergeConfig(viteConfig, defineConfig({ test: { /* ... */ } }))
- Projects: test.projects accepts glob patterns, config file paths, or explicit project objects. Project object fields include test.name, root, environment, setupFiles.

3. Reference details: exact commands, signatures, and config snippets
- Install commands (exact):
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest
- Runtime requirements: Vite >= 6.0.0; Node >= 20.0.0
- package.json scripts example (exact JSON fragment):
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
- CLI representative signatures:
  vitest [run] [--config <file>] [--port <n>] [--https] [--coverage]
  npx vitest --help
- Environment variables:
  - VITEST_SKIP_INSTALL_CHECKS=1  (disable install prompts)
  - VITEST set to 'test' during runs and exposed via import.meta.env.VITEST
- Config API exact pattern:
  import { defineConfig } from 'vitest/config'
  export default defineConfig({ test: { /* options */ } })
- Projects config example shape:
  test: {
    projects: [
      'packages/*',
      'tests/*/vitest.config.{e2e,unit}.ts',
      {
        test: {
          name: 'happy-dom',
          root: './shared_tests',
          environment: 'happy-dom',
          setupFiles: ['./setup.happy-dom.ts']
        }
      }
    ]
  }
- Common test API signatures (import from 'vitest' or available as globals if enabled):
  describe(name: string, fn: () => void | Promise<void>): void
  it(name: string, fn: () => void | Promise<void>): void
  test(name: string, fn: () => void | Promise<void>): void
  beforeAll(fn: () => void | Promise<void>, timeout?: number): void
  afterAll(fn: () => void | Promise<void>, timeout?: number): void
  beforeEach(fn: () => void | Promise<void>, timeout?: number): void
  afterEach(fn: () => void | Promise<void>, timeout?: number): void
- vi mocks and spies (exact):
  vi.fn(impl?: Function): MockFunction
  vi.spyOn(object: object, method: string): SpyInstance
  vi.mock(modulePath: string, factory?: () => any): void
  vi.unmock(modulePath: string): void
  vi.resetAllMocks(): void
  vi.restoreAllMocks(): void

4. Troubleshooting and step-by-step fixes
- Tests not found: verify test.include patterns; ensure filenames include .test. or .spec.; check test.exclude doesn't remove them.
- Globals unavailable: set test.globals = true or import { describe, it, expect } from 'vitest'.
- Coverage missing: set coverage.include to source globs and coverage.all = true; ensure coverage.provider configured and dependency installed (e.g., @vitest/coverage-v8 for provider 'v8').
- DOM APIs missing: set test.environment = 'jsdom' and add necessary DOM polyfills in setupFiles.
- Slow tests due to workers: run with --threads=false or adjust test.sequence/maxWorkers.

5. Detailed digest (source and retrieval date)
- Primary source: https://vitest.dev/guide/  (content retrieved 2026-03-08)
- Related sources used for complementary technical details: MDN modules, Number.isInteger, RangeError, npm package metadata, Wikipedia FizzBuzz (all listed in project SOURCES.md)
- Retrieved content length: up to 15,000 characters returned by web fetch (truncated where applicable).

6. Attribution and data size
- Attribution: content condensed and normalized from Vitest Guide (vitest.dev) and related sources listed in project SOURCES.md, retrieved 2026-03-08.
- Approximate sizes retrieved during crawl (bytes, approximate):
  - vitest.dev/guide: ~6.1 KB
  - MDN Modules: ~12.0 KB
  - MDN Number.isInteger: ~2.2 KB
  - MDN RangeError: ~1.6 KB
  - npm fizzbuzz (fetch blocked 403): metadata access attempted; use npm view locally
  - Wikipedia Fizz Buzz: ~7.3 KB
- Total approximate bytes: ~29.2 KB

End of document.
