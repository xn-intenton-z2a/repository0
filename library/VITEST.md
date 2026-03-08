VITEST

Table of contents
1. Normalised extract (actionable install, CLI, config rules)
2. Focused topics covered
3. Detailed information for each topic
   3.1 Installation and environment requirements
   3.2 CLI usage and exact commands
   3.3 Configuration file options (test property) with exact keys and types
   3.4 Projects support and merging strategies
   3.5 Automatic dependency prompts and env control
   3.6 IDE integration and examples
4. Supplementary details (file extension support, priority rules)
5. Reference details (method signatures, config schema snippets, exact env vars)
6. Detailed digest (sources and retrieval metadata)
7. Attribution and crawl data size

1. Normalised extract

Actionable install and environment requirements
- Install locally as a devDependency using your package manager: npm install -D vitest  OR yarn add -D vitest  OR pnpm add -D vitest  OR bun add -D vitest
- Runtime requirements: Node >= 20.0.0 and Vite >= 6.0.0 (Vitest relies on Vite transformation pipeline).
- To run without adding to package.json, use npx vitest which executes local binary if present; otherwise npx will fetch a temporary copy.

Exact CLI commands
- Run tests in watch mode (default): npx vitest  OR npm run test (if script test: "vitest")
- Run once (non-watch): npx vitest run  OR npm run test:run (script example: "test:run": "vitest run")
- Run with coverage: vitest run --coverage  (example npm script: "coverage": "vitest run --coverage")
- Pass custom config file: vitest --config ./path/to/vitest.config.ts
- See help: npx vitest --help

Configuration file and priority rules
- Vitest reads configuration in this order (higher overrides lower):
  1) explicit --config CLI option
  2) vitest.config.[js|mjs|cjs|ts|cts|mts]
  3) vite.config.[js|mjs|cjs|ts|cts|mts] (if test property present)
- Supported config file extensions: .js, .mjs, .cjs, .ts, .cts, .mts — NOTE: .json not supported.
- Typical top-level export for Vitest config: import { defineConfig } from 'vitest/config'  then export default defineConfig({ test: { /* options */ } })

Canonical test property keys (use inside defineConfig or vite config test property)
- test: {
    include?: string[] | string (glob patterns for tests; default matches \*.test.\* and \*.spec.\*),
    exclude?: string[] | string,
    environment?: 'node' | 'jsdom' | 'happy-dom' | string,
    globals?: boolean,
    setupFiles?: string[] (paths executed before tests),
    threads?: boolean | number,
    reporters?: string[] | ([name, options] arrays),
    coverage?: { provider?: string, enabled?: boolean, reporter?: string | string[], include?: string[], exclude?: string[] },
    watch?: boolean,
    isolate?: boolean,
    hookTimeout?: number (ms),
    testTimeout?: number (ms),
    name?: string (for project entries),
    root?: string (project root override),
  }

Exact merge strategy notes
- If vite.config contains a test property, vitest uses it; a vitest.config file has higher priority.
- For merging Vite config with Vitest config, use mergeConfig from 'vitest/config' or 'vite' to combine objects instead of manual overwrite.

Projects support (multi-project runs)
- test.projects: Array of glob patterns, config file paths, directories containing config, or inline project config objects.
- Example project item (inline): { test: { name: 'node', root: './shared_tests', environment: 'node', setupFiles: ['./setup.node.ts'] } }
- Projects run inside the same vitest process and allow running same tests under different configs.

Automatic dependency installation
- Vitest will prompt to install optional dependencies (e.g., jsdom) when needed for environments; disable with environment variable: VITEST_SKIP_INSTALL_CHECKS=1

IDE integration
- Official VS Code extension: Vitest Explorer (install from marketplace id: vitest.explorer)
- Use test runner UI provided by extension to run tests, view snapshots and coverage.

2. Focused topics covered
- Install/CLI commands and examples
- Config file names, priority and merging
- test config schema detail (keys, value types and semantics)
- Projects support and example shapes
- Environment-specific setup and disabling prompts
- Running unreleased or local builds

3. Detailed information for each topic

3.1 Installation and environment requirements
- Ensure Node >= 20 and Vite >= 6.0.0. If these are not met, vitest may fail during transform phase.
- Install command examples (exact): npm install -D vitest ; yarn add -D vitest ; pnpm add -D vitest ; bun add -D vitest
- For CI reproducible installs: use lockfile-driven commands (npm ci, pnpm install --frozen-lockfile, yarn install --frozen-lockfile).

3.2 CLI usage and exact commands
- npm script example minimal: "scripts": { "test": "vitest", "coverage": "vitest run --coverage" }
- To run tests once and generate coverage: npm run coverage (resolves to vitest run --coverage)
- To run specific tests by pattern: npx vitest run path/to/testfile.test.js or vitest -t "pattern"

3.3 Configuration file options (test property) with exact keys and types
- defineConfig usage: import { defineConfig } from 'vitest/config'; export default defineConfig({ test: { /* options */ } })
- include: string | string[] — globs or file patterns (default includes *.test.* and *.spec.*)
- environment: string — sets the test environment (node, jsdom, happy-dom). Use exact environment names supported by Vitest.
- setupFiles: string[] — file paths to execute before any tests run; these files can set globals or polyfills.
- reporters: string[] | Array<[string, Record]> — e.g., ["default"], [ ["junit", { outputFile: "junit.xml" }] ]
- coverage: object — provider: 'c8' | 'v8' | other provider names depending on installed coverage provider; enabled: boolean; reporter: 'text' | 'lcov' | ['text', 'lcov']
- hookTimeout/testTimeout: numeric milliseconds

3.4 Projects support and merging strategies
- Projects are defined under test.projects and accept: glob patterns to config files, directory paths with config, or inline project config objects.
- Use mergeConfig to combine existing vite config with test-specific overrides: import { mergeConfig } from 'vitest/config' or from 'vite'; export default mergeConfig(baseConfig, defineConfig({ test: { /* ... */ } }))

3.5 Automatic dependency prompts and env control
- To disable automatic prompts for optional environments/deps set: VITEST_SKIP_INSTALL_CHECKS=1 in the environment before running vitest.

3.6 IDE integration and examples
- VS Code: install Vitest Explorer extension (marketplace id: vitest.explorer). Extension recognizes workspace vitest config and provides tree-based test execution.
- For editors without official extension, run vitest with --reporter to output machine-parseable formats and integrate with editor runners.

4. Supplementary details
- File extension support for config: .js, .mjs, .cjs, .ts, .cts, .mts; vitest will not accept .json.
- Default test filename matching: files containing .test. or .spec. in the filename are included by default.
- Use process.env.VITEST or import.meta.env.mode to branch behavior inside config (VITEST is set to 'test' by default when running vitest).

5. Reference details (exact signatures, config schema snippets, env vars)

5.1 defineConfig (notation)
- import { defineConfig } from 'vitest/config'
- declare function defineConfig(config: Record): Record — returns config object for export; accepts top-level test property.

5.2 mergeConfig usage
- import { mergeConfig } from 'vitest/config'  OR import { mergeConfig } from 'vite'
- signature: mergeConfig(baseConfig: Record, overrideConfig: Record): Record

5.3 Example minimal vitest.config.ts (schema-compliant snippet)
- export default defineConfig({
    test: {
      include: ['tests/**/*.test.*', 'src/**/*.test.*'],
      environment: 'node',
      globals: true,
      setupFiles: ['./tests/setup.ts'],
      coverage: { provider: 'v8', enabled: true, reporter: ['text', 'lcov'] },
    }
  })

5.4 Important env vars
- VITEST_SKIP_INSTALL_CHECKS=1  -> disables automatic dependency install prompts
- VITEST (set internally) -> test mode indicator; available on import.meta.env.VITEST

6. Detailed digest (SOURCES.md extract and retrieval date)
- Sources consulted (retrieved 2026-03-08):
  - https://vitest.dev/guide/  (primary source for this document)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (context: module resolution & config file extension notes)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (context for input validation patterns referenced by tests)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (error semantics referenced by tests)
  - https://en.wikipedia.org/wiki/Fizz_buzz  (context: mission domain; problem definition)
  - https://www.npmjs.com/package/fizzbuzz  (attempted but returned 403 during crawl; not included)
- Retrieval timestamp: 2026-03-08T16:39:48.814Z (as provided by user)

7. Attribution and crawl data size
- Attributions:
  - Vitest guide, vitest.dev (primary): content retrieved and condensed into this document.
  - MDN JavaScript Modules, Number.isInteger, RangeError: used for supporting technical rules (file types, numeric validation and errors) referenced in example configs and test expectations.
  - Wikipedia Fizz buzz: high-level problem definition used for mission context.
- Data retrieved during crawl (approximate character counts):
  - vitest.dev/guide: ~13,500 chars
  - MDN Modules guide: ~14,000 chars (truncated at 15k in fetch)
  - MDN Number.isInteger: ~3,300 chars
  - MDN RangeError: ~2,300 chars
  - Wikipedia Fizz_buzz: ~3,200 chars
  - npm package page: fetch returned HTTP 403 (no data retrieved)

End of document.
