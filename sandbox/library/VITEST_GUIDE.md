# VITEST_GUIDE

## Crawl Summary
Installation requires Vite>=5.0.0 and Node>=18.0.0. Install via npm/yarn/pnpm/bun or npx. Tests: filenames include .test. or .spec.; use import { expect, test } from 'vitest'; define scripts in package.json. Configuration inherits Vite config; override via vitest.config.ts, --config, or defineConfig mode; supports .js/.ts/etc; mergeConfig available. Workspaces: define glob patterns or config objects in workspace array. CLI: vitest run, --port, --https, skip install checks via env var. IDE: VSCode extension. Examples: multiple frameworks. Auto dependency prompts can be disabled. Projects list. Unreleased builds via pkg.pr.new and pnpm link. Community channels.

## Normalised Extract
Table of Contents:
1 Test File Conventions
2 Installation Commands and Requirements
3 Package.json Scripts
4 Vite Unified Configuration
5 Standalone Vitest Config
6 Config File Extensions
7 Conditional Config Overrides
8 Merging Vite and Vitest Config
9 Workspaces Configuration
10 CLI Options and Environment Variables
11 IDE Integration

1 Test File Conventions
Tests must include .test. or .spec. in filename. Vitest identifies files matching /\.(test|spec)\.[jt]s$/ by default.

2 Installation Commands and Requirements
Requirements:
  Vite: >=5.0.0
  Node: >=18.0.0
Commands:
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest
  npx vitest (fallback install behavior)

3 Package.json Scripts
Add:
  "scripts": {
    "test": "vitest"
  }
Optional coverage:
  "coverage": "vitest run --coverage"

4 Vite Unified Configuration
If no vitest.config file, Vitest reads root vite.config.ts/js:
  resolve.alias, plugins pass-through.

5 Standalone Vitest Config
File: vitest.config.(js|ts)
Content:
  import { defineConfig } from 'vitest/config'
  export default defineConfig({ test: { /* options */ } })

6 Config File Extensions
Supported: .js, .mjs, .cjs, .ts, .cts, .mts
Unsupported: .json

7 Conditional Config Overrides
Use CLI: vitest --config <path>
Use env: process.env.VITEST or defineConfig(mode) to apply test-mode settings.

8 Merging Vite and Vitest Config
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'
export default mergeConfig(viteConfig, defineConfig({ test: { /* options */ } }))

9 Workspaces Configuration
vitest.config.ts:
  test.workspace: array of:
    - glob patterns: 'packages/*'
    - config files: 'tests/*/vitest.config.{e2e,unit}.ts'
    - objects: { test: { name, root, environment, setupFiles } }

10 CLI Options and Environment Variables
Commands:
  vitest             : interactive watch mode
  vitest run         : single-run
  vitest --port <n>  : override port
  vitest --https     : enable https server
  vitest --config <p>: use specific config
Env vars:
  VITEST_SKIP_INSTALL_CHECKS=1 : disable auto dependency install prompts

11 IDE Integration
VSCode extension from Marketplace adds run/debug code lens and test explorer.


## Supplementary Details
Configuration Options (test property):
- include: string[] default ['**/*.{test,spec}.{js,mjs,cjs,ts,cts,mts}']
- exclude: string[] default ['node_modules', 'dist']
- globals: boolean default false
- environment: 'node' | 'jsdom' | 'happy-dom' default 'node'
- threads: boolean | number default true (detect CPU count)
- coverage: object {
    enabled: boolean default false,
    reporter: string[] default ['text','lcov'],
    reportsDirectory: string default 'coverage'
  }
- setupFiles: string[] default []
- testTimeout: number default 5000 (ms)
- hookTimeout: number default 1000 (ms)
- ui: 'bdd' | 'tdd' default 'bdd'
- alias: Record<string,string> inherits Vite resolve.alias
- transformMode: Record<string,string[]> default { web: ['.js','.ts','.jsx','.tsx'] }

Implementation Steps:
1. Install vitest and ensure Vite and Node versions.
2. Configure package.json scripts.
3. Create config file or extend Vite config with test options.
4. Write test files with proper naming.
5. Run `vitest` or `vitest run`.
6. Analyze results, coverage reports if enabled.



## Reference Details
API Specifications:

1. defineConfig(config: UserConfig): ResolvedConfig
   import { defineConfig } from 'vitest/config'
   config.test: TestConfig

2. TestConfig Interface:
  include?: string[]                           // file globs
  exclude?: string[]                           // file globs
  globals?: boolean                            // inject global test APIs
  environment?: 'node' | 'jsdom' | 'happy-dom'
  threads?: boolean | number                   // concurrency
  coverage?: {
    enabled: boolean;
    provider?: 'c8' | 'istanbul';
    reporter?: string[];
    reportsDirectory?: string;
    clean?: boolean;
  }
  setupFiles?: string[]                        // paths to modules executed before tests
  testTimeout?: number                         // per-test timeout (ms)
  hookTimeout?: number                         // per-hook timeout (ms)
  ui?: 'bdd' | 'tdd'                           // test interface
  alias?: Record<string,string>                // module resolution aliases

3. Vitest CLI options:
  --run, -r           : run tests once
  --watch, -w         : watch mode default
  --config, -c <path> : config file path
  --port, -p <number> : dev server port
  --https             : use https server
  --coverage          : collect coverage
  --environment, -e   : test environment
  --silent            : suppress logs

4. SDK Method Signatures:
Vitest does not expose SDK; test API:
  test(name: string, fn: () => any | Promise<any>): void
  test.only(name: string, fn: (() => any) | Promise<any>): void
  test.skip(name: string, fn: (() => any) | Promise<any>): void

  expect(value: any): Matchers
  interface Matchers {
    toBe(expected: any): void
    toEqual(expected: any): void
    toMatchObject(expected: object): void
    toThrow(error?: string | Regex): void
    resolves: MatchersSync & PromiseMatchers
    rejects: MatchersSync & PromiseMatchers
  }

5. Code Examples:
```js
import { test, expect, beforeAll, afterAll } from 'vitest'

beforeAll(() => initializeDB())
afterAll(() => closeDB())

test('db returns user', async () => {
  const user = await getUser(1)
  expect(user.id).toBe(1)
  expect(user.name).toMatch(/^[A-Za-z]+$/)
})
```

6. Best Practices:
- Use setupFiles to load environment variables or mocks.
- Use globals=true to avoid import statements for test API.
- Isolate tests by setting environment per workspace config.

7. Troubleshooting:
Command: VITEST_SKIP_INSTALL_CHECKS=1 vitest run
Expected output:
  ✓ all tests passed
  Coverage summary printed if enabled

If tests hang:
- Increase testTimeout or hookTimeout
- Use --run to disable watch mode
- Check import paths and module aliases



## Information Dense Extract
install: npm i -D vitest; req: Vite>=5.0.0,Node>=18.0.0; tests: filename=/\.(test|spec)\.[jt]s$/; package.json script: test:vitest; config inheritance: root vite.config; override: vitest.config.ts defineConfig({test:TestConfig}); extensions:js,mjs,cjs,ts,cts,mts; merge: mergeConfig(viteConfig, defineConfig({test:{}})); workspace: test.workspace: (glob|path|object{name,root,environment,setupFiles}); CLI: vitest[-r|--run],--config,--port,--https,--coverage,--environment; env: VITEST_SKIP_INSTALL_CHECKS=1; Test API: test(name,fn),expect(val).toBe,x; config TestConfig: include,exclude,globals,environment,threads,coverage{enabled,provider,reporter,reportsDirectory,clean},setupFiles,testTimeout,hookTimeout,ui,alias; BestPractices: setupFiles,mock,globals; Troubleshoot: adjust timeouts,use --run,check aliases.

## Sanitised Extract
Table of Contents:
1 Test File Conventions
2 Installation Commands and Requirements
3 Package.json Scripts
4 Vite Unified Configuration
5 Standalone Vitest Config
6 Config File Extensions
7 Conditional Config Overrides
8 Merging Vite and Vitest Config
9 Workspaces Configuration
10 CLI Options and Environment Variables
11 IDE Integration

1 Test File Conventions
Tests must include .test. or .spec. in filename. Vitest identifies files matching /'.(test|spec)'.[jt]s$/ by default.

2 Installation Commands and Requirements
Requirements:
  Vite: >=5.0.0
  Node: >=18.0.0
Commands:
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest
  npx vitest (fallback install behavior)

3 Package.json Scripts
Add:
  'scripts': {
    'test': 'vitest'
  }
Optional coverage:
  'coverage': 'vitest run --coverage'

4 Vite Unified Configuration
If no vitest.config file, Vitest reads root vite.config.ts/js:
  resolve.alias, plugins pass-through.

5 Standalone Vitest Config
File: vitest.config.(js|ts)
Content:
  import { defineConfig } from 'vitest/config'
  export default defineConfig({ test: { /* options */ } })

6 Config File Extensions
Supported: .js, .mjs, .cjs, .ts, .cts, .mts
Unsupported: .json

7 Conditional Config Overrides
Use CLI: vitest --config <path>
Use env: process.env.VITEST or defineConfig(mode) to apply test-mode settings.

8 Merging Vite and Vitest Config
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'
export default mergeConfig(viteConfig, defineConfig({ test: { /* options */ } }))

9 Workspaces Configuration
vitest.config.ts:
  test.workspace: array of:
    - glob patterns: 'packages/*'
    - config files: 'tests/*/vitest.config.{e2e,unit}.ts'
    - objects: { test: { name, root, environment, setupFiles } }

10 CLI Options and Environment Variables
Commands:
  vitest             : interactive watch mode
  vitest run         : single-run
  vitest --port <n>  : override port
  vitest --https     : enable https server
  vitest --config <p>: use specific config
Env vars:
  VITEST_SKIP_INSTALL_CHECKS=1 : disable auto dependency install prompts

11 IDE Integration
VSCode extension from Marketplace adds run/debug code lens and test explorer.

## Original Source
Vitest Testing Framework
https://vitest.dev/guide/

## Digest of VITEST_GUIDE

# Vitest Guide Detailed Digest

Last Updated: 2023-10-05 (Date retrieved: 2024-06-15)

Data Size: 26657117 bytes

## Getting Started

### Installation Requirements
- Vite >= v5.0.0
- Node >= v18.0.0

### Installation Commands
- npm: npm install -D vitest
- yarn: yarn add -D vitest
- pnpm: pnpm add -D vitest
- bun: bun add -D vitest
- npx usage: npx vitest (does local bin check, $PATH lookup, then temp install)

## Writing Tests

### File Naming
- Tests must include `.test.` or `.spec.` in filename by default

### Example Test
```js
// sum.js
export function sum(a: number, b: number): number {
  return a + b
}

// sum.test.js
import { expect, test } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

### NPM Script
```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

## Configuration

### Unified with Vite
- If no vitest.config.ts, Vitest reads root vite.config.(js|ts)
- To override:
  - Create vitest.config.ts
  - Use CLI: vitest --config <path>
  - Use process.env.VITEST or defineConfig mode property

### Config File Extensions Supported
- .js, .mjs, .cjs, .ts, .cts, .mts
- .json unsupported

### Vite-less Setup
```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    // options
  }
})
```

### In Vite Config
```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
export default defineConfig({
  test: {
    // options
  }
})
```

### Merging Configs
```js
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'
export default mergeConfig(viteConfig, defineConfig({
  test: {
    // options
  }
}))
```

## Workspaces
```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    workspace: [
      'packages/*',
      'tests/*/vitest.config.{e2e,unit}.ts',
      { test: { name: 'happy-dom', root: './shared_tests', environment: 'happy-dom', setupFiles: ['./setup.happy-dom.ts'] } },
      { test: { name: 'node', root: './shared_tests', environment: 'node', setupFiles: ['./setup.node.ts'] } }
    ]
  }
})
```

## CLI Usage

### Default Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

### Commands
- vitest run: run tests once (no watch)
- vitest --port <number>
- vitest --https
- vitest --config <path>
- VITEST_SKIP_INSTALL_CHECKS=1: disable auto dependency installation

## IDE Integration
- VSCode extension: marketplace

## Examples & Projects
- Basic, fastify, in-source-test, lit, vue, marko, preact, react, solid, svelte, sveltekit, profiling, typecheck, workspace
- Projects using Vitest: unocss, unplugin-auto-import, unplugin-vue-components, vue, vite, vitesse, vitesse-lite, fluent-vue, vueuse, milkdown, gridjs-svelte, spring-easing, bytemd, faker, million, Vitamin, neodrag, svelte-multiselect, iconify, tdesign-vue-next, cz-git

## Unreleased Commits
- pkg.pr.new/vitest@{commit}
- Local build & link: pnpm link --global

## Community
- Discord, GitHub Discussions


## Attribution
- Source: Vitest Testing Framework
- URL: https://vitest.dev/guide/
- License: License: MIT
- Crawl Date: 2025-05-09T12:31:30.273Z
- Data Size: 26657117 bytes
- Links Found: 22269

## Retrieved
2025-05-09
