# VITEST

## Crawl Summary
Vitest provides a Vite-native testing solution with integrated Vite configuration, automatic dependency resolution, and extensive CLI options. Key aspects include installation methods via npm/yarn/pnpm/bun, configuration flexibility using vite.config.ts or separate vitest.config.ts, workspace support for monorepos, rich dependency handling options (external, inline, optimizer), and multiple test environments (node, jsdom, happy-dom).

## Normalised Extract
Table of Contents:
1. Installation
   - Install using npm install -D vitest, yarn add -D vitest, or pnpm add -D vitest. Requires Vite>=v5.0.0 and Node>=v18.0.0.
2. Writing Tests
   - Test files must include .test. or .spec. in filename. Use: import { expect, test } from 'vitest'; test('description', () => { expect(fn()).toBe(result) }).
3. Configuration
   - Use vite.config.ts with <reference types="vitest/config"> directive to configure Vitest. Options placed in test property.
   - Example: export default defineConfig({ test: { include: ["**/*.test.js"], exclude: ["**/node_modules/**"] } }).
4. CLI Options
   - vitest run for single execution; options: --port, --https, --config.
   - Automatic dependency installation can be suppressed with VITEST_SKIP_INSTALL_CHECKS environment variable.
5. Dependency Optimization
   - opts: deps.external (default [/\/node_modules\//]), deps.inline (list or true), deps.optimizer settings including ssr and web modes.
6. Workspaces
   - Use vitest.workspace.ts file to define workspaces with glob patterns and individual config objects specifying name, root, environment, and setupFiles.
7. Environment Setup
   - Default environment is 'node'. Specify custom environment through a docblock or config property (e.g. environment: 'jsdom').
8. Advanced Options
   - Options include globals: boolean, alias configuration, benchmark settings, reporters, and pool settings for test execution.

Detailed Technical Information:
- Installation: npm install -D vitest
- Test Example: Import from 'vitest', define function tests. Filename must be sum.test.js for automatic discovery.
- Vite Configuration: Use <reference types="vitest/config"> and call defineConfig with test property. Options include include, exclude, reporters, globals, and server configs.
- CLI commands: npx vitest, vitest run, use --config flag to specify config file.
- Dependency Options: deps.external defaults, deps.inline can be array or true, and use mergeConfig to combine Vite and Vitest configurations.
- Workspace file: defineWorkspace with glob patterns or direct config objects.
- Environment customization: Specify environment in test config or via file-level directive (@vitest-environment).

Each section provides explicit configuration syntax and parameter values directly usable by developers.

## Supplementary Details
Configuration Options:
- test.include: default ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
- test.exclude: default ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*']
- test.globals: false by default; set true if global APIs desired.
- server.deps.external: default [/\/node_modules\//].
- server.deps.inline: default empty array. Can be set to true to inline all dependencies.
- reporters: default 'default'; can be an array of reporter names or instances.

Implementation Steps:
1. Install Vitest via chosen package manager.
2. Create a test file (e.g., sum.test.js) with test blocks using Vitest API.
3. Add test script in package.json: { "scripts": { "test": "vitest" } }.
4. Configure Vite by adding test property in vite.config.ts or creating a separate vitest.config.ts using defineConfig from 'vitest/config'.
5. For workspace setups, create vitest.workspace.ts defining glob patterns and config objects.
6. Use CLI options to run tests and set environment variables as needed (e.g. --config, --environment, VITEST_SKIP_INSTALL_CHECKS=1).
7. Debug using server.debug options by setting dumpModules and loadDumppedModules to true.

Troubleshooting:
- If test files are not discovered, check include/exclude patterns in config.
- For module transformation issues, verify dependency optimization settings and inline options.
- If using Bun, run tests with 'bun run test' to override Bun's native runner.
- Use npx vitest --help to list all CLI options.

## Reference Details
API Specifications and Code Examples:

1. Vitest API Methods:
   - test(description: string, callback: Function): void
   - expect(actual: any): { toBe(expected: any): void, toEqual(expected: any): void }

2. Example Test File (sum.test.js):
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

3. Vitest Configuration using vite.config.ts:
   /// <reference types="vitest/config" />
   import { defineConfig } from 'vite'

   export default defineConfig({
     test: {
       include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
       exclude: ['**/node_modules/**', '**/dist/**'],
       globals: false,
       reporters: 'default',
       server: {
         debug: { dumpModules: true, loadDumppedModules: true },
         deps: {
           external: [/\/node_modules\//],
           inline: []
         }
       }
     }
   })

4. Separate Vitest Config (vitest.config.ts) using vitest/config:
   /// <reference types="vitest/config" />
   import { defineConfig } from 'vitest/config'

   export default defineConfig({
     test: {
       globals: true,
       environment: 'jsdom',
       alias: { '@': '/src' },
       deps: {
         optimizer: {
           web: { transformAssets: true, transformCss: true }
         }
       }
     }
   })

5. Workspace Configuration (vitest.workspace.ts):
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

6. CLI Command Example:
   - Run tests: npx vitest
   - Run once without watch: vitest run
   - Help: npx vitest --help

7. Best Practices:
   - Use a single configuration file merging Vite and Vitest settings using mergeConfig.
   - Reference Vitest types using triple-slash directives (migrate to vitest/config as needed).
   - Disable Bun’s native test runner by using bun run test.

8. Troubleshooting Commands:
   - Check configuration: npx vitest --showConfig
   - Debug module transformation: set server.debug.dumpModules=true in config and inspect dumped modules in node_modules/.vite
   - If dependency issues occur, adjust deps.interopDefault to true and list problematic modules in deps.inline.

All parameters, return types, method signatures, configuration keys, default values and example code are provided verbatim to be directly implemented.

## Information Dense Extract
Vitest; npm install -D vitest; Vite>=v5, Node>=18; test files include .test. or .spec.; API: test(desc:string, fn:Function), expect(value): { toBe, toEqual }; Vite config: <reference types='vitest/config'>, defineConfig({ test: { include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'], exclude: [...], globals:false, reporters:'default', server: { debug: { dumpModules:true, loadDumppedModules:true }, deps:{ external:[/\/node_modules\//], inline:[] } } } }); CLI: npx vitest, vitest run, --port, --https; Workspace config using defineWorkspace([...]); Environment config via environment:'node' or 'jsdom'; Dependency optimization via deps.optimizer; Troubleshooting: use --showConfig, adjust deps.interopDefault, use bun run test; Full SDK method signatures and code examples provided.

## Sanitised Extract
Table of Contents:
1. Installation
   - Install using npm install -D vitest, yarn add -D vitest, or pnpm add -D vitest. Requires Vite>=v5.0.0 and Node>=v18.0.0.
2. Writing Tests
   - Test files must include .test. or .spec. in filename. Use: import { expect, test } from 'vitest'; test('description', () => { expect(fn()).toBe(result) }).
3. Configuration
   - Use vite.config.ts with <reference types='vitest/config'> directive to configure Vitest. Options placed in test property.
   - Example: export default defineConfig({ test: { include: ['**/*.test.js'], exclude: ['**/node_modules/**'] } }).
4. CLI Options
   - vitest run for single execution; options: --port, --https, --config.
   - Automatic dependency installation can be suppressed with VITEST_SKIP_INSTALL_CHECKS environment variable.
5. Dependency Optimization
   - opts: deps.external (default [/'/node_modules'//]), deps.inline (list or true), deps.optimizer settings including ssr and web modes.
6. Workspaces
   - Use vitest.workspace.ts file to define workspaces with glob patterns and individual config objects specifying name, root, environment, and setupFiles.
7. Environment Setup
   - Default environment is 'node'. Specify custom environment through a docblock or config property (e.g. environment: 'jsdom').
8. Advanced Options
   - Options include globals: boolean, alias configuration, benchmark settings, reporters, and pool settings for test execution.

Detailed Technical Information:
- Installation: npm install -D vitest
- Test Example: Import from 'vitest', define function tests. Filename must be sum.test.js for automatic discovery.
- Vite Configuration: Use <reference types='vitest/config'> and call defineConfig with test property. Options include include, exclude, reporters, globals, and server configs.
- CLI commands: npx vitest, vitest run, use --config flag to specify config file.
- Dependency Options: deps.external defaults, deps.inline can be array or true, and use mergeConfig to combine Vite and Vitest configurations.
- Workspace file: defineWorkspace with glob patterns or direct config objects.
- Environment customization: Specify environment in test config or via file-level directive (@vitest-environment).

Each section provides explicit configuration syntax and parameter values directly usable by developers.

## Original Source
Vitest Testing Framework
https://vitest.dev

## Digest of VITEST

# Vitest Testing Framework

Date Retrieved: 2023-10-26

## Overview
Vitest is a next generation testing framework powered by Vite supporting ESM, TypeScript, JSX and advanced CLI operations. It integrates with Vite config files, supports unified configurations, automatic dependency resolution, and offers flexible configurations for environments, workspaces, and dependency optimizations.

## Installation and Setup
- Install using npm, yarn, pnpm, or bun:
  - npm: npm install -D vitest
  - yarn: yarn add -D vitest
  - pnpm: pnpm add -D vitest
  - bun: bun add -D vitest
- Requirements: Vite >= v5.0.0, Node >= v18.0.0
- Run tests using: npm run test, yarn test, pnpm test or npx vitest

## Writing Tests
- Test files must contain .test. or .spec. in the filename.
- Example test file (sum.test.js):

  import { expect, test } from 'vitest'
  import { sum } from './sum.js'

  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
  })

## Configuration
- Vitest uses Vite configuration. It can read vite.config.ts or use a separate vitest.config.ts.
- Example vite.config.ts:

  /// <reference types="vitest/config" />
  import { defineConfig } from 'vite'

  export default defineConfig({
    test: {
      // Specify options here
    }
  })

- For separate configuration: Use --config CLI parameter or create vitest.config.ts with defineConfig from 'vitest/config'.

## CLI Options
- vitest run: run tests once
- --port, --https: specify additional options
- Automatic dependency installation can be disabled with VITEST_SKIP_INSTALL_CHECKS=1

## Dependency and Asset Optimizations
- Test configuration can include options for dependency resolution:
  - include: Glob patterns for test files
  - exclude: Glob patterns to ignore files
  - deps.external: List of RegExp or string patterns (default [/\/node_modules\//])
  - deps.inline: List to inline specific modules.
- Examples from config:

  export default defineConfig({
    test: {
      deps: {
        external: [/\/node_modules\//],
        inline: []
      },
      reporters: 'default',
      globals: false
    }
  })

## Workspaces Support
- Define workspaces with a vitest.workspace.ts file:

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

## Environment Setup and Customization
- Default environment is 'node'. Use CLI flag --environment to switch to jsdom, happy-dom, or edge-runtime.
- Custom environment example:

  // custom-env.js
  import type { Environment } from 'vitest'

  export default <Environment>{
    name: 'custom',
    transformMode: 'ssr',
    setup() {
      // custom initialization
      return {
        teardown() {
          // teardown actions
        }
      }
    }
  }

## Advanced Configuration Options
- Configuration settings (in test property): include, exclude, name, server, runner, benchmark, alias, globals, environment, and more.
- Example config options:
  - include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"]
  - exclude: ["**/node_modules/**", "**/dist/**"]
  - globals: boolean (default false)
  - reporters: can be array or string (default 'default')

## Troubleshooting and Best Practices
- For dependency optimization, check the cache directory at node_modules/.vite
- Debug using server.debug options:
  export default defineConfig({
    test: {
      server: {
        debug: { dumpModules: true, loadDumppedModules: true }
      }
    }
  })
- In case of module import errors, consider setting deps.interopDefault to true

## Attribution
- Data Size: 29563308 bytes
- Links Found: 23673
- Source: Vitest Website (https://vitest.dev)

## Attribution
- Source: Vitest Testing Framework
- URL: https://vitest.dev
- License: License if known: MIT
- Crawl Date: 2025-04-26T03:50:20.581Z
- Data Size: 29563308 bytes
- Links Found: 23673

## Retrieved
2025-04-26
