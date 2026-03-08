VITEST

Table of contents
1. Normalised extract
  1.1 Overview and requirements
  1.2 Installation commands and recommendations
  1.3 Test discovery and file naming
  1.4 CLI entry points and common commands
  1.5 Configuration locations and file types
  1.6 Config schema highlights (test.projects and top-level test options)
  1.7 Running in CI and coverage
  1.8 Automatic dependency prompts and environment variables
  1.9 IDE integration and recommended workflows
2. Supplementary details
  2.1 Merging Vite and Vitest config patterns
  2.2 Projects support and examples
  2.3 Example package.json scripts (text form)
3. Reference details (exact API/options and values)
  3.1 Config option signatures and accepted types
  3.2 CLI flags and semantics
  3.3 Environment variables affecting behavior
4. Detailed digest
  4.1 Source URL and retrieval date
  4.2 Crawl data size
5. Attribution

1. Normalised extract

1.1 Overview and requirements
- Vitest is a Vite-powered test runner; it relies on Vite's transformation pipeline and plugin ecosystem.
- Hard requirements: Vite >= 6.0.0 and Node >= 20.0.0.
- Vitest can be run locally (installed as a dev dependency) or invoked via npx when not installed.

1.2 Installation commands and recommendations
- Install as a dev dependency with your package manager (choose one):
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest
- For reproducible CI installs pin versions in package.json and use lockfile-driven installs (npm ci, yarn --frozen-lockfile, pnpm install --frozen-lockfile).
- If testing unreleased commits, install via git tarball URL or follow the repository build and link workflow (pnpm required for local builds in upstream project).

1.3 Test discovery and file naming
- Vitest by default discovers files with .test. or .spec. in the file name (e.g., example.test.js, example.spec.ts).
- Tests are executed in the environment declared by configuration (node, jsdom/happy-dom, etc.).

1.4 CLI entry points and common commands
- Binary: vitest (project-local when installed) or npx vitest.
- Common commands/semantics (run once vs watch):
  vitest run  -> run tests once (non-watch), suitable for CI.
  vitest      -> default runner, commonly used for interactive/watch workflows.
  vitest run --coverage  -> run tests and produce coverage report (coverage provider configured in config).
- Pass --config <path> to point to a specific config file (vitest --config ./vitest.config.ts).
- Use --help to list CLI options.

1.5 Configuration locations and file types
- Vitest reads test config from the test property in vite.config.* if present, or from a dedicated vitest.config.* file which wins.
- Supported config file extensions: .js, .mjs, .cjs, .ts, .cts, .mts (JSON is not supported).
- When both vite.config and vitest.config exist, vitest.config has higher priority; merging is manual or via mergeConfig helper.

1.6 Config schema highlights (test.projects and top-level test options)
- Configuration is defined via defineConfig from vitest/config or the test property inside Vite config; primary shape: { test: { /* options */ } }.
- Notable options and types:
  test.environment: string | 'node' | 'happy-dom' | 'jsdom' etc.
  test.setupFiles: string[] -> files run before tests to set up global state.
  test.projects: Array<string | object> -> supports glob patterns for multiple project configs or inline project objects with test overrides.
  test.name: string -> optional project name used for reporting.
  test.root: string -> root path for project.
  test.include / test.exclude: glob patterns arrays for test file discovery.
  test.coverage: object -> coverage config options (provider, reporter, include/exclude globs).
- Config files may import and reuse Vite config and should use triple-slash directive for TypeScript types when necessary (/// <reference types="vitest/config" />).

1.7 Running in CI and coverage
- Use vitest run in CI to perform a single run; add coverage flag for coverage reporting: vitest run --coverage or an npm script mapping.
- Recommended package.json scripts: test: "vitest" (interactive) and coverage: "vitest run --coverage" (CI).

1.8 Automatic dependency prompts and environment variables
- Vitest can prompt to auto-install missing peer dependencies; disable prompts with VITEST_SKIP_INSTALL_CHECKS=1 in the environment to avoid interactive behavior in CI.

1.9 IDE integration and recommended workflows
- Official VS Code extension available: vitest.explorer (install from VS Code Marketplace) to run tests and visualize results inside the editor.
- For TypeScript projects add reference to Vitest types in config files to get completions and type checking.

2. Supplementary details

2.1 Merging Vite and Vitest config patterns
- Recommended: use a single config file for both Vite and Vitest (vite.config.ts with a test property) to avoid duplication.
- If separate files are needed, use mergeConfig from vitest/config or vite to programmatically merge base Vite options into vitest config and ensure plugin alignment.
- When overriding, remember Vitest config takes precedence over the Vite config when Vitest reads it directly.

2.2 Projects support and examples
- test.projects accepts:
  - globs pointing to config files or directories with config files (e.g., 'packages/*').
  - explicit inline objects: { test: { name: 'node', root: './shared_tests', environment: 'node', setupFiles: ['./setup.node.ts'] } }.
- Projects run inside the same Vitest process, allowing cross-project reuse and different environments in one invocation.

2.3 Example package.json scripts (text form)
- "test": "vitest"  (interactive/watch)
- "test:run": "vitest run"  (one-off run for CI)
- "coverage": "vitest run --coverage"  (run with coverage)

3. Reference details (exact API/options and values)

3.1 Config option signatures and accepted types
- test: object
  - test.environment: string (supported values include 'node', 'jsdom', 'happy-dom', and custom environments provided by plugins)
  - test.setupFiles: string[]
  - test.include: string[] | undefined (glob patterns)
  - test.exclude: string[] | undefined (glob patterns)
  - test.projects: Array<string | object> where object contains a nested test object
  - test.root: string
  - test.name: string
  - test.coverage: object (provider: string, reporter: string|array, include: string[] , exclude: string[])

3.2 CLI flags and semantics (not exhaustive, main usages)
- run: switch to non-watch single-run mode (vitest run)
- --config <path>: specify config file
- --coverage: enable coverage collection during a run
- --help: display CLI help

3.3 Environment variables affecting behavior
- VITEST_SKIP_INSTALL_CHECKS=1 disables automatic dependency prompts and auto-install checks.
- process.env.VITEST is set to 'test' by Vitest during test runs; can be used inside config conditionals.

4. Detailed digest

4.1 Source URL and retrieval date
- Source: https://vitest.dev/guide/
- Retrieval date: 2026-03-08T20:07:23.112Z

4.2 Crawl data size
- Extracted content length from the source: approximately 13,200 characters.

5. Attribution
- Content extracted from Vitest official documentation: https://vitest.dev/guide/ (Vitest project). Retrieved 2026-03-08. Crawl data size approximately 13,200 characters.

[END]
