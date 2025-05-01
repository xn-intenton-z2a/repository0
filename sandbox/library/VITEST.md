# VITEST

## Crawl Summary
Installation commands: npm install -D vitest, yarn add -D vitest, pnpm add -D vitest. Requirements: Vite >= v5.0.0, Node >= v18.0.0. Writing tests sample provided with sum.js and sum.test.js. Configuration options include unified config via vite.config.ts or separate vitest.config.ts, merging configs via mergeConfig. CLI options include npx vitest, vitest run, and flags for watch, update, port, https. Detailed dependency optimization parameters, inlining options, and environment setup with 'node', 'jsdom', and workspaces are specified. Complete test, benchmark, and alias configuration options with type defaults. Detailed troubleshooting commands and best practices provided.

## Normalised Extract
Table of Contents
1. Installation
   - npm install -D vitest, yarn add -D vitest, pnpm add -D vitest; requires Vite >= v5.0.0 and Node >= v18.0.0.
2. Writing Tests
   - sum.js: export function sum(a, b) { return a + b }
   - sum.test.js: import { expect, test } from 'vitest'; test('adds 1 + 2 to equal 3', () => { expect(sum(1,2)).toBe(3) })
3. Package Configuration
   - package.json script: "test": "vitest"
4. Configuring Vitest
   - Use vitest.config.ts with defineConfig from 'vitest/config'.
   - Example: import { defineConfig } from 'vitest/config'; export default defineConfig({ test: { /* options */ } })
   - For Vite users: add triple slash reference type at top of config file.
   - Option to merge vite.config using mergeConfig.
5. CLI Options
   - Run tests via: npx vitest, npm run test, yarn test, pnpm test.
   - Use vitest run for one-time execution; flags include --config, --port, --https, --watch, --update.
6. Dependency Optimization
   - server.deps.external default: [/\/node_modules\//]; server.deps.inline can be list or true; fallbackCJS default false; cacheDir set to 'node_modules/.vite'.
7. Environment Setup
   - test.environment accepts 'node', 'jsdom', 'happy-dom', 'edge-runtime'; custom environments through vitest-environment-{name} packages.
8. Workspaces Support
   - Define multiple workspaces in test.workspace with individual config objects for different environments and setupFiles.
9. Additional Options
   - include, exclude patterns; globals, runner, benchmark configurations; alias options; pool settings for threads and forks.

Complete Details for Each Topic
1. Installation: Command examples precisely as above; ensure dependency versions meet requirements.
2. Writing Tests: Code examples for function and test file; file naming conventions (.test. or .spec.).
3. Package Configuration: Update package.json with test script.
4. Configuring Vitest: Use unified config file or separate vitest.config.ts; details for merging configs; available file extensions: .js, .mjs, .ts, .cts, .mts. Avoid .json.
5. CLI Options: Detailed usage; vitest binary options; use npx vitest --help to view full options.
6. Dependency Optimization: Inline modules using server.deps.inline, external modules via server.deps.external; options for optimizer include settings for web and ssr modes.
7. Environment Setup: Set test.environment; add reference types (vitest/config or vitest/jsdom) in config files; specify environment options via environmentOptions.
8. Workspaces: Define list of config files or directories in test.workspace; individual workspace objects include test: { name, root, environment, setupFiles }.
9. Additional Options: Full configuration key details with default values for include, exclude, globals, runner, benchmark options, alias definitions.


## Supplementary Details
Installation: npm install -D vitest; requires Vite version 5.0.0+ and Node 18+. Test file naming: must include .test. or .spec. Extension in file names. Package.json script: { "scripts": { "test": "vitest" } }.

Configuration: Use vitest.config.ts with defineConfig from 'vitest/config'. Supported file extensions: .js, .mjs, .cjs, .ts, .cts, .mts. Configuration keys include:
- test.include: string[], default ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
- test.exclude: string[], default typical exclusions such as node_modules, dist, cypress, etc.
- test.globals: boolean, default false
- test.environment: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime', default 'node'
- server.deps settings: external (default [/\/node_modules\//]), inline (list or true), fallbackCJS (boolean, default false), cacheDir ('node_modules/.vite')

CLI Options: vitest run for one time run; additional CLI flags include --config for specifying configuration file, --watch to enable file monitoring, --update to update snapshots.

Workspaces: Define test.workspace as an array of objects, each with a test property containing keys: name, root, environment, setupFiles.

Best Practices: Use unified configuration when possible; merge Vite config using mergeConfig to keep plugins consistent. Reference types using triple slash directives; for custom environments, install vitest-environment-{name} and export an Environment object with setup and teardown functions.

Troubleshooting: Run npx vitest --help for CLI flags; if running in Bun, use 'bun run test' instead of 'bun test'. Validate dependency installation and environment variables; if auto dependency installation causes issues, set VITEST_SKIP_INSTALL_CHECKS=1.


## Reference Details
API Specifications and SDK Method Signatures:

1. defineConfig (from vitest/config or vite):
   Signature: function defineConfig(config: { test?: TestOptions, [key: string]: any }): Config
   Example:
     import { defineConfig } from 'vitest/config'
     export default defineConfig({
       test: {
         include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
         exclude: ['**/node_modules/**', '**/dist/**'],
         globals: false,
         environment: 'node',
         deps: {
           external: [/\/node_modules\//],
           inline: [],
           fallbackCJS: false,
           cacheDir: 'node_modules/.vite'
         }
       }
     })

2. mergeConfig (from vitest/config):
   Signature: function mergeConfig(base: Config, override: Config): Config
   Example:
     import { defineConfig, mergeConfig } from 'vitest/config'
     import viteConfig from './vite.config.mjs'
     export default mergeConfig(viteConfig, defineConfig({
       test: { exclude: ['packages/template/*'] }
     }))

3. CLI Commands:
   - npx vitest --help: Displays full list of CLI options.
   - npm run test: Runs tests as per package.json configuration.
   - For updating snapshots: vitest --update
   - For running once: vitest run
   - For specifying configuration file: vitest --config ./path/to/vitest.config.ts

4. Code Examples:
   sum.js:
   export function sum(a: number, b: number): number {
     return a + b
   }

   sum.test.js:
   import { expect, test } from 'vitest'
   import { sum } from './sum.js'
   test('adds 1 + 2 to equal 3', () => {
     expect(sum(1, 2)).toBe(3)
   })

5. Configuration Options Exact Values:
   - test.include: Default ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
   - test.exclude: Default includes ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**']
   - server.deps.external: Default [/\/node_modules\//]
   - globals: boolean; set via --globals flag or in config; default false

6. Environment Configuration:
   - Set via test.environment with values: 'node', 'jsdom', etc.
   - Reference types using triple slash: /// <reference types="vitest/config" />

7. Best Practices:
   - Use a single config file for Vite and Vitest when possible.
   - Merge configurations instead of duplicating settings.
   - For external dependencies that are ESM, use deps.inline to force transformation if Node cannot handle them.

8. Troubleshooting Procedures:
   - Command: npx vitest --help to list options; if dependency errors occur, check VITEST_SKIP_INSTALL_CHECKS.
   - If tests are not finding configuration, ensure the configuration file is named correctly (vitest.config.ts) and placed in the project root.
   - Use logging and dumpModules (server.debug.dumpModules set to true) to trace module resolution issues.

Return Types: All configuration functions return a Config object that Vitest uses to initialize the test runner.


## Information Dense Extract
Vitest installation: npm install -D vitest; requires Vite>=5.0.0, Node>=18. Test files: sum.js (export function sum(a, b): number), sum.test.js (import { expect, test } from 'vitest'; test('adds 1+2 equals 3', ()=>{ expect(sum(1,2)).toBe(3) })). Package.json script: { "test": "vitest" }. Config file: vitest.config.ts using defineConfig from 'vitest/config'; keys: test.include (['**/*.{test,spec}.?(c|m)[jt]s?(x)']), test.exclude (['**/node_modules/**', ...]), globals (false), environment ('node'), server.deps (external: [/\/node_modules\//], inline: [], fallbackCJS: false, cacheDir: 'node_modules/.vite'). Merge config using mergeConfig. CLI: npx vitest, vitest run, flags --config, --watch, --update. Dependency Optimization: optimizer.web and optimizer.ssr modes for bundling; inline modules if necessary. Workspaces: test.workspace array with objects containing name, root, environment, setupFiles. Environment setup: specify with test.environment ('node', 'jsdom', etc.) with triple slash reference types. API: defineConfig(config: { test?: TestOptions, ... }), mergeConfig(base, override); CLI commands: npx vitest --help. Troubleshooting: use VITEST_SKIP_INSTALL_CHECKS=1, dumpModules via server.debug. Return Config object.

## Sanitised Extract
Table of Contents
1. Installation
   - npm install -D vitest, yarn add -D vitest, pnpm add -D vitest; requires Vite >= v5.0.0 and Node >= v18.0.0.
2. Writing Tests
   - sum.js: export function sum(a, b) { return a + b }
   - sum.test.js: import { expect, test } from 'vitest'; test('adds 1 + 2 to equal 3', () => { expect(sum(1,2)).toBe(3) })
3. Package Configuration
   - package.json script: 'test': 'vitest'
4. Configuring Vitest
   - Use vitest.config.ts with defineConfig from 'vitest/config'.
   - Example: import { defineConfig } from 'vitest/config'; export default defineConfig({ test: { /* options */ } })
   - For Vite users: add triple slash reference type at top of config file.
   - Option to merge vite.config using mergeConfig.
5. CLI Options
   - Run tests via: npx vitest, npm run test, yarn test, pnpm test.
   - Use vitest run for one-time execution; flags include --config, --port, --https, --watch, --update.
6. Dependency Optimization
   - server.deps.external default: [/'/node_modules'//]; server.deps.inline can be list or true; fallbackCJS default false; cacheDir set to 'node_modules/.vite'.
7. Environment Setup
   - test.environment accepts 'node', 'jsdom', 'happy-dom', 'edge-runtime'; custom environments through vitest-environment-{name} packages.
8. Workspaces Support
   - Define multiple workspaces in test.workspace with individual config objects for different environments and setupFiles.
9. Additional Options
   - include, exclude patterns; globals, runner, benchmark configurations; alias options; pool settings for threads and forks.

Complete Details for Each Topic
1. Installation: Command examples precisely as above; ensure dependency versions meet requirements.
2. Writing Tests: Code examples for function and test file; file naming conventions (.test. or .spec.).
3. Package Configuration: Update package.json with test script.
4. Configuring Vitest: Use unified config file or separate vitest.config.ts; details for merging configs; available file extensions: .js, .mjs, .ts, .cts, .mts. Avoid .json.
5. CLI Options: Detailed usage; vitest binary options; use npx vitest --help to view full options.
6. Dependency Optimization: Inline modules using server.deps.inline, external modules via server.deps.external; options for optimizer include settings for web and ssr modes.
7. Environment Setup: Set test.environment; add reference types (vitest/config or vitest/jsdom) in config files; specify environment options via environmentOptions.
8. Workspaces: Define list of config files or directories in test.workspace; individual workspace objects include test: { name, root, environment, setupFiles }.
9. Additional Options: Full configuration key details with default values for include, exclude, globals, runner, benchmark options, alias definitions.

## Original Source
Vitest Testing Framework Documentation
https://vitest.dev/

## Digest of VITEST

# Vitest Documentation Digest

Date Retrieved: 2023-11-29

This document provides the most impactful technical details for the Vitest testing framework. It includes installation commands, testing file examples, configuration file patterns, CLI options, dependency optimization settings, environment setups, and workspaces support.

## Installation

- Requirements: Vite >= v5.0.0 and Node >= v18.0.0.
- Commands:
  - npm: npm install -D vitest
  - yarn: yarn add -D vitest
  - pnpm: pnpm add -D vitest
  - bun: bun add -D vitest

## Writing Tests

- Sample Code for sum.js:

  export function sum(a, b) {
    return a + b
  }

- Sample Code for sum.test.js:

  import { expect, test } from 'vitest'
  import { sum } from './sum.js'

  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
  })

- Note: Test files must include .test. or .spec. in their filename.

## Package Configuration

- Add test script in package.json:

  "scripts": {
    "test": "vitest"
  }

## Configuring Vitest

- Use a unified configuration with Vite; Vitest reads vite.config.ts if available.
- To override, create a vitest.config.ts with higher priority or pass the --config option:

  Example vitest.config.ts:

  import { defineConfig } from 'vitest/config'

  export default defineConfig({
    test: {
      // custom options
    }
  })

- For Vite users, include a triple slash directive:

  /// <reference types="vitest/config" />
  import { defineConfig } from 'vite'

  export default defineConfig({
    test: {
      // specified options
    }
  })

## Merging Vite and Vitest Configurations

- Merge method using mergeConfig from 'vitest/config':

  import { defineConfig, mergeConfig } from 'vitest/config'
  import viteConfig from './vite.config.mjs'

  export default mergeConfig(viteConfig, defineConfig({
    test: {
      // override test options
    }
  }))

## CLI Options and Scripts

- Run tests with: npx vitest, npm run test, yarn test, or pnpm test.
- To run once without watch: vitest run
- Additional flags include --port, --https, --watch, and --update.

## Dependency Optimization and Transformation

- Dependencies are externalized by default (node_modules are bypassed).
- Configurable options:
  - server.deps.external: Default is [/\/node_modules\//]
  - server.deps.inline: Can be a list or true to inline all dependencies.
  - deps.optimizer options to bundle libraries (optimizer.web and optimizer.ssr modes).
  - Fallback for CommonJS modules: server.deps.fallbackCJS default false.
  - Cache directory: server.deps.cacheDir defaults to 'node_modules/.vite'

## Environment Setup

- Default environment: 'node'. Other options: 'jsdom', 'happy-dom', 'edge-runtime', or custom.
- Configure using test.environment in vitest.config.ts.
- To use custom environment, add a package named vitest-environment-{name} exporting an Environment object.

## Workspaces Support

- Define multiple workspace configurations in vitest.config.ts under test.workspace array.
- Workspaces support different test configs (e.g., one workspace for 'happy-dom', another for 'node').
- Example:

  export default defineConfig({
    test: {
      workspace: [
        {
          test: { name: 'happy-dom', root: './shared_tests', environment: 'happy-dom', setupFiles: ['./setup.happy-dom.ts'] }
        },
        {
          test: { name: 'node', root: './shared_tests', environment: 'node', setupFiles: ['./setup.node.ts'] }
        }
      ]
    }
  })

## Additional Configuration Options

- include: string[]; Default: ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
- exclude: string[]; Default: ['**/node_modules/**', '**/dist/**', ...]
- globals: boolean; Default false unless enabled via --globals flag.
- runner: 'node' or a custom runner path. 
- benchmark options: include and exclude patterns, reporters settings, and outputJson for saving benchmark results.

## Troubleshooting and Best Practices

- If tests do not run, verify your package versions (Vite and Node requirements).
- Use npx vitest --help for a full list of CLI options.
- For dependency issues, set VITEST_SKIP_INSTALL_CHECKS=1 to disable automatic dependency prompts.
- In CI or non-interactive environments, explicitly enable watch mode if needed.
- When using separate config files, ensure Vite options are consistent between vite.config and vitest.config as the latter overrides the former.

## Attribution and Data Size

- Crawled from https://vitest.dev/ with Data Size: 27488723 bytes and 22631 links found.


## Attribution
- Source: Vitest Testing Framework Documentation
- URL: https://vitest.dev/
- License: License: MIT
- Crawl Date: 2025-05-01T22:40:25.584Z
- Data Size: 27488723 bytes
- Links Found: 22631

## Retrieved
2025-05-01
