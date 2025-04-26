# VITEST

## Crawl Summary
Installation commands (npm install -D vitest, yarn add -D vitest, etc.), example test files (sum.js and sum.test.js), package.json script configuration, detailed Vitest configuration merging with Vite, CLI options (vitest run, --coverage), workspaces support for multi-repo testing, and comprehensive configuration options for dependency management, environment settings, and alias setups with exact types and default values.

## Normalised Extract
Table of Contents:
1. Installation
   - Commands: npm install -D vitest; yarn add -D vitest; pnpm add -D vitest; bun add -D vitest
   - Requirements: Vite >= v5.0.0, Node >= v18.0.0
2. Writing Tests
   - Test file naming: .test. or .spec. suffix
   - Example: sum.js with exported function; sum.test.js using import { expect, test } from 'vitest'
3. Configuration
   - Use vite.config.ts with test property or create separate vitest.config.ts
   - Configuration methods: direct file creation, --config option, or merging using mergeConfig
   - Example snippets provided for both Vite and Vitest
4. CLI Usage
   - Default scripts in package.json: test, coverage
   - Run tests with vitest run and pass --port, --https as needed
5. Dependency Optimization
   - Options: deps.optimizer with mode specific configuration (ssr, web); inline versus external dependency handling
6. Workspaces
   - Define multiple workspace configurations via vitest.workspace.ts
   - Support for separate test environments (jsdom, node, happy-dom) based on test file globs
7. Troubleshooting
   - Bun specific command usage; dependency install check bypass with VITEST_SKIP_INSTALL_CHECKS

Detailed Items:
1. Installation: Direct commands and prerequisites
2. Writing Tests: Code structure for sum.js and sum.test.js, package.json script, expected output
3. Configuration: Detailed examples of vitest.config.ts and vite.config.ts setups, merging strategies, and reference type usage
4. CLI Usage: Default vscaffold scripts and additional CLI options
5. Dependency Optimization: Precise config keys including server.deps.external, inline, fallbackCJS options, cacheDir defaults
6. Workspaces: Pattern matching and config override examples
7. Troubleshooting: Commands and environmental variable usage

## Supplementary Details
Vitest requires Vite >= v5.0.0 and Node >= v18.0.0. Configuration options include:
- test.include: string[] default ['**/*.{test,spec}.?(c|m)[jt]s?(x)'].
- test.exclude: string[] default ['**/node_modules/**', '**/dist/**', '**/cypress/**', etc.].
- test.environment: string default 'node'.
- test.globals: boolean default false. Enable via CLI flag --globals or in config.
- Server options such as server.sourcemap (default 'inline') and server.debug options with dumpModules: boolean or string.
- Dependency options: server.deps.external (default [/\/node_modules\//]), inline (string[] or true), fallbackCJS (default false), cacheDir (default 'node_modules/.vite').
- Merge configuration examples using mergeConfig:
  import { defineConfig, mergeConfig } from 'vitest/config'
  import viteConfig from './vite.config.mjs'
  export default mergeConfig(viteConfig, defineConfig({ test: { exclude: ['packages/template/*'] } }))
- Workspaces can be defined in a vitest.workspace.ts file to support multiple environments with separate root, environment, and setupFiles settings.
- Best practice: Use a unified configuration to avoid conflicts between Vite and Vitest options. Always reference the latest vitest/config types to ensure smooth migration.
- Troubleshooting: For dependency issues, check the cache directory and use the VITEST_SKIP_INSTALL_CHECKS environment variable (set to 1) to bypass automatic dependency installation checks.

## Reference Details
API Specifications and Implementation Examples:
1. defineConfig from 'vitest/config':
   Method Signature: defineConfig(config: { test: TestOptions }): ConfigObject
   TestOptions includes properties: include?: string[], exclude?: string[], environment?: string, globals?: boolean, runner?: string, pool?: 'threads' | 'forks' | 'vmThreads' | 'vmForks', and other advanced configuration.

2. Example of vitest.config.ts:
   -----------------------------------------------------------------
   import { defineConfig } from 'vitest/config'

   export default defineConfig({
     test: {
       include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
       exclude: ['**/node_modules/**', '**/dist/**'],
       environment: 'node',
       globals: true,
       deps: {
         external: [/\/node_modules\//],
         inline: [],
         fallbackCJS: false,
         cacheDir: 'node_modules/.vite'
       }
     }
   })
   -----------------------------------------------------------------

3. Merging Vite and Vitest configs:
   -----------------------------------------------------------------
   import { defineConfig, mergeConfig } from 'vitest/config'
   import viteConfig from './vite.config.mjs'

   export default mergeConfig(viteConfig, defineConfig({
     test: {
       exclude: ['packages/template/*']
     }
   }))
   -----------------------------------------------------------------

4. CLI Usage:
   Default npm scripts in package.json:
   -----------------------------------------------------------------
   {
     "scripts": {
       "test": "vitest",
       "coverage": "vitest run --coverage"
     }
   }
   -----------------------------------------------------------------
   Run single test file: npx vitest run
   Additional options: --port, --https, --update

5. Dependency Optimization Example:
   -----------------------------------------------------------------
   test: {
     deps: {
       optimizer: {
         ssr: { enabled: false },
         web: { enabled: true }
       }
     }
   }
   -----------------------------------------------------------------

6. Troubleshooting Procedures:
   - For Bun users: Run tests using command: bun run test
   - Disable automatic dependency installation: export VITEST_SKIP_INSTALL_CHECKS=1
   - To view available CLI options: npx vitest --help

7. Environment Overrides (in file header):
   Example:
   -----------------------------------------------------------------
   /**
    * @vitest-environment jsdom
    */
   test('DOM test', () => {
     const el = document.createElement('div')
     expect(el).not.toBeNull()
   })
   -----------------------------------------------------------------

All method signatures, parameter types, configuration keys and default values are as specified above. Exceptions are handled at runtime by Vitest's internal mechanisms.

## Information Dense Extract
Vitest: Vite-native testing framework. Installation: npm install -D vitest, yarn add -D vitest. Requirements: Vite>=5.0.0, Node>=18.0.0. Test file naming: *.test.js/spec.js; example: export function sum(a, b){return a+b} and test using import {expect,test} from 'vitest'. Config: defineConfig({ test:{ include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"], exclude: ["**/node_modules/**","**/dist/**"], environment: "node", globals: false, deps:{ external:[/\/node_modules\//], inline:[], fallbackCJS:false, cacheDir:'node_modules/.vite' } } }). Merge configs using mergeConfig. CLI: vitest, vitest run, --coverage, --port, --https. Workspaces: defineWorkspace([{ test:{ name:'happy-dom', root:'./shared_tests', environment:'happy-dom', setupFiles:['./setup.happy-dom.ts'] }}, ...]). Troubleshooting: bun run test, export VITEST_SKIP_INSTALL_CHECKS=1, npx vitest --help.

## Sanitised Extract
Table of Contents:
1. Installation
   - Commands: npm install -D vitest; yarn add -D vitest; pnpm add -D vitest; bun add -D vitest
   - Requirements: Vite >= v5.0.0, Node >= v18.0.0
2. Writing Tests
   - Test file naming: .test. or .spec. suffix
   - Example: sum.js with exported function; sum.test.js using import { expect, test } from 'vitest'
3. Configuration
   - Use vite.config.ts with test property or create separate vitest.config.ts
   - Configuration methods: direct file creation, --config option, or merging using mergeConfig
   - Example snippets provided for both Vite and Vitest
4. CLI Usage
   - Default scripts in package.json: test, coverage
   - Run tests with vitest run and pass --port, --https as needed
5. Dependency Optimization
   - Options: deps.optimizer with mode specific configuration (ssr, web); inline versus external dependency handling
6. Workspaces
   - Define multiple workspace configurations via vitest.workspace.ts
   - Support for separate test environments (jsdom, node, happy-dom) based on test file globs
7. Troubleshooting
   - Bun specific command usage; dependency install check bypass with VITEST_SKIP_INSTALL_CHECKS

Detailed Items:
1. Installation: Direct commands and prerequisites
2. Writing Tests: Code structure for sum.js and sum.test.js, package.json script, expected output
3. Configuration: Detailed examples of vitest.config.ts and vite.config.ts setups, merging strategies, and reference type usage
4. CLI Usage: Default vscaffold scripts and additional CLI options
5. Dependency Optimization: Precise config keys including server.deps.external, inline, fallbackCJS options, cacheDir defaults
6. Workspaces: Pattern matching and config override examples
7. Troubleshooting: Commands and environmental variable usage

## Original Source
Vitest Testing Framework Documentation
https://vitest.dev

## Digest of VITEST

# Overview
Vitest is a Vite-native testing framework designed for fast ESM, TypeScript, and JSX support. It is tightly integrated with Vite configuration and transformation pipelines.

# Installation
To install Vitest, use any of the following commands:

npm: npm install -D vitest
yarn: yarn add -D vitest
pnpm: pnpm add -D vitest
bun: bun add -D vitest

Vitest requires Vite >= v5.0.0 and Node >= v18.0.0. Alternatively, run tests with npx vitest if not installed locally.

# Writing Tests
Example implementation:

File: sum.js
---------------------------
export function sum(a, b) {
  return a + b
}
---------------------------

File: sum.test.js
---------------------------
import { expect, test } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
---------------------------

Update package.json:
---------------------------
{
  "scripts": {
    "test": "vitest"
  }
}
---------------------------

# Configuring Vitest
Vitest will automatically use the root Vite config (vite.config.ts/js). To override, create a separate vitest.config.ts file or pass --config to CLI.

Example vitest.config.ts:
---------------------------
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Custom test options here
  }
})
---------------------------

For projects using Vite, update vite.config.ts with a test property:
---------------------------
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // Custom test options
  }
})
---------------------------

Merge Vite and Vitest configs using mergeConfig:
---------------------------
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    // Custom test options
  }
}))
---------------------------

# Command Line Interface
Default npm scripts:
---------------------------
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
---------------------------

Run tests with options such as --port or --https. Use vitest run for single execution.

# Dependency Management and Optimization
Vitest supports dependency optimization with options such as deps.optimizer. For example:

{
  test: {
    deps: {
      optimizer: {
        ssr: { enabled: false },
        web: { enabled: false }
      }
    }
  }
}

# Configuration Options and Parameters
Vitest configuration supports options including:
- include: string[] (Default: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"])
- exclude: string[] (Default: ["**/node_modules/**", "**/dist/**", ...])
- environment: string (Default: "node")
- globals: boolean (Default: false)
- runner: string (Default: 'node' or custom for benchmark)
- pool: 'threads' | 'forks' | 'vmThreads' | 'vmForks' (Default: 'forks')

Detailed options include server settings (sourcemap, debug), dependency handling (external, inline, fallbackCJS), and alias configuration.

# Workspaces and Multi-Config Support
Vitest workspaces allow configuration of multiple projects in one repository using a vitest.workspace.ts file.

Example workspace file:
---------------------------
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
---------------------------

# Troubleshooting
- For Bun, use 'bun run test' instead of 'bun test'.
- If dependency issues arise, set VITEST_SKIP_INSTALL_CHECKS=1 to disable automatic dependency installation checks.
- To debug transformation issues, check the cacheDir (default: node_modules/.vite) and use deps.optimizer options to force rebundling.

# Retrieval and Attribution
Content retrieved on: 2023-10-05
Data Size: 17837346 bytes
Links Found: 17290

## Attribution
- Source: Vitest Testing Framework Documentation
- URL: https://vitest.dev
- License: License if known: MIT
- Crawl Date: 2025-04-26T04:47:18.987Z
- Data Size: 17837346 bytes
- Links Found: 17290

## Retrieved
2025-04-26
