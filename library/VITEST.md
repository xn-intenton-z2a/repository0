# VITEST

## Crawl Summary
Vitest is a Vite-native testing framework with out-of-the-box support for ES modules, TypeScript, JSX, and advanced configuration setups. It enables unified configuration via vite.config or vitest.config files, supports CLI test execution (watch mode, run once, coverage), customizable environments (node, jsdom, happy-dom), and workspace configurations for monorepos. Key configuration options include test include/exclude patterns, dependency optimization settings (external, inline, fallbackCJS, cacheDir), and environment settings, providing complete actionable technical details.

## Normalised Extract
Table of Contents:
1. Getting Started
2. Installation
3. Writing Tests
4. Configuring Vitest
5. CLI Usage
6. Environment Settings
7. Workspace Support
8. Dependency Optimization
9. Troubleshooting

Getting Started:
- Framework: Vitest, a Vite-native testing solution
- Requirements: Vite >= v5.0.0, Node >= v18.0.0

Installation:
- Commands: npm install -D vitest, yarn add -D vitest, pnpm add -D vitest
- Ad-hoc run: npx vitest

Writing Tests:
- File naming: must contain .test. or .spec.
- Example source (sum.js): export function sum(a, b) returns a + b
- Example test (sum.test.js): import { expect, test } from 'vitest'; use test block and expect(sum(1,2)).toBe(3)
- Package.json: { "scripts": { "test": "vitest" } }

Configuring Vitest:
- Use a configuration file (vitest.config.ts) with defineConfig from 'vitest/config'
- Supported file extensions: .js, .mjs, .cjs, .ts, .cts, .mts (json not supported)
- Options: include, exclude, globals, environment, and test.deps settings
- Merging config: use mergeConfig to combine Vite and Vitest settings

CLI Usage:
- Default command: vitest (watch mode), vitest run (once)
- Flags: --config, --port, --https, --coverage

Environment Settings:
- Default: node; alternatives: jsdom, happy-dom, edge-runtime
- Specify per file via comment: @vitest-environment jsdom

Workspace Support:
- Define multi-project setups in vitest.workspace.ts using glob patterns or configuration objects (with keys: name, root, environment, setupFiles)

Dependency Optimization:
- Configuration under test.deps:
  - external: default RegExp [/\/node_modules\//]
  - inline: can be an array or true to inline all dependencies
  - fallbackCJS: false by default; set to true if needed
  - cacheDir: 'node_modules/.vite'

Troubleshooting:
- For Bun users: run 'bun run test'
- Dependency errors: check test.deps and interopDefault settings
- CLI issues: use npx vitest --help for full option list


## Supplementary Details
Key Technical Specifications:
- Requirements: Vite >= v5.0.0, Node >= v18.0.0
- Configuration File: vitest.config.ts using defineConfig from 'vitest/config'
  * Example structure:
    import { defineConfig } from 'vitest/config'
    export default defineConfig({
      test: {
        include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**'],
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
- CLI Commands:
  * vitest => Runs in watch mode
  * vitest run => Executes tests once
  * Additional flags: --config, --port, --https, --coverage
- Workspace Configuration:
  * Use vitest.workspace.ts to list configurations with glob patterns and configuration objects
- Best Practices:
  * Consolidate Vite and Vitest configuration in one file when possible
  * Use mergeConfig to avoid conflicts when separate files are required
  * Add proper test file naming conventions to automate test discovery
- Troubleshooting Procedures:
  * For dependency issues, verify settings in test.deps (especially fallbackCJS and inline arrays)
  * For environment mismatches, confirm the correct @vitest-environment directive is at the top of test files
  * Use npx vitest --help to list and understand available CLI options


## Reference Details
Complete API and Implementation Specifications:
1. defineConfig API:
   - Signature: function defineConfig(config: { test?: { include?: string[], exclude?: string[], globals?: boolean, environment?: string, deps?: { external?: (string | RegExp)[], inline?: (string | RegExp)[] | boolean, fallbackCJS?: boolean, cacheDir?: string } }, alias?: Record<string, string>, globals?: boolean, environment?: string }): ConfigObject
   - Returns a configuration object for Vitest to be consumed by the test runner.

2. mergeConfig API:
   - Signature: function mergeConfig(baseConfig: ConfigObject, overrideConfig: ConfigObject): ConfigObject
   - Merges two configuration objects; used when combining Vite and Vitest config files.

3. SDK Method for Running Tests:
   - Method: vitest.run(options?: { config?: string, port?: number, https?: boolean, coverage?: boolean }): Promise<TestResults>
   - Parameters:
     * config: Optional path to configuration file
     * port: (number) Custom port for the test server
     * https: (boolean) Enable HTTPS
     * coverage: (boolean) Run tests with coverage analysis
   - Return: Promise resolving to a TestResults object containing details of test execution

4. Code Example (sum test):
   // sum.js
   export function sum(a, b) {
     return a + b;
   }

   // sum.test.js
   import { expect, test } from 'vitest';
   import { sum } from './sum.js';

   test('adds 1 + 2 to equal 3', () => {
     expect(sum(1, 2)).toBe(3);
   });

   // package.json
   {
     "scripts": {
       "test": "vitest"
     }
   }

5. Detailed Configuration Options:
   - include: string[]; Default: ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
   - exclude: string[]; Default: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*']
   - globals: boolean; Default: false; Enables global test APIs when set to true.
   - environment: string; Default: 'node'; Can be overridden using file-level comments (@vitest-environment jsdom, etc.)
   - deps.external: (string|RegExp)[]; Default: [/\/node_modules\//]
   - deps.inline: (string|RegExp)[] or true; Default: []
   - deps.fallbackCJS: boolean; Default: false
   - deps.cacheDir: string; Default: 'node_modules/.vite'

6. Troubleshooting Commands:
   - For CLI help: npx vitest --help
   - For Bun users: Use 'bun run test' instead of 'bun test'

Return Types and Exception Handling:
- All SDK methods return a Promise; errors are thrown as standard Error objects with descriptive messages.

Best Practices:
- Consolidate configuration in a single file where possible
- Use mergeConfig when combining different environment configurations
- Always verify dependencies and environment settings if unexpected test failures occur


## Information Dense Extract
Vitest; Vite>=v5.0.0; Node>=v18.0.0; install: npm install -D vitest, yarn add -D vitest, pnpm add -D vitest; CLI: vitest (watch), vitest run (once), flags: --config, --port, --https, --coverage; test files: *.test.* or *.spec.*; config file: vitest.config.ts using defineConfig from 'vitest/config'; mergeConfig to combine configs; environments: node (default), jsdom, happy-dom, edge-runtime via @vitest-environment; workspace setup via vitest.workspace.ts; deps: external [/\/node_modules\//], inline: []|true, fallbackCJS: false, cacheDir 'node_modules/.vite'; API: defineConfig(config) -> ConfigObject, mergeConfig(base, override); SDK run method returns Promise<TestResults>; troubleshooting: use npx vitest --help; package.json script "test": "vitest".

## Sanitised Extract
Table of Contents:
1. Getting Started
2. Installation
3. Writing Tests
4. Configuring Vitest
5. CLI Usage
6. Environment Settings
7. Workspace Support
8. Dependency Optimization
9. Troubleshooting

Getting Started:
- Framework: Vitest, a Vite-native testing solution
- Requirements: Vite >= v5.0.0, Node >= v18.0.0

Installation:
- Commands: npm install -D vitest, yarn add -D vitest, pnpm add -D vitest
- Ad-hoc run: npx vitest

Writing Tests:
- File naming: must contain .test. or .spec.
- Example source (sum.js): export function sum(a, b) returns a + b
- Example test (sum.test.js): import { expect, test } from 'vitest'; use test block and expect(sum(1,2)).toBe(3)
- Package.json: { 'scripts': { 'test': 'vitest' } }

Configuring Vitest:
- Use a configuration file (vitest.config.ts) with defineConfig from 'vitest/config'
- Supported file extensions: .js, .mjs, .cjs, .ts, .cts, .mts (json not supported)
- Options: include, exclude, globals, environment, and test.deps settings
- Merging config: use mergeConfig to combine Vite and Vitest settings

CLI Usage:
- Default command: vitest (watch mode), vitest run (once)
- Flags: --config, --port, --https, --coverage

Environment Settings:
- Default: node; alternatives: jsdom, happy-dom, edge-runtime
- Specify per file via comment: @vitest-environment jsdom

Workspace Support:
- Define multi-project setups in vitest.workspace.ts using glob patterns or configuration objects (with keys: name, root, environment, setupFiles)

Dependency Optimization:
- Configuration under test.deps:
  - external: default RegExp [/'/node_modules'//]
  - inline: can be an array or true to inline all dependencies
  - fallbackCJS: false by default; set to true if needed
  - cacheDir: 'node_modules/.vite'

Troubleshooting:
- For Bun users: run 'bun run test'
- Dependency errors: check test.deps and interopDefault settings
- CLI issues: use npx vitest --help for full option list

## Original Source
Vitest Testing Framework
https://vitest.dev

## Digest of VITEST

# Vitest Documentation

Retrieved Date: 2023-10-??

# Getting Started
Vitest is a next generation, Vite-native testing framework supporting ESM, TypeScript, and JSX. It requires Vite (>= v5.0.0) and Node (>= v18.0.0).

# Installation
Install via one of the following commands:
• npm: npm install -D vitest
• yarn: yarn add -D vitest
• pnpm: pnpm add -D vitest
For direct execution without installation in package.json, use: npx vitest

# Writing Tests
Test files should include either .test. or .spec. in their filename. A typical test consists of two parts:
1. Source File (e.g., sum.js):
   export function sum(a, b) {
     return a + b
   }
2. Test File (e.g., sum.test.js):
   import { expect, test } from 'vitest'
   import { sum } from './sum.js'
   
   test('adds 1 + 2 to equal 3', () => {
     expect(sum(1, 2)).toBe(3)
   })

Update package.json to include the test script:
{
  "scripts": {
    "test": "vitest"
  }
}

# Configuring Vitest
Vitest uses a unified configuration with Vite. If a root vite.config file exists, its plugins and alias settings apply automatically. To provide specific testing configuration, create a file (e.g., vitest.config.ts) with the following structure:

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Specify test options such as include, exclude, globals, etc.
  }
})

For custom configurations or when using separate config files, use the mergeConfig method:

import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    // Custom test configurations
  }
}))

# Command Line Interface
Vitest provides multiple CLI commands:
• vitest         - Runs tests in watch mode (default)
• vitest run     - Executes tests once without file watching

Additional CLI options include:
• --config     - Specify a custom configuration file
• --port       - Define a custom port
• --https      - Enable HTTPS
• --coverage   - Run tests with coverage reports

# Environment Configuration
Default test environment is 'node'. Optionally, you can choose 'jsdom', 'happy-dom', or 'edge-runtime'. To override the environment for specific files, add a docblock at the top:

Example for jsdom:
/**
 * @vitest-environment jsdom
 */

# Workspace and Multi-Project Support
Vitest supports monorepo setups via a vitest.workspace.ts file. Example content:

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

# Dependency Optimization
Vitest provides dependency configuration under the test.deps property. Key options include:
• external      : (Array of strings/RegExp) Default: [/\/node_modules\//] 
• inline        : (Array or true) Default: []. Use to force processing of inlined modules
• fallbackCJS   : (Boolean) Default: false
• cacheDir      : (String) Default: 'node_modules/.vite'

# Detailed Configuration Options
Listing of common configuration parameters:
• include       : Glob patterns for tests (default: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'])
• exclude       : Glob patterns to exclude (default: ['**/node_modules/**', '**/dist/**', etc.])
• globals       : (Boolean) Default false. Set true for Jest-like globals
• environment   : (String) Default 'node'

# Troubleshooting
• Bun users: Use 'bun run test' instead of 'bun test' to avoid conflicts with Bun's own test runner.
• Dependency issues: Verify test.deps settings, especially fallbackCJS and interop defaults.
• Environment errors: Ensure the correct @vitest-environment comment is present at the top of files.

# Attribution
Data Crawled from Vitest (https://vitest.dev) with a data size of 34590982 bytes and 25188 links found. No errors were reported.

## Attribution
- Source: Vitest Testing Framework
- URL: https://vitest.dev
- License: License if known: MIT
- Crawl Date: 2025-04-25T23:33:08.256Z
- Data Size: 34590982 bytes
- Links Found: 25188

## Retrieved
2025-04-25
