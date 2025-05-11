# VITEST_SETUP

## Crawl Summary
Install with npm/yarn/pnpm/bun, requires Vite>=5 and Node>=18; test files must use .test. or .spec., import {test,expect} from 'vitest'; add "test": "vitest" script; configure via vite.config.ts or vitest.config.ts using defineConfig from 'vitest/config'; supported config file extensions .js,.mjs,.cjs,.ts,.cts,.mts; mergeConfig for combining Vite and Vitest configs; workspace support via test.workspace array; CLI commands vitest, vitest run, vitest run --coverage, flags --port, --https, --config; disable auto-install via VITEST_SKIP_INSTALL_CHECKS; use pnpm link for unreleased builds; recommended VSCode extension.

## Normalised Extract
Table of Contents
 1 Installation
 2 Writing Tests
 3 Configuration
 4 Workspaces
 5 CLI Usage
 6 Environment Variables
 7 Unreleased Builds

1 Installation
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest
  requirements: Vite>=5.0.0, Node>=18.0.0
  alternative: npx vitest

2 Writing Tests
  file suffix: .test. or .spec.
  import { test, expect } from 'vitest'
  sum.js: export function sum(a,b){return a+b}
  sum.test.js: test('desc',()=>expect(sum(1,2)).toBe(3))
  package.json script: "test": "vitest"
  run: npm run test / yarn test / pnpm test / bun run test

3 Configuration
  default: root vite.config.ts recognized
  override: create vitest.config.ts with defineConfig
  CLI: --config <path>
  env: process.env.VITEST or mode property
  supported extensions: .js .mjs .cjs .ts .cts .mts
  no .json
  merge existing Vite config: import mergeConfig from 'vitest/config'
  test options: environment, globals, setupFiles, include, coverage(provider, reporter[], reportsDirectory)

4 Workspaces
  define test.workspace as array:
    - globs (packages/*)
    - config file patterns (tests/*/vitest.config.{e2e,unit}.ts)
    - inline config objects {name, root, environment, setupFiles}

5 CLI Usage
  vitest              // watch mode
  vitest run          // single run
  vitest run --coverage
  flags: --port <n>, --https, --config <path>
  help: npx vitest --help

6 Environment Variables
  VITEST_SKIP_INSTALL_CHECKS=1 disables auto dependency prompts

7 Unreleased Builds
  git clone https://github.com/vitest-dev/vitest.git
  cd vitest && pnpm install
  cd packages/vitest && pnpm run build && pnpm link --global
  in project: pnpm link --global vitest

## Supplementary Details
Prerequisites:
 Vite>=5.0.0
 Node>=18.0.0

Config file priority:
 1. vitest.config.ts/js
 2. --config CLI
 3. mode property in defineConfig or process.env.VITEST

Supported config extensions: .js .mjs .cjs .ts .cts .mts

Default test include pattern: **/*.{test,spec}.{js,mjs,cjs,ts,cts,mts}

Coverage defaults:
 provider: 'c8'
 reporter: ['text']
 reportsDirectory: 'coverage'

Workspace resolution:
 patterns and inline entries processed in defined order
 root paths must contain a vitest.config

CLI default ports:
 watch: 51234
 run: --port 51234
 https disabled by default

IDE:
 VSCode extension id: 'Vitest.run'

Linking unreleased:
 pnpm link --global in package
 pnpm link --global vitest in project


## Reference Details
API imports:
 import { test, describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

Method Signatures:
 test(name: string, fn: () => unknown|Promise<unknown>, options?: {timeout?: number, threads?: boolean, isolate?: boolean}): void
 describe(name: string, fn: () => void): void
 beforeAll(fn: () => void|Promise<void>, timeout?: number): void
 afterAll(fn: () => void|Promise<void>, timeout?: number): void
 beforeEach(fn: () => void|Promise<void>, timeout?: number): void
 afterEach(fn: () => void|Promise<void>, timeout?: number): void

Expect API:
 expect(received: any): {
   toBe(expected: any): void;
   toEqual(expected: any): void;
   toMatchSnapshot(): void;
   toThrow(expected?: string|RegExp|Error): void;
 }

Configuration Options:
 defineConfig({
  test: {
    include?: string[]                // default ['**/*.{test,spec}.{js,mjs,cjs,ts,cts,mts}']
    exclude?: string[]                // default ['node_modules', '.git']
    extensions?: string[]             // file extensions
    environment?: 'node'|'jsdom'|'happy-dom' // default 'node'
    globals?: boolean                 // default false
    threads?: boolean                 // default true
    isolate?: boolean                 // default false
    setupFiles?: string[]             // paths to setup files
    coverage?: {
      provider?: 'c8'|'istanbul';    // default 'c8'
      reporter?: string[];           // e.g. ['text','html']
      reportsDirectory?: string;     // default 'coverage'
      exclude?: string[];            // default ['node_modules']
      statements?: number;           // threshold
      branches?: number;
      functions?: number;
      lines?: number;
    }
    reporters?: string[]              // e.g. ['default','junit']
    watch?: boolean                   // default true
    hookTimeout?: number              // default 5000
    testTimeout?: number              // default 5000
    clean?: boolean                   // clear cache between runs
    threadsTimeout?: number           // worker idle timeout
    maxConcurrency?: number           // default 5
  }
 })

Best Practices:
 • co-locate test files next to source modules
 • use explicit include/glob patterns for consistent discovery
 • enable globals for shorter assertions when using TypeScript
 • isolate tests to avoid shared state

Troubleshooting:
 • "vitest not found" → install locally or use npx
 • Permission errors linking → run with elevated privileges
 • Environment mismatch → ensure NODE_ENV=test or use environment option
 • Coverage missing files → adjust include/exclude patterns

Exact Commands and Expected Output:
 npm run test
 > vitest
 PASS tests/example.test.js
  ✓ example test (5ms)

 vitest run --coverage
 > vitest run --coverage
---------------------------|---------|----------|---------|---------|-------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------------|---------|----------|---------|---------|-------------------
All files                  |   85.71 |    66.67 |     100 |   85.71 |                   
  src/sum.js               |     100 |      100 |     100 |     100 |                   
 coverage summary          |   85.71 |    66.67 |     100 |   85.71 |                   
---------------------------|---------|----------|---------|---------|-------------------

## Information Dense Extract
install: npm install -D vitest | yarn add -D vitest | pnpm add -D vitest | bun add -D vitest; require Vite>=5, Node>=18; tests: *.{test,spec}.{js,mjs,cjs,ts,cts,mts}; import {test,expect} from 'vitest'; script: "test":"vitest"; run via npm/yarn/pnpm/bun; config: defineConfig from 'vitest/config' or use vite.config.ts; extensions js,mjs,cjs,ts,cts,mts; mergeConfig(viteConfig, defineConfig({test:{...}})); config options: include,exclude,environment,globals,threads,isolate,setupFiles,coverage(provider,c8,reporter[text,html],reportsDirectory,thresholds); workspace: test.workspace as array of globs/config objects; CLI: vitest, vitest run, vitest run --coverage, flags --port,--https,--config; env VITEST_SKIP_INSTALL_CHECKS=1; API: test(name,fn,options), describe(name,fn), hooks; expect API: toBe,toEqual,toMatchSnapshot,toThrow; troubleshooting: npx vitest if missing, ensure NODE_ENV=test, adjust patterns

## Sanitised Extract
Table of Contents
 1 Installation
 2 Writing Tests
 3 Configuration
 4 Workspaces
 5 CLI Usage
 6 Environment Variables
 7 Unreleased Builds

1 Installation
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest
  requirements: Vite>=5.0.0, Node>=18.0.0
  alternative: npx vitest

2 Writing Tests
  file suffix: .test. or .spec.
  import { test, expect } from 'vitest'
  sum.js: export function sum(a,b){return a+b}
  sum.test.js: test('desc',()=>expect(sum(1,2)).toBe(3))
  package.json script: 'test': 'vitest'
  run: npm run test / yarn test / pnpm test / bun run test

3 Configuration
  default: root vite.config.ts recognized
  override: create vitest.config.ts with defineConfig
  CLI: --config <path>
  env: process.env.VITEST or mode property
  supported extensions: .js .mjs .cjs .ts .cts .mts
  no .json
  merge existing Vite config: import mergeConfig from 'vitest/config'
  test options: environment, globals, setupFiles, include, coverage(provider, reporter[], reportsDirectory)

4 Workspaces
  define test.workspace as array:
    - globs (packages/*)
    - config file patterns (tests/*/vitest.config.{e2e,unit}.ts)
    - inline config objects {name, root, environment, setupFiles}

5 CLI Usage
  vitest              // watch mode
  vitest run          // single run
  vitest run --coverage
  flags: --port <n>, --https, --config <path>
  help: npx vitest --help

6 Environment Variables
  VITEST_SKIP_INSTALL_CHECKS=1 disables auto dependency prompts

7 Unreleased Builds
  git clone https://github.com/vitest-dev/vitest.git
  cd vitest && pnpm install
  cd packages/vitest && pnpm run build && pnpm link --global
  in project: pnpm link --global vitest

## Original Source
Vitest Testing Framework
https://vitest.dev/guide/

## Digest of VITEST_SETUP

# Installation

Install Vitest locally as a dev dependency:

```bash
npm install -D vitest
# or yarn add -D vitest
# or pnpm add -D vitest
# or bun add -D vitest
```

Requirements:
- Vite >=5.0.0
- Node >=18.0.0

To run without local install:
```bash
npx vitest
```  

# Writing Tests

File naming:
- Suffix must include `.test.` or `.spec.`

Example:

```js
// sum.js
export function sum(a, b) {
  return a + b
}

// sum.test.js
import { test, expect } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

Add script to package.json:

```json
"scripts": {
  "test": "vitest"
}
```

Run:
- npm run test
- yarn test
- pnpm test
- bun run test (for Bun)

# Configuration

Vitest reads Vite config by default. Override or separate:

1. vitest.config.ts (highest priority)
2. CLI option `--config ./path/to/vitest.config.ts`
3. process.env.VITEST or defineConfig mode property

Supported config extensions: .js, .mjs, .cjs, .ts, .cts, .mts (no .json)

Example vitest.config.ts:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./setup.ts'],
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage'
    }
  }
})
```

Merge with existing Vite config:

```js
import viteConfig from './vite.config.mjs'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    /* overrides */
  }
}))
```

# Workspaces Support

In vitest.config.ts:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    workspace: [
      'packages/*',
      'tests/*/vitest.config.{e2e,unit}.ts',
      { name: 'node', root: './shared', environment: 'node' },
      { name: 'happy-dom', root: './shared', environment: 'happy-dom', setupFiles: ['./setup.happy.ts'] }
    ]
  }
})
```

# CLI Usage

- vitest             # start in watch mode
- vitest run         # run tests once
- vitest run --coverage
- Options: --port <number>, --https, --config <path>
- To view all flags: `npx vitest --help`

# Automatic Dependency Installation

Disable prompts:
```bash
export VITEST_SKIP_INSTALL_CHECKS=1
```

# Using Unreleased Commits

```bash
git clone https://github.com/vitest-dev/vitest.git
cd vitest
pnpm install
cd packages/vitest
pnpm run build
pnpm link --global
# then in project
pm/`: pnpm link --global vitest
```

# IDE Integrations

- VS Code extension: install `Vitest Runner` from Marketplace

_Last updated: 2023-10-05_

## Attribution
- Source: Vitest Testing Framework
- URL: https://vitest.dev/guide/
- License: MIT
- Crawl Date: 2025-05-11T01:23:19.627Z
- Data Size: 29396863 bytes
- Links Found: 23528

## Retrieved
2025-05-11
