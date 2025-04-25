# VITEST

## Crawl Summary
Vitest is a Vite-native testing framework supporting ESM, TypeScript, JSX. Installation via npm/yarn/pnpm/bun, requires Vite>=v5.0.0 and Node>=v18.0.0. Key topics include writing tests with sample code files (sum.js, sum.test.js), unified configuration via vite.config or a separate vitest.config, workspace support for monorepos, CLI usage with options for running tests and coverage, dependency optimization settings (inline, external, cacheDir) and extensive configuration options (include, exclude, globals, environment, alias). Troubleshooting includes ensuring correct versions, handling dependency inline issues, and using proper commands for different package managers.

## Normalised Extract
Table of Contents:
1. Installation
   - npm: npm install -D vitest
   - yarn: yarn add -D vitest
   - pnpm: pnpm add -D vitest
   - bun: bun add -D vitest
   - Requirements: Vite >= v5.0.0; Node >= v18.0.0
2. Writing Tests
   - Example Code: 
     File: sum.js
       export function sum(a, b) { return a + b }
     File: sum.test.js
       import { expect, test } from 'vitest'
       import { sum } from './sum.js'
       test('adds 1 + 2 to equal 3', () => { expect(sum(1, 2)).toBe(3) })
   - Package.json Script: { "scripts": { "test": "vitest" } }
3. Configuring Vitest
   - Use vitest.config.ts with defineConfig from 'vitest/config'
   - Options specified under test property; sample configuration:
       import { defineConfig } from 'vitest/config'
       export default defineConfig({ test: { /* options here */ } })
   - CLI option: vitest --config <path>
   - Environment variable: process.env.VITEST
4. Workspace Support
   - Define workspaces in vitest.workspace.ts with defineWorkspace
   - Glob patterns and specific overrides with test configurations
5. Command Line Interface
   - Default scripts: test and coverage in package.json
   - Options: vitest run, --port, --https, --help
6. Dependency & Optimization
   - test.deps.external default: [/\/node_modules\//]
   - test.deps.inline: array/string/true to force processing via esbuild
   - Cache: 'node_modules/.vite'
7. Advanced Config Options
   - include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
   - exclude: ['**/node_modules/**', '**/dist/**', etc.]
   - globals: boolean flag for global API
   - environment: e.g., 'node', 'jsdom', 'happy-dom', 'edge-runtime'
   - alias: mapping for module resolution
   - reporters, update, watch, root, and base dir settings
8. Troubleshooting and Best Practices
   - Verify version requirements
   - Use --update for snapshot changes
   - For dependency issues, adjust deps.inline or fallbackCJS
   - Use correct CLI commands (e.g., bun run test for Bun)

Detailed Technical Information:
Installation commands, sample test files, configuration file structure including merging Vite and Vitest configurations, complete parameter defaults for options such as include, exclude, globals, environment; and CLI commands for running tests with coverage and debugging options are provided as listed above.

## Supplementary Details
Vitest Technical Specifications:
- Install Vitest via package managers; ensure Vite (>=v5.0.0) and Node (>=v18.0.0).
- Configuration Options (in vite.config or vitest.config):
   test: {
     include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
     exclude: ['**/node_modules/**', '**/dist/**', '**/[config|vite,vitest,jest,ava,...].config.*'],
     globals: false,
     environment: 'node',
     alias: { },
     reporters: 'default',
     update: false,
     watch: !process.env.CI,
     deps: {
       external: [/\/node_modules\//],
       inline: [],
       fallbackCJS: false,
       cacheDir: 'node_modules/.vite',
       optimizer: {
         ssr: { enabled: false },
         web: { enabled: false }
       }
     }
   }
- Workspace: Define in vitest.workspace.ts using defineWorkspace with glob patterns and inline configuration overrides.
- CLI Commands:
   - Run tests: vitest or npx vitest
   - Run tests once: vitest run
   - Coverage: vitest run --coverage
   - Help: npx vitest --help
- Dependency Optimization:
   - External dependencies by default are those in node_modules
   - Inline configuration can be specified for problematic modules
   - Configuration merging can be done via mergeConfig from 'vitest/config'
- Best Practices:
   - Use a single config file when possible
   - For monorepos, define clear workspace boundaries in vitest.workspace.ts
   - Update snapshots with --update flag and disable automatic dependency installation with VITEST_SKIP_INSTALL_CHECKS=1 if needed
- Troubleshooting:
   1. Check version compatibility (Vite, Node)
   2. Use correct CLI commands (e.g., bun run test for Bun)
   3. For module resolution errors, adjust deps.inline or fallbackCJS parameter
   4. Refer to error outputs from npx vitest --help if issues persist.

## Reference Details
API Specifications and SDK Method Signatures:

1. defineConfig from 'vitest/config'
   Signature: function defineConfig(config: { test?: TestOptions }): Config
   TestOptions includes parameters:
     - include: string[] (default ['**/*.{test,spec}.?(c|m)[jt]s?(x)'])
     - exclude: string[] (default ['**/node_modules/**', '**/dist/**', ...])
     - globals: boolean (default false)
     - environment: string (e.g., 'node', 'jsdom', 'happy-dom')
     - deps: { external: (string|RegExp)[], inline: (string|RegExp)[]|true, fallbackCJS: boolean, cacheDir: string, optimizer: { ssr: { enabled: boolean }, web: { enabled: boolean } } }
     - reporters: Reporter | Reporter[] (default 'default')
     - update: boolean (default false)
     - watch: boolean (default based on CI env)
     - root: string (project root path)

2. CLI Options:
   - Command: vitest [options]
   - Options include:
     --config <path>: Specify an alternative configuration file
     --port <num>: Set server port
     --https: Enable https
     --update: Update snapshot files
     --watch: Enable watch mode
     --coverage: Run tests with coverage

3. Code Examples:

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

// vitest.config.ts
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
    },
    reporters: 'default',
    update: false,
    watch: false
  }
})

4. Troubleshooting Procedures:
   - Verify package versions: Command: node -v and vite --version
   - For inline dependency issues, set deps.inline: true or specify problematic module patterns
   - Use CLI command: npx vitest --help for full options list
   - For configuration merge issues, use mergeConfig from 'vitest/config' as shown:

     import { defineConfig, mergeConfig } from 'vitest/config'
     import viteConfig from './vite.config'
     export default mergeConfig(viteConfig, defineConfig({ test: { exclude: ['packages/template/*'] } }))

5. Environment Configuration:
   - Use triple slash references for TypeScript: /// <reference types="vitest/config" />
   - For jsdom, add vitest/jsdom to tsconfig types

6. Best Practices:
   - Use a unified configuration by merging Vite and Vitest configs
   - For monorepos, clearly define workspaces in vitest.workspace.ts
   - Always run tests with explicit scripts in package.json to avoid ambiguity

Every parameter, method signature, and CLI option is provided with its default and expected data types as per the Vitest documentation.

## Information Dense Extract
Vitest: Next-gen testing framework using Vite. Install via npm, yarn, pnpm, bun; requires Vite>=5.0.0, Node>=18.0.0. Test files must include .test. or .spec. Extensions. defineConfig({ test: { include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'], exclude: ['**/node_modules/**', '**/dist/**'], globals: false, environment: 'node', deps: { external: [/\/node_modules\//], inline: [], fallbackCJS: false, cacheDir: 'node_modules/.vite' }, reporters: 'default', update: false, watch: false } }). CLI: vitest, vitest run, --config, --coverage, --update, --watch. Workspace support via defineWorkspace with glob patterns. Dependency optimization: inline modules via esbuild; fallbackCJS for ESM packages. SDK methods: defineConfig(config: { test?: TestOptions }) with TestOptions detailed above. Code examples provided for sum.js, sum.test.js, vitest.config.ts. Advanced options include aliasing, environment variables, reporters, CLI flags for port and HTTPS. Troubleshooting: verify versions, adjust deps.inline and fallbackCJS, use mergeConfig for config merging.

## Sanitised Extract
Table of Contents:
1. Installation
   - npm: npm install -D vitest
   - yarn: yarn add -D vitest
   - pnpm: pnpm add -D vitest
   - bun: bun add -D vitest
   - Requirements: Vite >= v5.0.0; Node >= v18.0.0
2. Writing Tests
   - Example Code: 
     File: sum.js
       export function sum(a, b) { return a + b }
     File: sum.test.js
       import { expect, test } from 'vitest'
       import { sum } from './sum.js'
       test('adds 1 + 2 to equal 3', () => { expect(sum(1, 2)).toBe(3) })
   - Package.json Script: { 'scripts': { 'test': 'vitest' } }
3. Configuring Vitest
   - Use vitest.config.ts with defineConfig from 'vitest/config'
   - Options specified under test property; sample configuration:
       import { defineConfig } from 'vitest/config'
       export default defineConfig({ test: { /* options here */ } })
   - CLI option: vitest --config <path>
   - Environment variable: process.env.VITEST
4. Workspace Support
   - Define workspaces in vitest.workspace.ts with defineWorkspace
   - Glob patterns and specific overrides with test configurations
5. Command Line Interface
   - Default scripts: test and coverage in package.json
   - Options: vitest run, --port, --https, --help
6. Dependency & Optimization
   - test.deps.external default: [/'/node_modules'//]
   - test.deps.inline: array/string/true to force processing via esbuild
   - Cache: 'node_modules/.vite'
7. Advanced Config Options
   - include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
   - exclude: ['**/node_modules/**', '**/dist/**', etc.]
   - globals: boolean flag for global API
   - environment: e.g., 'node', 'jsdom', 'happy-dom', 'edge-runtime'
   - alias: mapping for module resolution
   - reporters, update, watch, root, and base dir settings
8. Troubleshooting and Best Practices
   - Verify version requirements
   - Use --update for snapshot changes
   - For dependency issues, adjust deps.inline or fallbackCJS
   - Use correct CLI commands (e.g., bun run test for Bun)

Detailed Technical Information:
Installation commands, sample test files, configuration file structure including merging Vite and Vitest configurations, complete parameter defaults for options such as include, exclude, globals, environment; and CLI commands for running tests with coverage and debugging options are provided as listed above.

## Original Source
Vitest Testing Framework Documentation
https://vitest.dev

## Digest of VITEST

# Vitest Testing Framework Documentation

Retrieved Date: 2023-10-24

# Overview
Vitest is a next-generation testing framework powered by Vite. It supports ESM, TypeScript, JSX and is designed to be fast and lightweight. Vitest also provides compatibility with Jest (expect, snapshot, coverage) and supports an instant watch mode, unified Vite configuration, and in-source tests.

# Installation
- npm: npm install -D vitest
- yarn: yarn add -D vitest
- pnpm: pnpm add -D vitest
- bun: bun add -D vitest

Requirements:
- Vite >= v5.0.0
- Node >= v18.0.0

# Writing Tests
Example file: sum.js

  export function sum(a, b) {
    return a + b
  }

Example test file: sum.test.js

  import { expect, test } from 'vitest'
  import { sum } from './sum.js'

  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
  })

Package.json snippet to run tests:

  {
    "scripts": {
      "test": "vitest"
    }
  }

Command to run tests:
  npm run test (or yarn test / pnpm test)

# Configuring Vitest
Vitest leverages Vite’s unified configuration. The test options can be configured inside vite.config.js or a separate vitest.config.js/ts file.

Methods to configure:
- Create vitest.config.ts for higher priority config
- Pass --config option to CLI
- Use process.env.VITEST or mode property in defineConfig

Sample vitest.config.ts:

  import { defineConfig } from 'vitest/config'
  
  export default defineConfig({
    test: {
      // Specify test options here
    }
  })

Using Vite config with Vitest:

  /// <reference types="vitest/config" />
  import { defineConfig } from 'vite'

  export default defineConfig({
    test: { /* options */ }
  })

Merging Vite and Vitest configuration example:

  import { defineConfig, mergeConfig } from 'vitest/config'
  import viteConfig from './vite.config.mjs'
  
  export default mergeConfig(viteConfig, defineConfig({
    test: { /* options */ }
  }))

# Workspace Support
Vitest supports workspaces for monorepos. Define a vitest.workspace.ts file:

  import { defineWorkspace } from 'vitest/config'
  
  export default defineWorkspace([
    'packages/*',
    'tests/*/vitest.config.{e2e,unit}.ts',
    {
      test: {
        name: 'happy-dom',
        root: './shared_tests',
        environment: 'happy-dom',
        setupFiles: ['./setup.happy-dom.ts']
      }
    },
    {
      test: {
        name: 'node',
        root: './shared_tests',
        environment: 'node',
        setupFiles: ['./setup.node.ts']
      }
    }
  ])

# Command Line Interface (CLI)

Default npm scripts in scaffolded Vitest project:

  {
    "scripts": {
      "test": "vitest",
      "coverage": "vitest run --coverage"
    }
  }

CLI Options:
- vitest run for non-watch mode
- Additional options like --port and --https
- Run help: npx vitest --help

# Dependency Optimization & Handling

Vitest externalizes dependencies by default (node_modules). Specific configuration options include:

- test.deps.external: array of string/RegExp, default [/\/node_modules\//]
- test.deps.inline: boolean or array, to force inlining by esbuild
- test.deps.fallbackCJS: boolean, default false
- Cache directory: default 'node_modules/.vite'

Optimizer configuration:

  test: {
    deps: {
      optimizer: {
        ssr: { enabled: false },
        web: { enabled: false }
      }
    }
  }

# Advanced Configuration Options

Vitest configuration supports a vast array of parameters. Key options include:

- include: string[] patterns for test file matching. Default ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
- exclude: string[] patterns for files to ignore
- globals: boolean flag to provide global API if set to true
- environment: defines the test runner environment e.g., 'node', 'jsdom', 'happy-dom', 'edge-runtime'
- alias: object or array for module aliasing
- reporters: custom reporter configurations
- update: boolean to update snapshot files
- watch: boolean to enable watch mode

Detailed Vite and Vitest config options are available with type definitions and expected defaults in the Vitest documentation.

# Troubleshooting & Best Practices

Troubleshooting Steps:
1. Ensure Vite version is >= v5.0.0 and Node >= v18.0.0
2. For dependency errors, check if inline option is needed for ESM packages
3. For CLI issues, run npx vitest --help for full list of options
4. If using Bun as a package manager, use 'bun run test' instead of 'bun test'

Best Practices:
- Use a single configuration file for both Vite and Vitest where possible
- Define a vitest.workspace file for monorepo setups
- Update snapshots with the --update CLI flag as required
- Leverage dependency optimization settings when tests are slow

# Attribution
Data Size: 39784282 bytes; Extracted from https://vitest.dev; Links Processed: 26038

## Attribution
- Source: Vitest Testing Framework Documentation
- URL: https://vitest.dev
- License: License: MIT
- Crawl Date: 2025-04-25T18:34:23.914Z
- Data Size: 39784282 bytes
- Links Found: 26038

## Retrieved
2025-04-25
