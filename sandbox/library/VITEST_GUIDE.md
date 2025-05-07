# VITEST_GUIDE

## Crawl Summary
Vite >=5.0.0, Node >=18.0.0. Install via npm/yarn/pnpm/bun. Tests named *.test.* or *.spec.*. CLI: vitest, vitest run --coverage. Config: extends Vite config or separate vitest.config.*. Supported config extensions: .js/.mjs/.cjs/.ts/.cts/.mts. Key test options: globals, environment, coverage.provider, coverage.reporter, setupFiles, alias. Workspaces via test.workspace with glob patterns or object entries. CLI flags: --config, --port, --https, --coverage. Env: VITEST_SKIP_INSTALL_CHECKS=1. Default npm scripts: test, coverage. Troubleshoot test discovery and config file load.

## Normalised Extract
Table of Contents:
1 Installation
2 Writing Tests
3 Running Tests
4 Configuration
5 Workspaces
6 CLI Options
7 Environment Variables
8 Troubleshooting

1 Installation
- Requirements: Vite>=5.0.0, Node>=18.0.0
- Commands:
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest
- Or run via npx: npx vitest

2 Writing Tests
- File patterns: *.test.[js|ts], *.spec.[js|ts]
- Import:
  import { test, expect } from 'vitest'
- Example:
  test('description', () => { expect(fn()).toBe(value) })

3 Running Tests
- Add to package.json scripts: "test": "vitest"
- Commands:
  npm run test
  yarn test
  pnpm test
  bun run test (for Bun)
- Single run: vitest run

4 Configuration
- Default: reads vite.config.*
- Custom: create vitest.config.{js,mjs,cjs,ts,cts,mts}
- CLI override: --config <path>
- Conditional mode: process.env.VITEST or defineConfig({ mode:'test' })
- test options:
  globals: boolean (default false)
  environment: 'node' | 'jsdom' | 'happy-dom'
  coverage.provider: 'c8' | 'istanbul'
  coverage.reporter: string[]
  setupFiles: string[]
  alias: Record<string,string>

5 Workspaces
- test.workspace: (string|object)[]
- Strings: glob patterns for config files or directories
- Objects: inline test options per workspace

6 CLI Options
--config <path>
--port <number>
--https
--coverage
--watch
--reporter <name>

7 Environment Variables
VITEST_SKIP_INSTALL_CHECKS=1 disables dependency prompts

8 Troubleshooting
- No tests: check filename patterns and include/exclude in config
- Config not loaded: verify CLI flag, file extension, defineConfig import


## Supplementary Details
Configuration Options (test property):
- include: string[] default [ '**/*.{test,spec}.{js,mjs,cjs,ts,cts,mts}' ]
- exclude: string[] default [ 'node_modules', 'dist', 'coverage' ]
- globals: boolean default false
- environment: string default 'node'
- watch: boolean default false
- coverage: object {
    provider: 'c8',
    reporter: ['text', 'lcov'],
    reportsDirectory: 'coverage'
  }
- threads: boolean default true
- isolate: boolean default false
- setupFiles: string[] default []
- alias: Record<string,string> default {}

Implementation Steps:
1. Install Vitest
2. Add test files
3. Create config if needed
4. Run tests
5. Analyze coverage
6. Integrate with CI using vitest run --coverage

Best Practices:
- Use same config file for Vite and Vitest
- Leverage defineConfig from 'vitest/config'
- Enable globals for Jest-like API
- Use workspaces for mono-repos


## Reference Details
defineConfig signature:
export declare function defineConfig(config: UserConfig): UserConfig

UserConfig interface extends ViteConfig with property:
  test?: {
    include?: string[]
    exclude?: string[]
    globals?: boolean
    environment?: 'node'|'jsdom'|'happy-dom'
    threads?: boolean
    isolate?: boolean
    watch?: boolean
    coverage?: {
      provider?: 'c8'|'istanbul'
      reporter?: string[]
      reportsDirectory?: string
    }
    setupFiles?: string[]
    alias?: Record<string,string>
    workspace?: (string|{ test: Partial<TestOptions> })[]
  }

CLI Options:
--config <string>    Path to config file
--port <number>      Port for web server
--https              Enable HTTPS
--coverage           Enable coverage collection
--watch              Enable watch mode
--reporter <string>  Use custom reporter

Example Code Pattern:
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: { globals: true, environment: 'jsdom' }
})

Troubleshooting Commands:
vitest --help
vitest run --coverage
vitest --config ./vitest.config.ts

Expected Outputs:
- Successful test run prints ✓ fileName
- Coverage report written to coverage/ folder


## Information Dense Extract
Vite>=5.0.0 Node>=18.0.0; install: npm/yarn/pnpm/bun add -D vitest; test patterns: **/*.{test,spec}.{js,mjs,cjs,ts,cts,mts}; CLI: vitest, vitest run --coverage, flags: --config, --port, --https, --coverage, --watch; config: vite.config.* or vitest.config.*, extensions .js/.mjs/.cjs/.ts/.cts/.mts; defineConfig({ test:{ include,exclude,globals,environment,threads,isolate,watch,coverage:{provider,reporter,reportsDirectory},setupFiles,alias,workspace } }); env VITEST_SKIP_INSTALL_CHECKS=1; best practices: single config for Vite/Vitest, use defineConfig, workspaces setup, globals for expect; troubleshooting: verify file patterns and config load.

## Sanitised Extract
Table of Contents:
1 Installation
2 Writing Tests
3 Running Tests
4 Configuration
5 Workspaces
6 CLI Options
7 Environment Variables
8 Troubleshooting

1 Installation
- Requirements: Vite>=5.0.0, Node>=18.0.0
- Commands:
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest
- Or run via npx: npx vitest

2 Writing Tests
- File patterns: *.test.[js|ts], *.spec.[js|ts]
- Import:
  import { test, expect } from 'vitest'
- Example:
  test('description', () => { expect(fn()).toBe(value) })

3 Running Tests
- Add to package.json scripts: 'test': 'vitest'
- Commands:
  npm run test
  yarn test
  pnpm test
  bun run test (for Bun)
- Single run: vitest run

4 Configuration
- Default: reads vite.config.*
- Custom: create vitest.config.{js,mjs,cjs,ts,cts,mts}
- CLI override: --config <path>
- Conditional mode: process.env.VITEST or defineConfig({ mode:'test' })
- test options:
  globals: boolean (default false)
  environment: 'node' | 'jsdom' | 'happy-dom'
  coverage.provider: 'c8' | 'istanbul'
  coverage.reporter: string[]
  setupFiles: string[]
  alias: Record<string,string>

5 Workspaces
- test.workspace: (string|object)[]
- Strings: glob patterns for config files or directories
- Objects: inline test options per workspace

6 CLI Options
--config <path>
--port <number>
--https
--coverage
--watch
--reporter <name>

7 Environment Variables
VITEST_SKIP_INSTALL_CHECKS=1 disables dependency prompts

8 Troubleshooting
- No tests: check filename patterns and include/exclude in config
- Config not loaded: verify CLI flag, file extension, defineConfig import

## Original Source
Vitest Guide
https://vitest.dev/guide/

## Digest of VITEST_GUIDE

# Installation

Minimum Requirements:
- Vite >= v5.0.0
- Node >= v18.0.0

Install commands (add to devDependencies):
npm install -D vitest
yarn add -D vitest
pnpm add -D vitest
bun add -D vitest

You may also run:
npx vitest

# Writing Tests

Filename patterns: must include `.test.` or `.spec.`

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
{
  "scripts": {
    "test": "vitest"
  }
}
```

Run:
npm run test
# or
yarn test
# or
pnpm test

# Configuring Vitest

Vitest reads `vite.config.*` by default. To override:
1. Create `vitest.config.ts` or .js/.mjs/.cjs/.ts/.cts/.mts (JSON not supported).
2. Pass `--config` flag: `vitest --config ./path/to/vitest.config.ts`.
3. Use `process.env.VITEST` or `mode` property in `defineConfig` to conditionally apply options.

Example `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'lcov'],
    },
    setupFiles: ['./test/setup.ts'],
    alias: {
      '@src': '/src'
    }
  }
})
```

# Workspaces Support

In `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    workspace: [
      'packages/*',
      'tests/*/vitest.config.{e2e,unit}.ts',
      {
        test: { name: 'node', environment: 'node', root: './shared', setupFiles: ['./setup.node.ts'] }
      }
    ]
  }
})
```

# Command Line Interface

Default npm scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

Run tests once:
vitest run

CLI options:
--config <path>     path to config file
--port <number>     port for web UI
--https             enable HTTPS
--coverage          enable coverage

# Environment Variables

VITEST_SKIP_INSTALL_CHECKS=1  disable automatic dependency install checks

# IDE Integration

Install VS Code extension: "Vitest Runner"

# Troubleshooting

If no tests found:
- Ensure file names include `.test.` or `.spec.`
- Check `test.include` patterns in config.

If configuration not applied:
- Verify `--config` path and file extension.
- Use `defineConfig` from 'vitest/config' when using TS.

Last updated: 2024-06-10

Data Size: 33404230 bytes
Links Found: 24844
Content Source: https://vitest.dev/guide/

## Attribution
- Source: Vitest Guide
- URL: https://vitest.dev/guide/
- License: License
- Crawl Date: 2025-05-07T00:39:33.413Z
- Data Size: 33404230 bytes
- Links Found: 24844

## Retrieved
2025-05-07
