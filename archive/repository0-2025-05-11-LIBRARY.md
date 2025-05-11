sandbox/library/VITEST_SETUP.md
# sandbox/library/VITEST_SETUP.md
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
sandbox/library/SEMANTIC_RELEASE.md
# sandbox/library/SEMANTIC_RELEASE.md
# SEMANTIC_RELEASE

## Crawl Summary
syntax: semanticRelease(options:Object, config:Object) => Promise<Boolean|ResultObject>

options.branches:Array<String|Object> default [\"+([0-9])?(.{+([0-9]),x}).x\",\"master\",\"main\",\"next\",\"next-major\",{name:\"beta\",prerelease:true},{name:\"alpha\",prerelease:true}]
options.repositoryUrl:String
options.extends:String|String[]
options.githubUrl:String
options.githubApiPathPrefix:String

config.cwd:String default process.cwd()
config.env:Object default process.env
config.stdout:WritableStream default process.stdout
config.stderr:WritableStream default process.stderr

Result: lastRelease, commits[], nextRelease, releases[] with complete field definitions
Plugin lifecycles: verifyConditions, analyzeCommits, verifyRelease, generateNotes, addChannel, prepare, publish, success, fail
Context keys by lifecycle: common keys, commits and releases injection
Logger: context.logger.log/warn/success/error


## Normalised Extract
Table of Contents:
1. API Signature
2. Core Options
3. Execution Config
4. Result Structure
5. Plugin Lifecycle Methods
6. Context Object Keys
7. Environment Variables
8. Logger Usage

1. API Signature
semanticRelease(options:Object, config:Object) => Promise<Boolean|ResultObject>

2. Core Options
branches: Array<String|{name:String,prerelease:Boolean}>
repositoryUrl: String
extends: String|Array<String>
githubUrl: String
githubApiPathPrefix: String

3. Execution Config
cwd: String (default process.cwd())
env: Object (default process.env)
stdout: WritableStream (default process.stdout)
stderr: WritableStream (default process.stderr)

4. Result Structure
lastRelease: { version:String, gitHead:String, gitTag:String, channel:String }
commits: Array<{ commit:{long:String,short:String}, tree:{long:String,short:String}, author:{name:String,email:String,date:String}, committer:{name:String,email:String,date:String}, subject:String, body:String, hash:String, message:String, committerDate:String }>
nextRelease: { type:String, version:String, gitHead:String, gitTag:String, notes:String, channel:String }
releases: Array<{ name?:String, url?:String, type:String, gitHead:String, version:String, gitTag:String, notes:String, pluginName:String, channel:String }>

5. Plugin Lifecycle Methods
verifyConditions(pluginConfig:Object, context:Object) => Promise<void>
analyzeCommits(pluginConfig:Object, context:Object) => Promise<String|void>
verifyRelease(pluginConfig:Object, context:Object) => Promise<void>
generateNotes(pluginConfig:Object, context:Object) => Promise<String>
addChannel(pluginConfig:Object, context:Object) => Promise<void>
prepare(pluginConfig:Object, context:Object) => Promise<Array<{path:String, data:String}>>
publish(pluginConfig:Object, context:Object) => Promise<Array<{name:String, url:String}>>
success(pluginConfig:Object, context:Object) => Promise<void>
fail(pluginConfig:Object, context:Object) => Promise<void>

6. Context Object Keys
cwd: String, env: Object, envCi: Object, options: Object, branches: Array, commit: String, branch: String, main: Boolean
Additional by lifecycle: commits, lastRelease, nextRelease, releases, errors

7. Environment Variables
context.env holds all process.env variables for plugin logic

8. Logger Usage
context.logger.log(message)
context.logger.warn(message)
context.logger.success(message)
context.logger.error(message)

## Supplementary Details
Plugin Development Steps:
1. Initialize project: yarn init
2. In index.js, export methods: module.exports = { verifyConditions, analyzeCommits, ... }
3. Create src/ for logic, test/ for tests
4. Each lifecycle method signature: async function(methodConfig, context)
5. Validate pluginConfig fields; accumulate errors; throw AggregateError(errors)
6. Access environment in methods via context.env
7. Log via context.logger

Configuration File (.releaserc.js or release.config.js):
module.exports = {
  branches: ["main", {name:"beta", prerelease:true}],
  repositoryUrl: "https://github.com/user/repo.git",
  extends: "@semantic-release/recommended",
  plugins: [
    ["@semantic-release/commit-analyzer", {releaseRules:[{type:"docs",release:"patch"}]}],
    ["@semantic-release/release-notes-generator", {}],
    ["@semantic-release/github", {assets:[{path:"dist/*.js",label:"Dist"}]}]
  ],
  githubUrl: "https://github.com",
  githubApiPathPrefix: "/api/v3"
};

CI Integration (GitHub Actions example):
- uses: actions/setup-node@v2
  with: node-version: 16
- run: npm ci
- run: npx semantic-release
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
    GH_TOKEN: ${{ secrets.GH_TOKEN }}

## Reference Details
API: semanticRelease(options:Object, config?:Object) => Promise<Boolean|ResultObject>

Parameters:
options:
  branches: Array<String|{name:String,prerelease:Boolean}>
  repositoryUrl: String
  extends: String|Array<String>
  githubUrl: String
  githubApiPathPrefix: String
config (optional):
  cwd: String (default process.cwd())
  env: Object (default process.env)
  stdout: WritableStream (default process.stdout)
  stderr: WritableStream (default process.stderr)

Return: Promise<Boolean|{
  lastRelease:{version:String,gitHead:String,gitTag:String,channel:String},
  commits:Array<Commit>,
  nextRelease:{type:String,version:String,gitHead:String,gitTag:String,notes:String,channel:String},
  releases:Array<Release>
}>

Commit:
{ commit:{long:String,short:String}, tree:{long:String,short:String}, author:{name:String,email:String,date:String}, committer:{name:String,email:String,date:String}, subject:String, body:String, hash:String, message:String, committerDate:String }

Release:
{ name?:String, url?:String, type:String, gitHead:String, version:String, gitTag:String, notes:String, pluginName:String, channel:String }

Plugin Lifecycle Method Signatures:
async verifyConditions(pluginConfig:Object, context:Object):void
async analyzeCommits(pluginConfig:Object, context:Object):String|void
async verifyRelease(pluginConfig:Object, context:Object):void
async generateNotes(pluginConfig:Object, context:Object):String
async addChannel(pluginConfig:Object, context:Object):void
async prepare(pluginConfig:Object, context:Object):Array<{path:String,data:String}>
async publish(pluginConfig:Object, context:Object):Array<{name:String,url:String,channel?:String}>
async success(pluginConfig:Object, context:Object):void
async fail(pluginConfig:Object, context:Object):void

Best Practices:
- Always implement verifyConditions
- Use shareable configs via extends field
- Validate pluginConfig and environment variables early
- Run semantic-release in CI after tests pass

Troubleshooting Procedures:
- List published versions: npm dist-tags ls <package-name>
- Dry-run: npx semantic-release --dry-run
- Bypass CI check: npx semantic-release --no-ci


## Information Dense Extract
semanticRelease(options:Object, config:Object) => Promise<{lastRelease, commits[], nextRelease, releases[]}>
options: branches:Array<String|{name,prerelease}>, repositoryUrl:String, extends:String|String[], githubUrl:String, githubApiPathPrefix:String
config: cwd:String, env:Object, stdout:WritableStream, stderr:WritableStream
Result keys: lastRelease{version,gitHead,gitTag,channel}, commits[{commit{long,short},tree{long,short},author{name,email,date},committer{name,email,date},subject,body,hash,message,committerDate}], nextRelease{type,version,gitHead,gitTag,notes,channel}, releases[{name?,url?,type,gitHead,version,gitTag,notes,pluginName,channel}]
Plugin lifecycles: verifyConditions, analyzeCommits, verifyRelease, generateNotes, addChannel, prepare, publish, success, fail
Lifecycle signature: async(elConfig:Object, context:Object)
Context keys: common(cwd,env,envCi,options,branches,commit,branch,main), analyzeCommits adds commits,lastRelease; verifyRelease adds nextRelease; prepare adds assets; publish adds releases; success adds releases; fail adds errors
Logger: context.logger.log/warn/success/error
Configuration: .releaserc.js with branches, repositoryUrl, extends, plugins[], githubUrl, githubApiPathPrefix
CI: NPM_TOKEN, GH_TOKEN environment variables; run semantic-release after tests
Troubleshoot: npm dist-tags ls, semantic-release --dry-run|--no-ci

## Sanitised Extract
Table of Contents:
1. API Signature
2. Core Options
3. Execution Config
4. Result Structure
5. Plugin Lifecycle Methods
6. Context Object Keys
7. Environment Variables
8. Logger Usage

1. API Signature
semanticRelease(options:Object, config:Object) => Promise<Boolean|ResultObject>

2. Core Options
branches: Array<String|{name:String,prerelease:Boolean}>
repositoryUrl: String
extends: String|Array<String>
githubUrl: String
githubApiPathPrefix: String

3. Execution Config
cwd: String (default process.cwd())
env: Object (default process.env)
stdout: WritableStream (default process.stdout)
stderr: WritableStream (default process.stderr)

4. Result Structure
lastRelease: { version:String, gitHead:String, gitTag:String, channel:String }
commits: Array<{ commit:{long:String,short:String}, tree:{long:String,short:String}, author:{name:String,email:String,date:String}, committer:{name:String,email:String,date:String}, subject:String, body:String, hash:String, message:String, committerDate:String }>
nextRelease: { type:String, version:String, gitHead:String, gitTag:String, notes:String, channel:String }
releases: Array<{ name?:String, url?:String, type:String, gitHead:String, version:String, gitTag:String, notes:String, pluginName:String, channel:String }>

5. Plugin Lifecycle Methods
verifyConditions(pluginConfig:Object, context:Object) => Promise<void>
analyzeCommits(pluginConfig:Object, context:Object) => Promise<String|void>
verifyRelease(pluginConfig:Object, context:Object) => Promise<void>
generateNotes(pluginConfig:Object, context:Object) => Promise<String>
addChannel(pluginConfig:Object, context:Object) => Promise<void>
prepare(pluginConfig:Object, context:Object) => Promise<Array<{path:String, data:String}>>
publish(pluginConfig:Object, context:Object) => Promise<Array<{name:String, url:String}>>
success(pluginConfig:Object, context:Object) => Promise<void>
fail(pluginConfig:Object, context:Object) => Promise<void>

6. Context Object Keys
cwd: String, env: Object, envCi: Object, options: Object, branches: Array, commit: String, branch: String, main: Boolean
Additional by lifecycle: commits, lastRelease, nextRelease, releases, errors

7. Environment Variables
context.env holds all process.env variables for plugin logic

8. Logger Usage
context.logger.log(message)
context.logger.warn(message)
context.logger.success(message)
context.logger.error(message)

## Original Source
Semantic-release Automated Publishing
https://semantic-release.gitbook.io/semantic-release/

## Digest of SEMANTIC_RELEASE

# Semantic-release Automated Publishing

Date Retrieved: 2024-06-18
Data Size: 32771 bytes

# API Signature

```js
const semanticRelease = require("semantic-release");
const { WritableStreamBuffer } = require("stream-buffers");

// Usage example
const result = await semanticRelease(options, config);
```

# Core Options (options)

- branches: Array<String|{name:String,prerelease:Boolean}>
  Default: ["+([0-9])?(.{+([0-9]),x}).x","master","main","next","next-major",{name:"beta",prerelease:true},{name:"alpha",prerelease:true}]
- repositoryUrl: String
- extends: String|Array<String>
- githubUrl: String
- githubApiPathPrefix: String

# Execution Configuration (config)

- cwd: String  Default: process.cwd()
- env: Object  Default: process.env
- stdout: WritableStream  Default: process.stdout
- stderr: WritableStream  Default: process.stderr

# Result Object Structure

- lastRelease: { version:String, gitHead:String, gitTag:String, channel:String }
- commits: Array<{
    commit:{ long:String, short:String },
    tree:{ long:String, short:String },
    author:{ name:String, email:String, date:String },
    committer:{ name:String, email:String, date:String },
    subject:String,
    body:String,
    hash:String,
    message:String,
    committerDate:String
  }>
- nextRelease: { type:String, version:String, gitHead:String, gitTag:String, notes:String, channel:String }
- releases: Array<{
    name?:String,
    url?:String,
    type:String,
    gitHead:String,
    version:String,
    gitTag:String,
    notes:String,
    pluginName:String,
    channel:String
  }>

# Plugin Development Lifecycle

Lifecycles (in execution order):
verifyConditions, analyzeCommits, verifyRelease, generateNotes, addChannel, prepare, publish, success, fail

Each method signature:
async function lifecycleName(pluginConfig:Object, context:Object) => Promise<void>

# Context Object Keys by Lifecycle

- Common (all): cwd, env, envCi, options, branches, commit, branch, main
- analyzeCommits: adds commits:Array, lastRelease:Object
- verifyRelease: adds nextRelease:Object
- addChannel: same as verifyRelease
- prepare: same as verifyRelease
- publish: adds releases:Array
- success/fail: success has releases:Array, fail has errors:Array

# Environment Variables

- context.env: process.env mapping
- Example: if (context.env.GITHUB_TOKEN) { /*...*/ }

# Logger

Use context.logger:
- logger.log(message:String)
- logger.warn(message:String)
- logger.success(message:String)
- logger.error(message:String)

# Troubleshooting Commands

- npm dist-tags ls <package-name>
- npx semantic-release --dry-run
- npx semantic-release --no-ci


## Attribution
- Source: Semantic-release Automated Publishing
- URL: https://semantic-release.gitbook.io/semantic-release/
- License: MIT
- Crawl Date: 2025-05-11T00:43:00.789Z
- Data Size: 32771 bytes
- Links Found: 1456

## Retrieved
2025-05-11
sandbox/library/MINIMIST.md
# sandbox/library/MINIMIST.md
# MINIMIST

## Crawl Summary
Minimist@2.0.1: Zero-dependency Node.js CLI argument parser. Installation via npm. Single function minimist(args, opts) returns object with '_', parsed flags based on opts: string, boolean, alias, default, unknown. Supports negation (--no-flag), repeated flags accumulate arrays. Configuration options: string[], boolean[], alias mapping, default values, unknown callback.

## Normalised Extract
Table of Contents
1. Installation
2. Core Function
3. Options Schema
4. Parsing Behavior
5. Use Cases

1. Installation
  npm install minimist@2.0.1 --save

2. Core Function
  minimist(args: string[], opts?: Opts): ParsedArgs

3. Options Schema
  Opts:
    string?: string[]
    boolean?: string[]
    alias?: Record<string,string[]>
    default?: Record<string,any>
    unknown?: (arg:string)=>boolean

4. Parsing Behavior
  - Strings: cast values to String when key in string[]
  - Booleans: cast values to Boolean when key in boolean[] or default boolean type
  - Alias: keys in alias map propagate values
  - Defaults: missing keys set to default
  - Negation: --no-key sets key to false
  - Arrays: repeated flags collect into array

5. Use Cases
  - Positional args in _ array
  - Named flags -> direct properties
  - Combined short flags expand
  - Unknown filter via callback


## Supplementary Details
Parameter Values and Defaults:
  string: []
  boolean: []
  alias: {}
  default: {}
  unknown: undefined
Implementation Steps:
  1. Call minimist with process.argv.slice(2) and opts
  2. Internally split args at '=' into key/value
  3. Apply type coercion per opts
  4. Handle negation prefix 'no-'
  5. Accumulate repeated flags
  6. Return object with parsed results


## Reference Details
Function Signature:
  function minimist(args: string[], opts?: {
    string?: string[];
    boolean?: string[];
    alias?: {[key:string]:string[]};
    default?: {[key:string]:any};
    unknown?: (arg:string)=>boolean;
  }): {
    _: string[];
    [key:string]: any;
  }

Full Example:
  const minimist = require('minimist')
  const opts = { alias:{f:['file']}, default:{verbose:false}, boolean:['verbose'] }
  const argv = minimist(process.argv.slice(2), opts)
  // Usage: node index.js -f config.json --verbose

Best Practices:
  - Declare boolean flags in boolean[] to prevent mis-parsing
  - Use alias arrays for shorthand
  - Provide default values to document expected options

Troubleshooting:
  Issue: Value starting with '-' parsed as flag
  Fix: Prefix positional args after '--'
    e.g. node app.js -- -value

  Issue: Unknown flags accepted
  Fix: Provide unknown callback to filter or reject invalid options
    unknown: (arg)=>{ throw Error('Unknown option ' + arg) }


## Information Dense Extract
minimist(args:string[],opts?:{string?:string[];boolean?:string[];alias?:Record<string,string[]>;default?:Record<string,any>;unknown?:(arg:string)=>boolean;}):{_:string[];[key:string]:any} install@2.0.1 npm i minimist parse rules: string->String, boolean->Boolean, alias propagates, default fills, --no-key = false, repeat->array, unknown callback filter. Best: list flags in boolean, set defaults, use alias, handle negation, prefix positional with --.

## Sanitised Extract
Table of Contents
1. Installation
2. Core Function
3. Options Schema
4. Parsing Behavior
5. Use Cases

1. Installation
  npm install minimist@2.0.1 --save

2. Core Function
  minimist(args: string[], opts?: Opts): ParsedArgs

3. Options Schema
  Opts:
    string?: string[]
    boolean?: string[]
    alias?: Record<string,string[]>
    default?: Record<string,any>
    unknown?: (arg:string)=>boolean

4. Parsing Behavior
  - Strings: cast values to String when key in string[]
  - Booleans: cast values to Boolean when key in boolean[] or default boolean type
  - Alias: keys in alias map propagate values
  - Defaults: missing keys set to default
  - Negation: --no-key sets key to false
  - Arrays: repeated flags collect into array

5. Use Cases
  - Positional args in _ array
  - Named flags -> direct properties
  - Combined short flags expand
  - Unknown filter via callback

## Original Source
minimist Argument Parser
https://github.com/substack/minimist

## Digest of MINIMIST

# MINIMIST 2.0.1 Documentation (Retrieved 2023-10-12)

## 1. Overview

Minimist is a zero-dependency argument parser for Node.js. It converts an array of strings into an object with key/value pairs.

## 2. Installation

```bash
npm install minimist@2.0.1 --save
```

## 3. Usage

```js
const minimist = require('minimist')

const argv = minimist(process.argv.slice(2), {
  string: ['name'],
  boolean: ['help', 'verbose'],
  alias: { h: 'help', v: 'verbose' },
  default: { verbose: false }
})

// argv: { _: [], name: 'Alice', help: false, verbose: false }
```

## 4. API Reference

### minimist(args: string[], opts?: Opts): ParsedArgs

Opts:
  string?: string[]                 Properties to always cast to String
  boolean?: string[]                Properties to always cast to Boolean
  alias?: { [key: string]: string[] }  Alias mapping
  default?: { [key: string]: any }     Default values
  unknown?: (arg: string) => boolean   Callback for unknown args

ParsedArgs:
  _: string[]       Non-option arguments
  [key: string]: any

## 5. Configuration Options

- string: Force parse arguments as strings.
- boolean: Force parse arguments as booleans.
- alias: Create aliases for options.
- default: Set default values.
- unknown: Filter unknown arguments.

## 6. Examples

1. Positional and Named Arguments
```bash
node app.js input.txt --name=Bob -v
``` 
```js
// argv: { _: ['input.txt'], name: 'Bob', v: true }
```

2. Negated Booleans
```bash
node app.js --no-verbose
```
```js
// argv: { _: [], verbose: false }
```

## 7. Edge Cases

- Values beginning with `-` are parsed as options unless preceded by `--`.
- Repeated flags accumulate in arrays.

## 8. Troubleshooting

### Unexpected Option Parsing
Command: `node app.js -abc`
Expected: `a: true, b: true, c: true`
If combined flags not split, ensure boolean array includes all single-letter flags.




## Attribution
- Source: minimist Argument Parser
- URL: https://github.com/substack/minimist
- License: MIT
- Crawl Date: 2025-05-11T00:40:18.990Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-11
