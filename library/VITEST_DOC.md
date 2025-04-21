# VITEST_DOC

## Crawl Summary
The crawled Vitest technical content provides detailed installation commands, requirements (Vite >= v5.0.0, Node >= v18.0.0), code examples for writing tests, instructions for configuring Vitest through vitest.config (including merging with Vite's config), detailed CLI usage, workspace configuration examples, dependency optimization options, environment settings, and troubleshooting best practices. It includes precise configuration options with their default values and effects.

## Normalised Extract
# Table of Contents

1. Installation
2. Writing Tests
3. Running Tests (CLI)
4. Configuration (vitest.config)
5. Dependency Optimization
6. Environment Configuration
7. Workspace Setup
8. CLI Options & Snapshots
9. Troubleshooting & Best Practices

---

## 1. Installation

• Commands: `npm install -D vitest`, `yarn add -D vitest`, `pnpm add -D vitest`, `bun add -D vitest`
• Requirements: Vite >= v5.0.0, Node >= v18.0.0

## 2. Writing Tests

Example:

```javascript
// sum.js
export function sum(a, b) {
  return a + b;
}
```

```javascript
// sum.test.js
import { expect, test } from 'vitest';
import { sum } from './sum.js';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

## 3. Running Tests (CLI)

• Run once: `vitest run`
• Watch mode: `vitest --watch`
• For coverage: `vitest run --coverage`

## 4. Configuration (vitest.config)

- Create `vitest.config.ts` using `defineConfig` from 'vitest/config'
- Merge with Vite config using `mergeConfig` if needed

Example:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*'
    ],
    globals: false,
    environment: 'node',
    pool: 'forks'
  }
});
```

## 5. Dependency Optimization

- `server.deps.external`: Default pattern `/\/node_modules\//`
- `server.deps.inline`: Array of packages or `true` to inline all
- `server.deps.fallbackCJS`: Default `false`
- `deps.optimizer`: Configuration for bundling (ssr and web modes)

## 6. Environment Configuration

- Set via `environment` in the config (e.g., 'node', 'jsdom', 'happy-dom', 'edge-runtime')
- Also configurable via file docblocks:

```javascript
/**
 * @vitest-environment jsdom
 */
```

## 7. Workspace Setup

Define in `vitest.workspace.ts`:

```typescript
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/*',
  'tests/*/vitest.config.{e2e,unit}.ts',
  {
    test: {
      name: 'happy-dom',
      root: './shared_tests',
      environment: 'happy-dom',
      setupFiles: ['./setup.happy-dom.ts'],
    },
  },
  {
    test: {
      name: 'node',
      root: './shared_tests',
      environment: 'node',
      setupFiles: ['./setup.node.ts'],
    },
  },
]);
```

## 8. CLI Options & Snapshots

- Update snapshots: `vitest --update` or `-u`
- Set test root: `--root <path>`
- Specify reporters: `--reporter=<name>`
- For additional options, run `npx vitest --help`

## 9. Troubleshooting & Best Practices

- Ensure test file naming with `.test.` or `.spec.`
- For Bun users, run tests using `bun run test`
- When using separate configs for Vite and Vitest, merge with `mergeConfig`
- Verify alias configurations are consistent between Vite and Vitest
- In sandboxed environments (e.g., vmThreads), be mindful of memory leaks and different global behaviors.


## Supplementary Details
## Supplementary Technical Specifications

- **Installation Requirements:**
  - Vite >= v5.0.0
  - Node >= v18.0.0

- **Configuration Options (vitest.config):**
  - include: string[]; Default: ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
  - exclude: string[]; Default: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*']
  - globals: boolean; Default: false
  - environment: string; Default: 'node' (options: 'node', 'jsdom', 'happy-dom', 'edge-runtime', etc.)
  - pool: 'threads' | 'forks' | 'vmThreads' | 'vmForks'; Default: 'forks'

- **Dependency Handling Options:**
  - server.deps.external: (string | RegExp)[]; Default: [/\/node_modules\//]
  - server.deps.inline: (string | RegExp)[] | true; Default: []
  - server.deps.fallbackCJS: boolean; Default: false
  - server.deps.cacheDir: string; Default: 'node_modules/.vite'
  - deps.optimizer: { ssr?: { enabled: boolean }, web?: { enabled: boolean, transformAssets?: boolean, transformCss?: boolean, transformGlobPattern?: RegExp | RegExp[] } }

- **CLI Options Include:**
  - --config: specify custom config file
  - --watch: enable watch mode
  - --update (or -u): update snapshot files
  - --reporter: specify reporter (e.g., default, json, html, junit)
  - --root / --dir: set project root

- **Best Practices:**
  - Use a unified configuration when possible; merge Vite and Vitest configurations.
  - For in-depth debugging, use `deps.optimizer` options to force rebundling or inspect inlined modules.
  - For cross-environment testing, set the environment via config or docblocks to match test requirements.
  - In monorepo setups, define workspaces using glob patterns and explicit config objects.

- **Troubleshooting Procedures:**
  - To diagnose misconfiguration, run `npx vitest --help` to display all available CLI options.
  - When snapshots fail, use `vitest --update` to refresh snapshots.
  - For dependency resolution issues, inspect `server.deps` and `deps.optimizer` settings.
  - For sandbox related errors (e.g., in vmThreads), review memory limits and fallback options in pool settings.


## Reference Details
## Complete API and SDK Specifications

### 1. defineConfig API

Signature:

```typescript
function defineConfig(config: { test?: TestOptions; [key: string]: any }): { test?: TestOptions; [key: string]: any };
```

Where TestOptions may include:

- include: string[]
- exclude: string[]
- globals: boolean
- environment: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime' | string
- pool: 'threads' | 'forks' | 'vmThreads' | 'vmForks'
- deps: {
    external?: (string | RegExp)[];
    inline?: (string | RegExp)[] | true;
    fallbackCJS?: boolean;
    cacheDir?: string;
    optimizer?: {
       ssr?: { enabled: boolean };
       web?: { enabled: boolean, transformAssets?: boolean, transformCss?: boolean, transformGlobPattern?: RegExp | RegExp[] };
    };
  }

### 2. mergeConfig API

Signature:

```typescript
function mergeConfig(baseConfig: any, overrideConfig: any): any;
```

Usage Example:

```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    exclude: ['packages/template/*'],
  },
}));
```

### 3. CLI Options

- `--config <path>`: Use a specific configuration file
- `--watch` or `-w`: Enable watch mode for test execution
- `--update` or `-u`: Update snapshot files
- `--coverage`: Run tests with code coverage
- `--reporter <name>`: Specify reporter (e.g., default, json, html, junit)
- `--root <path>` / `--dir <path>`: Specify the project root

Example Command:

```bash
npx vitest --config ./vitest.config.ts --watch
```

### 4. Code Examples with Comments

```javascript
// Example test file: math.test.js
import { test, expect } from 'vitest';

// Simple sum function
export const sum = (a, b) => a + b;

// Test case: verifies that sum adds numbers correctly
test('sum adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

### 5. Best Practices

- Always include `.test.` or `.spec.` in test file names to ensure detection.
- Use a unified config file for both Vite and Vitest to avoid mismatched configuration.
- Utilize workspace configuration in monorepo setups to manage multiple test environments within a single process.
- Update snapshots with `--update` flag when intentional changes occur.

### 6. Detailed Troubleshooting Procedures

1. If tests are not found:
   - Verify that file patterns in the `include` and `exclude` options are accurate.
   - Run `npx vitest --help` to check effective CLI parameters.

2. For dependency resolution errors:
   - Check the settings under `server.deps` and ensure that externalized modules are correctly patterned.
   - Use inline options in `server.deps.inline` for packages in ESM format.

3. For sandbox environment issues (e.g., using `vmThreads`):
   - Consider switching to `forks` if native module globals cause errors.
   - Increase memory limits using `poolOptions.vmThreads.memoryLimit` if memory leaks are detected.

4. To merge Vite and Vitest configuration files:
   - Use the `mergeConfig` method as shown in the example to combine settings without overriding vital options.

Commands for debugging configuration:

```bash
# List effective configuration
npx vitest --config ./vitest.config.ts --debug

# Run tests with verbose logging
npx vitest --watch --reporter verbose
```

These API specifications, complete method signatures, detailed code examples, configuration options, best practices, and troubleshooting procedures form the complete technical reference for implementing and using Vitest directly without consulting external documentation.


## Original Source
Vitest Testing Framework Documentation
https://vitest.dev/

## Digest of VITEST_DOC

# Vitest Documentation (Retrieved: 2023-10-06)

## Installation

- Install via npm: `npm install -D vitest`
- Install via yarn: `yarn add -D vitest`
- Install via pnpm: `pnpm add -D vitest`
- Install via bun: `bun add -D vitest`

Requirements:
- Vite >= v5.0.0
- Node >= v18.0.0

## Writing Tests

Example implementation:

```javascript
// sum.js
export function sum(a, b) {
  return a + b;
}
```

```javascript
// sum.test.js
import { expect, test } from 'vitest';
import { sum } from './sum.js';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Update your package.json:

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

## Running Tests (CLI)

- Run tests once: `vitest run`
- Watch mode: `vitest --watch` or `npm run test` (if configured)
- For coverage: `vitest run --coverage`

For help: `npx vitest --help`

## Configuration

Vitest automatically reads Vite's configuration. In case of custom testing setups, create a separate config file:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Insert precise configuration options here
  },
});
```

To merge with Vite's config:

```javascript
// vitest.config.mjs
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    // Custom test configuration options
  },
}));
```

### Example: Config Options in vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*'],
    globals: false,
    environment: 'node',
    pool: 'forks',
    deps: {
      external: [/\/node_modules\//],
      inline: [],
      fallbackCJS: false,
      cacheDir: 'node_modules/.vite',
      optimizer: {
        ssr: { enabled: false },
        web: { enabled: true }
      }
    }
  },
});
```

## Workspaces

Define workspace configuration in a separate file (e.g., vitest.workspace.ts):

```typescript
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/*',
  'tests/*/vitest.config.{e2e,unit}.ts',
  {
    test: {
      name: 'happy-dom',
      root: './shared_tests',
      environment: 'happy-dom',
      setupFiles: ['./setup.happy-dom.ts'],
    },
  },
  {
    test: {
      name: 'node',
      root: './shared_tests',
      environment: 'node',
      setupFiles: ['./setup.node.ts'],
    },
  },
]);
```

## Dependency Optimization & Transformation

Key configuration parameters for dependency handling in the test environment:

- `server.deps.external`: Default is `/\/node_modules\//`
- `server.deps.inline`: Can be an array of package names or RegExp patterns or `true` for inlining all dependencies
- `server.deps.fallbackCJS`: Defaults to `false`
- `deps.optimizer`: Enables bundling via esbuild; supports `ssr` and `web` modes

Example:

```typescript
export default defineConfig({
  test: {
    deps: {
      optimizer: {
        web: { enabled: true, transformAssets: true, transformCss: true, transformGlobPattern: [] },
        ssr: { enabled: false }
      }
    }
  }
});
```

## Environment Configuration

Set the test environment using the `environment` option or with file docblocks. Common environments:
- `node` (default)
- `jsdom`
- `happy-dom`
- `edge-runtime`

Example:

```typescript
export default defineConfig({
  test: {
    environment: 'jsdom'
  }
});
```

Docblock style:

```javascript
/**
 * @vitest-environment jsdom
 */
```

## CLI and Snapshot Options

- Update snapshots: `vitest --update` or `-u`
- Watch mode: `vitest --watch` or `-w`
- Specify test root or directory: `--root <path>` or `--dir <path>`
- Pass custom reporters using the `--reporter` flag

## Troubleshooting & Best Practices

- Use correct file naming: tests must contain `.test.` or `.spec.`
- If using Bun, run tests with `bun run test`.
- For debugging in sandbox environments (e.g., vmThreads), be aware of memory leaks and differences in native module globals.
- Use merging configuration (with `mergeConfig`) when splitting Vite and Vitest configurations.
- Ensure alias configurations are consistent between Vite and Vitest.

---

Attribution: Data retrieved from https://vitest.dev/ (Data Size: 25494893 bytes, Links Found: 21765).

## Attribution
- Source: Vitest Testing Framework Documentation
- URL: https://vitest.dev/
- License: MIT
- Crawl Date: 2025-04-21T04:49:04.625Z
- Data Size: 25494893 bytes
- Links Found: 21765

## Retrieved
2025-04-21
