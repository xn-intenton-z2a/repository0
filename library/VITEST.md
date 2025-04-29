# VITEST

## Crawl Summary
Vitest is a Vite-native testing framework offering fast test execution, watch mode, and Jest compatibility. It supports ESM, TypeScript, JSX and provides unified configuration between Vitest and Vite. Key features include: installation via npm/yarn, writing tests using expect/test, advanced configuration via vitest.config.ts or vite.config.ts, CLI options for running tests and coverage, dependency optimization settings, alias configuration, custom environment support, and workspace configuration for running different project setups in a single process.

## Normalised Extract
Table of Contents:
1. Installation and Setup
   - npm install -D vitest, yarn add -D vitest, requirements: Vite >= v5.0.0, Node >= v18.0.0
2. Writing Tests
   - Test file naming (.test., .spec.)
   - Example: function sum(a,b) returns a+b; test using expect(sum(1,2)).toBe(3)
3. Configuration
   - Unified config with Vite; create vitest.config.ts if different test configuration needed
   - Use CLI flag --config; use process.env.VITEST or mode in defineConfig conditionally
   - Supported file extensions: .js, .mjs, .cjs, .ts, .cts, .mts (no .json support)
4. CLI Usage
   - Default commands: vitest, vitest run, vitest --watch
   - Scripts in package.json: "test": "vitest", "coverage": "vitest run --coverage"
5. Dependency Optimization and Aliasing
   - server.deps settings: external (default: [/\/node_modules\//]), inline options, fallbackCJS false, cacheDir 'node_modules/.vite'
   - Aliases defined via alias option with record or array structure
6. Environment Settings
   - environment option: 'node', 'jsdom', 'happy-dom', 'edge-runtime'
   - Use docblock comments (@vitest-environment jsdom) to override per file
7. Workspaces
   - Define workspace as an array in the test property in vitest.config.ts with glob patterns and config objects
8. Troubleshooting Steps
   - For Bun: use bun run test
   - Disable dependency auto-install by setting VITEST_SKIP_INSTALL_CHECKS=1
   - Use mergeConfig to combine separate Vite and Vitest configs

Each section provides specific, actionable configurations and examples directly usable by developers.

## Supplementary Details
Installation:
  - npm: npm install -D vitest
  - yarn: yarn add -D vitest
  - pnpm: pnpm add -D vitest
Requirements:
  - Vite >= v5.0.0
  - Node >= v18.0.0

Configuration Options in vitest.config.ts:
  - test.exclude: string[]; default ['**/node_modules/**', '**/dist/**', etc.]
  - test.include: string[]; default ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
  - test.globals: boolean; default false
  - test.environment: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime'; default 'node'
  - server.deps.external: (string | RegExp)[]; default [/\/node_modules\//]
  - server.deps.inline: (string | RegExp)[] | true; default []
  - Alias settings: alias: Record<string, string> or array of find/replacement objects

CLI Options:
  - --watch: Enables watch mode if interactive environment
  - --config: Specify alternative configuration file
  - --port, --https: Additional options for CLI
  - --globals: Enables global APIs similar to Jest

Implementation Steps for Merged Configurations:
1. Create vite.config.ts with standard Vite configuration
2. Create vitest.config.ts:
   import { defineConfig, mergeConfig } from 'vitest/config'
   import viteConfig from './vite.config.ts'
   export default mergeConfig(viteConfig, defineConfig({
     test: {
       exclude: ['packages/template/*'],
       globals: true,
       environment: 'jsdom'
     }
   }))

Best Practices:
  - Use the same config file for Vite and Vitest if possible to avoid conflicts
  - Keep test files named with .test. or .spec. extension
  - Use specific environment docblocks for tests requiring browser simulation

Troubleshooting:
  - If tests do not run as expected, verify Vite configuration is loaded
  - For dependency issues, check server.deps settings and inline configuration
  - For Bun users, run tests with: bun run test
  - To disable auto dependency installation, set environment variable: VITEST_SKIP_INSTALL_CHECKS=1

## Reference Details
API Specifications and SDK Method Signatures:

1. defineConfig (from 'vitest/config'):
   Signature: import { defineConfig } from 'vitest/config'
   Usage: defineConfig({ test: { <options> } })
   Options include:
     - exclude: string[] (default: ['**/node_modules/**', '**/dist/**', ...])
     - include: string[] (default: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'])
     - globals: boolean (default: false)
     - environment: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime' (default: 'node')
     - workspace: Array of config objects or glob patterns

2. mergeConfig (from 'vitest/config'):
   Signature: mergeConfig(viteConfig: object, vitestConfig: object) => object
   Usage: Combine Vite and Vitest configuration objects
   Example:
     import { defineConfig, mergeConfig } from 'vitest/config'
     import viteConfig from './vite.config.js'
     export default mergeConfig(viteConfig, defineConfig({ test: { exclude: ['packages/template/*'] } }))

3. CLI Commands:
   - Run tests: npx vitest
   - Run single test execution: vitest run
   - Run in watch mode: vitest --watch
   - Run coverage: vitest run --coverage
   - To specify custom configuration: vitest --config ./path/to/config.ts

4. Implementation Patterns:
   - For conditional configuration in vite.config.ts:
     /// <reference types="vitest/config" />
     import { defineConfig } from 'vite'
     export default defineConfig(({ mode }) => ({
       test: {
         // if mode is 'test', apply specific config
         globals: mode === 'test',
       }
     }))

5. Configuration Options Effects and Defaults:
   - test.exclude: excludes glob patterns, default patterns include node_modules and dist directories.
   - server.deps.external: externalize dependencies matching RegExp /\/node_modules\//.
   - globals: when true, makes Vitest available as global APIs for tests.
   - environment: defines the testing environment and influences available globals (e.g., jsdom provides document and window).

6. Best Practices Examples:
   - Use integrated configuration between Vite and Vitest by maintaining a single config file or merging using mergeConfig.
   - Consistently use .test. suffix for test files to ensure proper discovery.
   - Annotate files with @vitest-environment when a non-standard environment is necessary.

7. Troubleshooting Procedures:
   - To verify configuration loading, run: npx vitest --print-config
   - For dependency resolution issues, check the output of: npx vitest --debug
   - If tests fail due to missing packages, ensure proper installation with: npm install -D vitest and checking node_modules cache directory 'node_modules/.vite'
   - For alias issues, verify that alias entries in vite.config.ts are correctly merged into Vitest config.


## Information Dense Extract
Vitest, a Vite-native testing framework, requires Vite>=v5.0.0 and Node>=v18.0.0. Installation via npm/yarn/pnpm; tests must have .test. or .spec. suffix. Use defineConfig from 'vitest/config'; options include test.exclude (default: ['**/node_modules/**','**/dist/**']), test.include (['**/*.{test,spec}.?(c|m)[jt]s?(x)']), globals (false), environment ('node'). CLI: vitest, vitest run, vitest --watch, --coverage; merge config using mergeConfig. Dependency optimization via server.deps with external: [/\/node_modules\//], inline: [] default, fallbackCJS false, cacheDir 'node_modules/.vite'. Environment=

## Sanitised Extract
Table of Contents:
1. Installation and Setup
   - npm install -D vitest, yarn add -D vitest, requirements: Vite >= v5.0.0, Node >= v18.0.0
2. Writing Tests
   - Test file naming (.test., .spec.)
   - Example: function sum(a,b) returns a+b; test using expect(sum(1,2)).toBe(3)
3. Configuration
   - Unified config with Vite; create vitest.config.ts if different test configuration needed
   - Use CLI flag --config; use process.env.VITEST or mode in defineConfig conditionally
   - Supported file extensions: .js, .mjs, .cjs, .ts, .cts, .mts (no .json support)
4. CLI Usage
   - Default commands: vitest, vitest run, vitest --watch
   - Scripts in package.json: 'test': 'vitest', 'coverage': 'vitest run --coverage'
5. Dependency Optimization and Aliasing
   - server.deps settings: external (default: [/'/node_modules'//]), inline options, fallbackCJS false, cacheDir 'node_modules/.vite'
   - Aliases defined via alias option with record or array structure
6. Environment Settings
   - environment option: 'node', 'jsdom', 'happy-dom', 'edge-runtime'
   - Use docblock comments (@vitest-environment jsdom) to override per file
7. Workspaces
   - Define workspace as an array in the test property in vitest.config.ts with glob patterns and config objects
8. Troubleshooting Steps
   - For Bun: use bun run test
   - Disable dependency auto-install by setting VITEST_SKIP_INSTALL_CHECKS=1
   - Use mergeConfig to combine separate Vite and Vitest configs

Each section provides specific, actionable configurations and examples directly usable by developers.

## Original Source
Vitest Documentation
https://vitest.dev

## Digest of VITEST

# Vitest Documentation Digest

Retrieved on: 2023-10-XX

# Overview
Vitest is a next generation testing framework powered by Vite. It supports ESM, TypeScript, JSX and leverages Vite's config and plugins. It is compatible with Jest (expect, snapshot, coverage) and provides a fast, on-demand watch mode.

# Installation
- Install using npm: npm install -D vitest
- Install using yarn: yarn add -D vitest
- Requirements: Vite >= v5.0.0, Node >= v18.0.0

# Writing Tests
Example:
-------------
// sum.js
export function sum(a, b) {
  return a + b
}

// sum.test.js
import { expect, test } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

Package.json script addition:
{
  "scripts": {
    "test": "vitest"
  }
}

# Configuration
Vitest configuration is unified with Vite. It reads vite.config.ts by default. For separate config:
- Create vitest.config.ts with higher priority
- Use CLI option --config ./path/to/vitest.config.ts
- Use process.env.VITEST or mode property on defineConfig

Example using defineConfig:
/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Specify options such as exclude, globals, environment, workspace, etc.
  }
})

# CLI & Commands
Default CLI commands:
- Run tests: vitest or npx vitest
- Run in watch mode: vitest --watch
- Run with coverage: vitest run --coverage

# Dependency Optimization & Aliases
Configuration options include:
- server.deps with keys: external, inline, fallbackCJS, cacheDir
- Alias configuration via alias option

# Environment Configuration
Set environment using:
- environment: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime'
- Use docblock annotations: @vitest-environment jsdom

# Workspaces Support
Define multiple project configurations in vitest.config using the workspace array, with specific config objects for test, environment, root, and setupFiles.

# Troubleshooting & Best Practices
- Use proper test file naming (.test. or .spec.)
- Use mergeConfig from 'vitest/config' to combine Vite config with Vitest config if using separate files
- For Bun users: run tests with bun run test
- Disable auto dependency installation via VITEST_SKIP_INSTALL_CHECKS=1


## Attribution
- Source: Vitest Documentation
- URL: https://vitest.dev
- License: License: MIT License
- Crawl Date: 2025-04-29T04:46:27.864Z
- Data Size: 28807826 bytes
- Links Found: 23248

## Retrieved
2025-04-29
