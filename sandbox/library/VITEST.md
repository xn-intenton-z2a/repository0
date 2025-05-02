# VITEST

## Crawl Summary
Vitest is a Vite-native testing framework supporting ESM, TypeScript, and JSX. Key specifications include installation commands, examples for writing tests, unified configuration via vite.config.ts or separate vitest.config.ts, CLI commands, workspace support for multiple configurations, and detailed dependency optimization and environment settings. Config options include test file glob patterns (include/exclude), global flags, environment settings, pool choices, and dependency resolver configurations, all with exact defaults and types.

## Normalised Extract
Table of Contents:
1. Installation & Setup
   - Commands: npm install -D vitest, yarn add -D vitest, pnpm add -D vitest, bun add -D vitest
   - Requirements: Vite >= v5.0.0, Node >= v18.0.0
2. Writing Tests
   - Example function: export function sum(a, b) { return a + b }
   - Test file: import { expect, test } from 'vitest'; test('adds 1 + 2 to equal 3', () => { expect(sum(1,2)).toBe(3) })
   - Package.json script: "test": "vitest"
3. Configuration
   - Default reading of root vite.config.ts
   - Separate vitest.config.ts example using defineConfig from 'vitest/config'
   - Merge configurations using mergeConfig(viteConfig, defineConfig({ test: { ... } }))
4. CLI & Options
   - CLI flags: --config, --globals, --watch, --update, --port, --https
   - Default npm scripts: "test": "vitest", "coverage": "vitest run --coverage"
5. Workspaces
   - Define workspaces with an array of glob patterns or config objects including test name, root directory, environment, setupFiles
6. Dependency Optimization
   - deps.external: Default [/\/node_modules\//]
   - deps.inline: (string | RegExp)[] or true
   - deps.cacheDir: 'node_modules/.vite'
   - Optimizer settings: optimizer.web and optimizer.ssr
7. Environment Configuration
   - environment: 'node' (default), can be set to 'jsdom', 'happy-dom', or custom environments
   - Use @vitest-environment comments for file-specific settings

Each topic includes exact commands, configuration object structures, default values and type details, allowing immediate practical application.

## Supplementary Details
Technical Specifications:
- Installation: npm install -D vitest; yarn add -D vitest; pnpm add -D vitest; bun add -D vitest
- Prerequisite Versions: Vite >= v5.0.0, Node >= v18.0.0
- Test File Naming: Must include .test. or .spec. in filename
- Vite Config Integration: Uses root vite.config.ts if available; override with vitest.config.ts using defineConfig from 'vitest/config'
- CLI Usage: vitest, vitest run, vitest --config ./path/to/config
- Dependency Options: deps.external (default [/\/node_modules\//]), deps.inline (default [] or true), deps.cacheDir ('node_modules/.vite')
- Environment: environment property in config (default 'node'); support for jsdom or happy-dom with triple slash reference directives
- Pool Options: pool can be 'threads', 'forks', 'vmThreads', or 'vmForks' with default 'forks'
- Workspace: Support through test.workspace array with glob patterns or object structures specifying name, root, environment, setupFiles
- Configuration Example:
  import { defineConfig } from 'vitest/config'
  export default defineConfig({
    test: {
      include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**'],
      globals: false,
      environment: 'node',
      pool: 'forks'
    },
    resolve: { alias: { '@': './src' } }
  })
- Troubleshooting:
  * Use --update to update snapshots
  * For multiple configurations, merge Vite and Vitest configs using mergeConfig
  * For CI, set watch to false explicitly
  * For dependency issues, adjust deps.inline or use optimizer.force option
- Best Practices: Use a single configuration file when possible to avoid overrides, and add @vitest-environment directives for file-specific needs.

## Reference Details
API Specifications and Code Examples:

1. defineConfig API:
Signature: defineConfig(config: { test?: TestOptions, plugins?: any[], resolve?: { alias?: Record<string, string> }, ... }) => Config
TestOptions interface includes:
  - include: string[] (Default: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'])
  - exclude: string[] (Default: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**'])
  - globals: boolean (Default: false), CLI: --globals
  - environment: string (Default: 'node'), examples: 'jsdom', 'happy-dom'
  - workspace: Array<string | { test: { name: string, root: string, environment: string, setupFiles: string[] } }>
  - pool: 'threads' | 'forks' | 'vmThreads' | 'vmForks' (Default: 'forks')

2. Example of a Separate vitest.config.ts:
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist'],
    globals: true,
    environment: 'jsdom',
    pool: 'threads'
  }
})

3. Merging with Vite Config:
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    exclude: ['packages/template/*']
  }
}))

4. CLI Options (from npx vitest --help):
  --config <path> : Specify configuration file
  --globals : Enable global APIs
  --watch : Enable watch mode
  --update : Update snapshots
  --port <number> : Set port
  --https : Enable HTTPS

5. Command Line Usage Example:
In package.json:
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
Then run:
  npm run test
  npm run coverage

6. Dependency Resolution Options:
In the config, deps: {
  external: [/\/node_modules\//],
  inline: [] or true,
  cacheDir: 'node_modules/.vite',
  optimizer: {
    web: { transformAssets: true, transformCss: true, transformGlobPattern: [] },
    ssr: { enabled: false }
  },
  moduleDirectories: ['node_modules']
}

7. Troubleshooting Procedures:
- If tests fail to pick up config, verify the file name contains .test. or .spec.
- For dependency errors, check if the module is externalized by inspecting deps.inline and deps.external settings.
- Use command: vitest --help to list all available CLI flags.
- For CI environments, enforce non-watch mode with: vitest --watch=false

8. Best Practice Implementation Pattern:
- Maintain single configuration file (vite.config.ts) with a test property if using Vite.
- Use mergeConfig to combine base Vite config with test-specific settings to avoid duplication.
- Use workspace arrays for projects with multiple test setups.
- For TypeScript, add triple slash directives: /// <reference types="vitest/config" />

This specification can be directly copied into projects to set up Vitest with full knowledge of all parameters, defaults, and integration patterns.

## Information Dense Extract
Vitest: testing framework built on Vite; install with npm/yarn/pnpm/bun; requires Vite>=5.0.0, Node>=18.0.0. Test files: must contain .test. or .spec. Extensions: .js, .ts, .jsx, .tsx (not .json). Config via vite.config.ts or vitest.config.ts using defineConfig; merge with mergeConfig for dual config. CLI: vitest, vitest run, flags --config, --globals, --watch, --update, --port, --https. TestOptions: include (['**/*.{test,spec}.?(c|m)[jt]s?(x)']), exclude (['**/node_modules/**', '**/dist/**', ...]), globals (false), environment ('node' by default; 'jsdom', 'happy-dom' supported), pool ('forks'); deps options: external ([/\/node_modules\//]), inline: [] or true, cacheDir: 'node_modules/.vite'. Workspaces: array of glob patterns or config objects (name, root, environment, setupFiles). API examples and CLI usage provided with full code samples. Troubleshooting: use --watch=false for CI, update dependencies via VITEST_SKIP_INSTALL_CHECKS env var, check file naming conventions.

## Sanitised Extract
Table of Contents:
1. Installation & Setup
   - Commands: npm install -D vitest, yarn add -D vitest, pnpm add -D vitest, bun add -D vitest
   - Requirements: Vite >= v5.0.0, Node >= v18.0.0
2. Writing Tests
   - Example function: export function sum(a, b) { return a + b }
   - Test file: import { expect, test } from 'vitest'; test('adds 1 + 2 to equal 3', () => { expect(sum(1,2)).toBe(3) })
   - Package.json script: 'test': 'vitest'
3. Configuration
   - Default reading of root vite.config.ts
   - Separate vitest.config.ts example using defineConfig from 'vitest/config'
   - Merge configurations using mergeConfig(viteConfig, defineConfig({ test: { ... } }))
4. CLI & Options
   - CLI flags: --config, --globals, --watch, --update, --port, --https
   - Default npm scripts: 'test': 'vitest', 'coverage': 'vitest run --coverage'
5. Workspaces
   - Define workspaces with an array of glob patterns or config objects including test name, root directory, environment, setupFiles
6. Dependency Optimization
   - deps.external: Default [/'/node_modules'//]
   - deps.inline: (string | RegExp)[] or true
   - deps.cacheDir: 'node_modules/.vite'
   - Optimizer settings: optimizer.web and optimizer.ssr
7. Environment Configuration
   - environment: 'node' (default), can be set to 'jsdom', 'happy-dom', or custom environments
   - Use @vitest-environment comments for file-specific settings

Each topic includes exact commands, configuration object structures, default values and type details, allowing immediate practical application.

## Original Source
Vitest Testing Framework
https://vitest.dev/

## Digest of VITEST

# Vitest Documentation Digest

Retrieved on: 2023-10-20

## Overview
Vitest is a next generation testing framework built on Vite. It supports ESM, TypeScript, JSX and offers fast testing with smart watch mode, Jest-compatible APIs (expect, snapshot, coverage) and unified configuration with Vite.

## Installation & Setup
- Install: npm install -D vitest, yarn add -D vitest, pnpm add -D vitest, bun add -D vitest
- Prerequisites: Vite >= v5.0.0, Node >= v18.0.0
- Execution: npx vitest (checks local binaries then system $PATH or temporarily installs if missing)

## Writing Tests
Example:

sum.js
  export function sum(a, b) {
    return a + b
  }

sum.test.js
  import { expect, test } from 'vitest'
  import { sum } from './sum.js'

  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
  })

Package.json script:
  "scripts": { "test": "vitest" }

Output will show test file names, pass counts, start time and duration.

## Configuring Vitest
Vitest uses Vite's configuration by default via vite.config.ts. When a separate configuration is needed, create a vitest.config.ts.

Examples:
1. Separate vitest.config.ts:
   import { defineConfig } from 'vitest/config'
   export default defineConfig({
     test: { /* test options here */ }
   })

2. Merging with Vite config:
   import { defineConfig, mergeConfig } from 'vitest/config'
   import viteConfig from './vite.config.mjs'
   export default mergeConfig(viteConfig, defineConfig({
     test: { /* override options */ }
   }))

## CLI & Options
- CLI commands: vitest, vitest run, vitest --config ./path/to/config
- Common flags: --globals, --watch, --update, --port, --https
- Example scripts in package.json:
   "scripts": {
     "test": "vitest",
     "coverage": "vitest run --coverage"
   }

## Workspaces Support
Vitest supports workspace configurations to run multiple project configs in a single test process. Workspace is defined as an array of glob patterns or objects with distinct test config (name, root, environment, setupFiles).

Example:
   test: {
     workspace: [
       'packages/*',
       'tests/*/vitest.config.{e2e,unit}.ts',
       { test: { name: 'happy-dom', root: './shared_tests', environment: 'happy-dom', setupFiles: ['./setup.happy-dom.ts'] } },
       { test: { name: 'node', root: './shared_tests', environment: 'node', setupFiles: ['./setup.node.ts'] } }
     ]
   }

## Configuration Options
- include (string[]): Glob patterns for test files. Default: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'].
- exclude (string[]): Glob patterns to exclude. Default: ['**/node_modules/**', '**/dist/**', ...].
- globals (boolean): When true, expose test APIs globally. Default: false.
- environment (string): Test environment e.g., 'node', 'jsdom', 'happy-dom'. Default: 'node'.
- pool (threads|forks|vmThreads|vmForks): Select test process pool. Default: 'forks'.
- update & watch flags are available to control snapshots and interactive mode.

## Dependency Optimization & Module Resolution
- deps: Options for dependency handling.
    - external: Default: [/\/node_modules\//]
    - inline: (string | RegExp)[] | true. Default: [].
    - cacheDir: Default: 'node_modules/.vite'.
    - optimizer: Options for bundling dependencies (optimizer.web, optimizer.ssr).

## Environment Options
- environmentOptions: For passing down environment specific options, e.g., jsdom config.
- Custom environments can be defined by creating packages with name: vitest-environment-{name}.

## Troubleshooting & Best Practices
- Ensure matching Vite config if using separate config files to avoid overrides.
- For CI or non-interactive shells, disable watch mode.
- Adjust dependency optimization settings if tests are slow (use deps.optimizer.force if needed).
- For debugging VM sandbox issues, consider increasing memory limits or switch pool types.

## Attribution & Data
Data Size: 38918591 bytes, Links Found: 25918, No errors reported from crawl.

## Attribution
- Source: Vitest Testing Framework
- URL: https://vitest.dev/
- License: License: MIT License
- Crawl Date: 2025-05-02T19:11:05.690Z
- Data Size: 38918591 bytes
- Links Found: 25918

## Retrieved
2025-05-02
