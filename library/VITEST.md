VITEST

Table of contents
1. Normalised extract
2. Supplementary details
3. Reference details (commands, config API, signatures)
4. Troubleshooting and best practices
5. Detailed digest (source + retrieval date)
6. Attribution and data size

1. Normalised extract

Supported environment and installation
- Minimum requirements: Node >= 20.0.0 and Vite >= 6.0.0 (Vitest relies on Vite transformation pipeline).
- Install as a dev dependency (preferred):
  - npm install -D vitest
  - yarn add -D vitest
  - pnpm add -D vitest
  - bun add -D vitest
- Can be executed without installation via npx vitest (executes local binary if present, otherwise temporary install).
- To test unreleased commits: npm i https://pkg.pr.new/vitest@{commit} or build & pnpm link --global from source (pnpm required for build step).

Test discovery and file naming
- Default test filename pattern: files containing .test. or .spec. in their filename (e.g., sum.test.js, util.spec.ts).
- By default, run in watch mode when using vitest; run once using vitest run or npm script that calls vitest run.

Package.json scripts (recommended)
- Example:
  {
    "scripts": {
      "test": "vitest",
      "coverage": "vitest run --coverage"
    }
  }
- For CI and single-run use: npm run test (if script calls vitest run) or vitest run directly.

Configuration
- Vitest reads configuration from vite.config.(js|ts|mjs|cjs) if present. To override or prioritize a test-specific config create vitest.config.(ts|js|mjs|cjs).
- Supported config file extensions: .js, .mjs, .cjs, .ts, .cts, .mts (not .json).
- Use defineConfig from 'vitest/config':
  import { defineConfig } from 'vitest/config'
  export default defineConfig({ test: { /* options */ } })
- Merging Vite and Vitest configs: use mergeConfig from 'vitest/config' or reuse the same file with a test property; vitest.config has priority if both are present.

Key test config fields (test)
- test.projects: array of project globs or config objects. Each project config can include name, root, environment, setupFiles, and more.
- test.environment: test runtime environment, e.g., 'node', 'happy-dom', 'jsdom' (depending on environment support/plugins).
- test.setupFiles: array of paths to files executed before tests (setup/teardown initialization).
- test.root: root directory for project-specific tests.
- test.name: logical project name for reporting.

CLI options and behavior
- vitest run          -> run tests once (non-watch)
- vitest              -> starts in watch/dev mode by default (file watching and interactive output)
- vitest --config ./path/to/vitest.config.ts  -> use explicit config file
- vitest --help       -> display CLI options
- Coverage: vitest run --coverage (or vitest run --coverage --coverage-provider=v8) depending on provider config

Automatic dependency prompts
- Vitest may prompt you to install certain dependencies if they are not already installed; disable prompts with environment variable: VITEST_SKIP_INSTALL_CHECKS=1

IDE integration
- Official VS Code extension: vitest.explorer (install from Marketplace) for test explorer UI and inline test controls.

2. Supplementary details

Projects example (config object compact form)
- vitest.config.ts excerpt:
  import { defineConfig } from 'vitest/config'
  export default defineConfig({
    test: {
      projects: [
        'packages/*',
        'tests/*/vitest.config.{e2e,unit}.ts',
        {
          test: {
            name: 'happy-dom',
            root: './shared_tests',
            environment: 'happy-dom',
            setupFiles: ['./setup.happy-dom.ts'],
          }
        }
      ]
    }
  })

Config precedence and merging patterns
- Prefer a single combined vite.config with a test property to avoid divergent behavior; if using two files, use mergeConfig(viteConfig, defineConfig({ test: {...} })) to keep shared Vite settings.
- When using TypeScript config, include triple-slash directive for Vitest types: /// <reference types="vitest/config" /> at the top of vite.config.ts when referencing Vitest types.

Running with alternative package managers
- Bun: use bun run test to execute the project's test script; do not use bun test which invokes Bun's internal test runner.
- pnpm/yarn: use their respective run commands (pnpm test, yarn test).

Using latest/unreleased commits
- To test local modifications of Vitest: clone repo, pnpm install, pnpm run build, cd packages/vitest, pnpm run build, pnpm link --global, then in project run pnpm link --global vitest.

3. Reference details (commands, config API, signatures)

Install commands
- npm install -D vitest
- yarn add -D vitest
- pnpm add -D vitest
- bun add -D vitest

Run commands
- npx vitest                   # run local or temporary binary
- vitest                      # runs in watch/dev by default
- vitest run                  # run tests once (non-watch)
- vitest run --coverage       # run once with coverage
- vitest --config <path>      # use specific config file
- vitest --help               # list CLI options

Environment variable
- VITEST_SKIP_INSTALL_CHECKS=1  -> disable automatic dependency install prompts

Config API (essential signatures)
- import { defineConfig } from 'vitest/config'
- export default defineConfig({ test: { /* fields below */ } })

Test config fields (explicit signatures and types - distilled)
- test: {
    include?: string[] | string         # glob patterns to include
    exclude?: string[] | string         # glob patterns to exclude
    includeSource?: boolean             # include source files in coverage
    environment?: string                # 'node' | 'happy-dom' | 'jsdom' | custom
    setupFiles?: string[]                # paths to setup files
    globals?: boolean                   # whether to inject globals like describe/test/expect
    threads?: boolean | number          # run tests in worker threads or number of workers
    isolate?: boolean                   # isolate tests from each other
    reporters?: any[]                   # reporter configs
    coverage?: { provider?: string, enabled?: boolean, reportsDirectory?: string, ... }
    projects?: Array<string | object>   # project configs or globs
  }

Project config object (structure)
- { test: { name?: string, root?: string, environment?: string, setupFiles?: string[], include?: string[] } }

Programmatic config merging
- import { defineConfig, mergeConfig } from 'vitest/config'
- export default mergeConfig(viteConfig, defineConfig({ test: { /* overrides */ } }))

Test runner usage (API)
- import { test, expect } from 'vitest'
- test(name: string, fn: () => void | Promise<void>)
- expect(value).toBe(expected) and full matcher set similar to Jest (see Vitest API docs for full list)

4. Troubleshooting and best practices

Common issues and fixes
- Tests not found: ensure filenames contain .test. or .spec. or set include globs in test config; confirm test.root is correct for project config.
- Wrong config applied: vitest uses vitest.config.* before vite.config.*; use --config to force a particular file or merge configs to avoid mismatch.
- Environment mismatch: set test.environment to 'node' or appropriate DOM environment; install environment adapters (happy-dom/jsdom) if necessary.
- Node/Vite versions: upgrade Node to >=20 and Vite to >=6 to match Vitest requirements.
- Bun users: run tests with bun run test, not bun test.
- Coverage not generated: run vitest run --coverage and ensure coverage.provider set (v8 or c8) and that coverage options are enabled in config.
- Prompts for dependencies: set VITEST_SKIP_INSTALL_CHECKS=1 to avoid interactive prompts in CI.

Best practices
- Keep a single source-of-truth config when possible (use vite.config with test property), or explicitly merge to avoid divergence.
- Use project configs to separate e2e/unit settings and different environments.
- Pin Vitest versions in CI for reproducible results and use lockfile-aware installs (npm ci, pnpm install --frozen-lockfile).
- Add a test script to package.json that calls vitest (and vitest run in CI) to standardize commands across environments.

5. Detailed digest (source + retrieval date)

Source: https://vitest.dev/guide/
Retrieved: 2026-03-08
Extracted technical content: installation commands, minimum Node/Vite versions, test filename patterns, package.json script examples, configuration file names and extensions, defineConfig/mergeConfig usage, projects/test config fields, CLI commands (vitest, vitest run, --config, --help), environment variable VITEST_SKIP_INSTALL_CHECKS, IDE integration reference, running unreleased commits instructions.

6. Attribution and data size

Attribution
- Primary source: Vitest docs (https://vitest.dev/guide/), content reproduced here for implementation purposes with attribution.
- Additional context referenced from MDN and Wikipedia present in project SOURCES.md.

Data size obtained during crawling (approximate)
- URLs attempted: 6; successful fetches: 5; failed fetch: npm package page (403).
- Total approximate characters fetched: ~57,000 characters across all successful pages (Vitest guide ~22k, MDN modules ~18k, Number.isInteger ~2k, RangeError ~2k, Wikipedia FizzBuzz ~1k). These are approximate counts obtained from the fetched content.

[END OF DOCUMENT]