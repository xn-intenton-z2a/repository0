VITEST

Table of contents
1. Normalised extract
  1.1 Overview and purpose
  1.2 Installation and environment requirements
  1.3 Writing tests (file naming and basic API usage)
  1.4 Configuration (vite.config.ts / vitest.config.* and priority rules)
  1.5 Command-line usage and common flags
  1.6 Projects support (multiple test projects in one run)
  1.7 Automatic dependency installation behaviour
  1.8 IDE integration and examples
2. Supplementary details
  2.1 Environment constraints and compatibility
  2.2 Configuration file extensions supported
  2.3 Recommended script entries for package.json
3. Reference details
  3.1 Exact installation commands
  3.2 Config patterns and property shapes (defineConfig test block)
  3.3 CLI commands and effects
  3.4 Projects config schema (keys and types)
4. Detailed digest (source section and retrieval metadata)
5. Attribution and crawl data size

1. Normalised extract

1.1 Overview and purpose
Vitest is a Vite-powered test runner that reuses Vite's transform pipeline and plugin ecosystem to run unit and integration tests with near-instant startup and a Jest-like API surface.

1.2 Installation and environment requirements
- Supported package managers and exact install commands:
  - npm: npm install -D vitest
  - yarn: yarn add -D vitest
  - pnpm: pnpm add -D vitest
  - bun: bun add -D vitest
- Runtime requirements: Vite >= 6.0.0 and Node >= 20.0.0
- Use a local devDependency install for reproducible CI runs; fallback is npx vitest which executes local binaries first then global if missing.

1.3 Writing tests (file naming and basic API usage)
- Test files are discovered by filename patterns that include .test. or .spec. in the filename.
- Minimal test API example (conceptual, not fenced): import { expect, test } from 'vitest' then define test('desc', () => expect(fn()).toBe(value)).
- The test file returns test/expect/describe semantics; vitest exposes a Jest-like global API and an importable API.

1.4 Configuration (vite.config.ts / vitest.config.* and priority rules)
- Vitest will read vite.config.ts at project root when present, integrating Vite resolve.alias and plugins automatically.
- Priority rules for config: (highest) vitest.config.* > vite.config.* with test property > CLI --config option. When both vite.config and a separate vitest config exist, vitest.config overrides; to combine, use mergeConfig from 'vitest/config' or 'vite'.
- Config file reference shape: export default defineConfig({ test: { /* test options */ } }) where defineConfig comes from 'vitest/config'.
- Vitest supports .js, .mjs, .cjs, .ts, .cts, .mts for config files; .json is not supported.

1.5 Command-line usage and common flags
- Typical npm scripts: "test": "vitest" and "coverage": "vitest run --coverage".
- Run once without watch: vitest run
- CLI supports flags such as --port, --https, --config <path>, and standard vitest options exposed by the runner.
- Use npx vitest when not installed locally; use bun run test for Bun package manager to avoid invoking Bun's own test runner.

1.6 Projects support (multiple test projects in one run)
- test.projects accepts a list of globs, directories, config file paths, or inline configuration objects with shape { test: { name, root, environment, setupFiles } }.
- Use projects to run different environments (node/happy-dom) or separate roots with different setup files in a single vitest execution.

1.7 Automatic dependency installation behaviour
- Vitest may prompt to install missing dependencies; to disable prompts set environment variable VITEST_SKIP_INSTALL_CHECKS=1.

1.8 IDE integration and examples
- Official VS Code extension available at marketplace under vitest.explorer to run tests and view results inside the editor.
- Examples and runnable playgrounds exist for frameworks (basic, fastify, in-source-test, lit, vue, react, svelte, etc.) with GitHub example links and StackBlitz playground links.

2. Supplementary details

2.1 Environment constraints and compatibility
- Vitest relies on Vite's transform pipeline; even if the project does not otherwise use Vite, Vitest's transform requires Vite internals; configure Vite-related properties in the test config when needed.

2.2 Configuration file extensions supported
- Supported: .js, .mjs, .cjs, .ts, .cts, .mts. Not supported: .json.

2.3 Recommended script entries for package.json
- test: "vitest"
- coverage: "vitest run --coverage"
- Use npm ci in CI for reproducible installs prior to running tests.

3. Reference details

3.1 Exact installation commands
- npm install -D vitest
- yarn add -D vitest
- pnpm add -D vitest
- bun add -D vitest
- Run without local install: npx vitest
- For Bun users run tests via: bun run test (do not use bun test)

3.2 Config patterns and property shapes
- Minimal vitest config pattern (conceptual):
  - import { defineConfig } from 'vitest/config'
  - export default defineConfig({ test: { /* options */ } })
- Key config properties used in guide examples: projects (Array<string|object>), environment (string, e.g., 'node' or 'happy-dom'), setupFiles (Array<string>), name (string), root (string)
- Config merge pattern: import { defineConfig, mergeConfig } from 'vitest/config' and merge vite config with defineConfig({ test: {...} }) if you want to reuse Vite settings.

3.3 CLI commands and effects
- vitest (watch mode, default) — runs in interactive/watch mode
- vitest run — runs tests once (CI-friendly)
- vitest --config <path> — use specific config
- vitest run --coverage — run once and collect coverage
- Environment overrides: process.env.VITEST is set to 'test' when running; import.meta.env contains VITEST value as well.

3.4 Projects config schema (keys and types)
- projects: Array of
  - string globs (e.g., 'packages/*') or
  - config file paths (e.g., 'tests/*/vitest.config.{e2e,unit}.ts') or
  - inline objects: { test: { name: string, root: string, environment: string, setupFiles: Array<string> } }

4. Detailed digest
Source: vitest.dev/guide/
Content retrieved: 2026-03-08
Extracted sections: Getting Started, Overview, Adding Vitest, Writing Tests, Configuring Vitest, Projects Support, CLI, Automatic Dependency Installation, IDE Integrations, Examples, Using Unreleased Commits, Community

5. Attribution and crawl data size
- Source URL: https://vitest.dev/guide/
- Retrieval date: 2026-03-08
- Crawl data size (approximate characters extracted from page): 13,200 characters
- Attribution: content adapted from Vitest documentation (https://vitest.dev/guide/), licensed under the original site's terms; please consult upstream for authoritative, up-to-date API details.
