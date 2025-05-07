sandbox/library/GITHUB_REST_API.md
# sandbox/library/GITHUB_REST_API.md
# GITHUB_REST_API

## Crawl Summary
GitHub REST API uses date-based versioning via X-GitHub-Api-Version header with default and supported version 2022-11-28. Authenticate using PAT in Authorization header, GitHub CLI login, or GitHub App installation tokens. CLI usage: gh api path with --method flag. Octokit.js: instantiate with auth token, use request(method path, params). curl: set Accept header, Authorization Bearer. Pagination via per_page and Link header; default 30, max 100. Rate limits: 5000/h auth, 60/h unauth. Include conditional requests using ETag and handle HTTP status codes: 400,401,403,404.

## Normalised Extract
Table of Contents
1 Authentication
2 API Versioning
3 GitHub CLI
4 Octokit.js SDK
5 curl Requests
6 Pagination
7 Rate Limits
8 Best Practices
9 Troubleshooting Procedures

1 Authentication
• Personal Access Token
  Header: Authorization: Bearer <TOKEN> or Authorization: token <TOKEN>
  Scopes: repo, workflow, admin:org, etc. per endpoint
• GitHub CLI
  Command: gh auth login
  Modes: github.com or custom GHE hostname
• GitHub App
  Step 1: Store APP_ID in vars
  Step 2: Store RSA private key in secret (-----BEGIN RSA PRIVATE KEY----- ...)
  Step 3: Generate token in workflow using actions/create-github-app-token@v1
  Step 4: Use GH_TOKEN from generate-token outputs

2 API Versioning
• Header: X-GitHub-Api-Version: YYYY-MM-DD
• Default: 2022-11-28
• Supported: 2022-11-28
• Error: 400 if unsupported version
• Upgrade: set new header, adjust integration per breaking changes

3 GitHub CLI
• Install gh on macOS/Windows/Linux
• Authenticate: gh auth login
• API calls: gh api <path> --method <GET|POST|PATCH|DELETE>
• Example: gh api /repos/octocat/Spoon-Knife/issues --method GET

4 Octokit.js SDK
• Install: npm install octokit
• Import: import { Octokit } from "octokit"
• Constructor signature:
    new Octokit({ auth: string, userAgent?: string, baseUrl?: string, request?: { timeout?: number } })
• Request method signature:
    octokit.request(methodAndPath: string, params: object): Promise<{ data: any, status: number, headers: object }>
• Example:
    const octokit = new Octokit({ auth: process.env.TOKEN })
    await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" })

5 curl Requests
• Header: Accept: application/vnd.github+json
• Header: Authorization: Bearer <TOKEN>
• Request format:
    curl --request <METHOD> \
      --url "https://api.github.com/repos/{owner}/{repo}/issues" \
      --header "Accept: application/vnd.github+json" \
      --header "Authorization: Bearer <TOKEN>"

6 Pagination
• Query params: per_page (default 30, max 100), page (default 1)
• Response header: Link: <...&page=2>; rel="next", <...&page=N>; rel="last"
• To iterate: parse Link header, follow next until absent

7 Rate Limits
• Endpoint: GET /rate_limit
• Authenticated: 5000 per hour
• Unauthenticated: 60 per hour
• Response JSON: resources.core.remaining, resets_at

8 Best Practices
• Always set X-GitHub-Api-Version
• Use conditional GET with If-None-Match: <ETag>
• Check rate limits before bulk requests
• Use appropriate Accept media type for preview features

9 Troubleshooting Procedures
• Inspect HTTP status codes:
    400: invalid parameters
    401: missing/invalid auth
    403: rate limit or insufficient scopes
    404: wrong endpoint or missing permissions
• Debug CLI: gh api --verbose
• Debug Octokit: set log: { debug: console.debug }
• Curl output: add --verbose and check response headers and body

## Supplementary Details
Authentication Scopes
- repo: Full control of private repositories
- workflow: Update GitHub Actions workflows
- admin:org: Full control of org settings
- notifications: Read user notifications

Rate Limit Details
- core: 5000/hour
- search: 30/hour
- graphql: 5000/minute
- integration manifest: 1000/hour
Reset header: X-RateLimit-Reset (UNIX timestamp)

Pagination Defaults
- per_page default: 30
- per_page max: 100
- page default: 1

Media Types
- application/vnd.github+json: stable API
- application/vnd.github.machine-man-preview+json: GitHub App preview

Conditional Requests
- Send header If-None-Match: <ETag> obtained from previous response
- 304 status on unmodified

Error Response Schema
{
  message: string,
  documentation_url: string
}

Environment Variables
- GITHUB_TOKEN: automatically provided in Actions
- GH_TOKEN: user-provided PAT
- APP_ID: GitHub App ID
- APP_PEM: GitHub App private key


## Reference Details
1 Constructor Signatures
Octokit(options: {
  auth: string
  userAgent?: string
  baseUrl?: string
  request?: { timeout?: number }
}): OctokitInstance

Methods
- request(methodAndPath: "METHOD /path/{param}", params: object): Promise<{ data: any; status: number; headers: object }>
- paginate(requestMethod: Function, params: object): AsyncIterableIterator<any>
- rest.issues.createComment(params: { owner: string; repo: string; issue_number: number; body: string }): Promise<{ data: IssueComment }>

2 GitHub CLI Commands
- gh auth login [--hostname <hostname>]
- gh api <endpoint> [--method <METHOD>] [--header <header>] [--input <file>]
- gh api graphql -f query='<query>'

3 curl Commands
- curl --request GET --url "https://api.github.com/repos/{owner}/{repo}/issues" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer <TOKEN>"
- curl --request POST --url "https://api.github.com/repos/{owner}/{repo}/issues" --header "Authorization: token <TOKEN>" --data '{"title":"New issue","body":"Issue body"}'

4 Implementation Patterns
- Conditional update:
  1. GET resource with If-None-Match: <ETag>
  2. If 200: process data, modify payload
  3. PATCH resource with If-Match: <ETag>

- Bulk pagination:
  async function getAllIssues(octokit, owner, repo) {
    const iterator = octokit.paginate.iterator("GET /repos/{owner}/{repo}/issues", { owner, repo, per_page:100 })
    for await (const { data } of iterator) {
      data.forEach(issue => process(issue))
    }
  }

5 Configuration Options
- X-GitHub-Api-Version: specify date string
- Accept: media type string
- per_page, page in query

6 Troubleshooting Commands
- gh api --verbose /rate_limit
- curl --verbose --header "Authorization: Bearer <TOKEN>" https://api.github.com/rate_limit
- NODE_DEBUG=octokit node script.js


## Information Dense Extract
version:X-GitHub-Api-Version=2022-11-28;auth:Bearer<TOKEN>;rate_limit:5000/h core,60/h unauth;pagination:per_page<=100,page>=1,Link header;octokit: new Octokit({auth}), request("METHOD /path/{params}",params);ghCLI: gh api <path> --method METHOD;curl: curl -XMETHOD URL -HAccept:application/vnd.github+json -HAuthorization:Bearer<TOKEN>;scopes:repo,workflow,admin:org;conditional:If-None-Match/If-Match with ETag;errors:400,401,403,404;debug:gh api --verbose,NODE_DEBUG=octokit

## Sanitised Extract
Table of Contents
1 Authentication
2 API Versioning
3 GitHub CLI
4 Octokit.js SDK
5 curl Requests
6 Pagination
7 Rate Limits
8 Best Practices
9 Troubleshooting Procedures

1 Authentication
 Personal Access Token
  Header: Authorization: Bearer <TOKEN> or Authorization: token <TOKEN>
  Scopes: repo, workflow, admin:org, etc. per endpoint
 GitHub CLI
  Command: gh auth login
  Modes: github.com or custom GHE hostname
 GitHub App
  Step 1: Store APP_ID in vars
  Step 2: Store RSA private key in secret (-----BEGIN RSA PRIVATE KEY----- ...)
  Step 3: Generate token in workflow using actions/create-github-app-token@v1
  Step 4: Use GH_TOKEN from generate-token outputs

2 API Versioning
 Header: X-GitHub-Api-Version: YYYY-MM-DD
 Default: 2022-11-28
 Supported: 2022-11-28
 Error: 400 if unsupported version
 Upgrade: set new header, adjust integration per breaking changes

3 GitHub CLI
 Install gh on macOS/Windows/Linux
 Authenticate: gh auth login
 API calls: gh api <path> --method <GET|POST|PATCH|DELETE>
 Example: gh api /repos/octocat/Spoon-Knife/issues --method GET

4 Octokit.js SDK
 Install: npm install octokit
 Import: import { Octokit } from 'octokit'
 Constructor signature:
    new Octokit({ auth: string, userAgent?: string, baseUrl?: string, request?: { timeout?: number } })
 Request method signature:
    octokit.request(methodAndPath: string, params: object): Promise<{ data: any, status: number, headers: object }>
 Example:
    const octokit = new Octokit({ auth: process.env.TOKEN })
    await octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' })

5 curl Requests
 Header: Accept: application/vnd.github+json
 Header: Authorization: Bearer <TOKEN>
 Request format:
    curl --request <METHOD> '
      --url 'https://api.github.com/repos/{owner}/{repo}/issues' '
      --header 'Accept: application/vnd.github+json' '
      --header 'Authorization: Bearer <TOKEN>'

6 Pagination
 Query params: per_page (default 30, max 100), page (default 1)
 Response header: Link: <...&page=2>; rel='next', <...&page=N>; rel='last'
 To iterate: parse Link header, follow next until absent

7 Rate Limits
 Endpoint: GET /rate_limit
 Authenticated: 5000 per hour
 Unauthenticated: 60 per hour
 Response JSON: resources.core.remaining, resets_at

8 Best Practices
 Always set X-GitHub-Api-Version
 Use conditional GET with If-None-Match: <ETag>
 Check rate limits before bulk requests
 Use appropriate Accept media type for preview features

9 Troubleshooting Procedures
 Inspect HTTP status codes:
    400: invalid parameters
    401: missing/invalid auth
    403: rate limit or insufficient scopes
    404: wrong endpoint or missing permissions
 Debug CLI: gh api --verbose
 Debug Octokit: set log: { debug: console.debug }
 Curl output: add --verbose and check response headers and body

## Original Source
GitHub REST API
https://docs.github.com/en/rest

## Digest of GITHUB_REST_API

# Overview

## API Versioning
- Header: `X-GitHub-Api-Version: YYYY-MM-DD`
- Default version: 2022-11-28
- Supported versions: 2022-11-28
- Breaking changes every version; see changelog

## Authentication
- Personal Access Token: pass in header `Authorization: Bearer <TOKEN>` or `Authorization: token <TOKEN>`
- GitHub CLI: `gh auth login`
- GitHub App: generate installation token via `actions/create-github-app-token@v1`

## GitHub CLI Usage
- Command: `gh api <path> [--method <METHOD>] [--input <file>]`
- Example: `gh api /repos/{owner}/{repo}/issues --method GET`

## Octokit.js Usage
- Install: `npm install octokit`
- Import: `import { Octokit } from "octokit"`
- Init: `const octokit = new Octokit({ auth: 'YOUR-TOKEN' })`
- Request: `await octokit.request("GET /repos/{owner}/{repo}/issues", { owner, repo })`

## curl Usage
- Request: 
  curl --request GET \
    --url "https://api.github.com/repos/{owner}/{repo}/issues" \
    --header "Accept: application/vnd.github+json" \
    --header "Authorization: Bearer <TOKEN>"

## Pagination
- Use `per_page` and `page` parameters
- Default `per_page`: 30, max: 100
- Check `Link` header for `rel=next`

## Rate Limits
- Authenticated: 5000 requests per hour
- Unauthenticated: 60 requests per hour
- Check endpoint: GET /rate_limit

## Best Practices
- Specify version header
- Use conditional requests with `If-None-Match` and ETag
- Handle 403 rate-limit responses

## Troubleshooting
- HTTP 400: bad request
- HTTP 401: authentication error
- HTTP 403: rate limit exceeded
- HTTP 404: not found
- Inspect response.headers and response.data.message

## Attribution
- Source: GitHub REST API
- URL: https://docs.github.com/en/rest
- License: License
- Crawl Date: 2025-05-06T06:30:17.830Z
- Data Size: 426618 bytes
- Links Found: 7685

## Retrieved
2025-05-06
sandbox/library/VITEST_GUIDE.md
# sandbox/library/VITEST_GUIDE.md
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
sandbox/library/ESLINT_USING.md
# sandbox/library/ESLINT_USING.md
# ESLINT_USING

## Crawl Summary
Installation commands, configuration file formats (JSON, YAML, JS, package.json), essential CLI options (--config, --env, --ext, --fix, --format, --quiet, --ignore-pattern), Node.js API usage patterns (ESLint class constructor options, lintFiles, outputFixes, loadFormatter, format output), formatter list, plugin resolution method, .eslintignore usage.

## Normalised Extract
Table of Contents
1 Installation
2 Initialization
3 Configuration File Structure
4 CLI Usage
5 Node.js API

1 Installation
* npm install eslint --save-dev
* npx eslint --init for interactive setup

2 Initialization
* Generates .eslintrc.* based on prompts
* Supports popular style guides (Airbnb, Standard)

3 Configuration File Structure
Files supported:
  .eslintrc.json
  .eslintrc.yaml
  .eslintrc.js / .eslintrc.cjs
  package.json  { "eslintConfig": {...} }
Fields:
  env            object of { [envName]: boolean }
  parserOptions  object { ecmaVersion: number|string, sourceType: "script"|"module", ecmaFeatures: { jsx: boolean } }
  extends        array of string (shareable configs or "eslint:recommended")
  plugins        array of string (plugin names without "eslint-plugin-" prefix)
  rules          object { [ruleId]: "off"|"warn"|"error" or [level, options] }
  overrideConfigFile path string to load config from custom path

4 CLI Usage
Syntax: eslint [options] [file|dir|glob ...]
Options:
  --config <path>
  --env <env1,env2>
  --ext <.js,.jsx,.ts>
  --fix (boolean)
  --format <formatterName|path>
  --quiet (boolean)
  --ignore-pattern <pattern>
Examples:
  eslint "src/**/*.{js,jsx}" --fix --ext .js,.jsx --config .eslintrc.json

5 Node.js API
Import:
  const { ESLint } = require("eslint");
Constructor options:
  cwd            string (working directory, default process.cwd())
  fix            boolean (apply fixes)
  overrideConfigFile string (path to config)
Methods:
  lintFiles(patterns: string|string[]): Promise<ESLint.LintResult[]>
  lintText(text: string, options?: { filePath?: string }): Promise<ESLint.LintResult[]>
  loadFormatter(nameOrPath: string): Promise<Formatter>
  outputFixes(results: ESLint.LintResult[]): Promise<void>
Formatter:
  format(results: ESLint.LintResult[]): string


## Supplementary Details
Configuration defaults:
env: {} (no globals defined)
parserOptions.ecmaVersion: 5
parserOptions.sourceType: "script"
extends: []
plugins: []
rules: {}
ignorePatterns: ["node_modules/*"]

Initialization steps:
1. npx eslint --init
2. Answer prompts: type of module, framework, TypeScript, running in browser/node, style guide
3. ESLint installs dependencies, generates chosen config

Plugin installation:
npm install eslint-plugin-<pluginName> --save-dev

Formatter usage:
eslint --format json --output-file report.json

. eslintignore globs follow .gitignore syntax, matched against current working directory paths


## Reference Details
CLI Options
--config <path>                    Load configuration file from path (string)
--env <env1,env2>                  Define environments: browser, node, es6, mocha, jest, etc.
--ext <.js,.jsx,.ts>               Specify file extensions (default .js)
--fix                              Apply automatic fixes for problems
--fix-dry-run                      Show potential fixes without writing to files
--fix-type <problemTypes>         Limit fixes to problem types: problem, suggestion, layout
--format <formatterName|path>      Use a specific formatter: stylish (default), compact, json, table, unix, visualstudio, html, jslint-xml, checkstyle, tap
--output-file <filePath>           Write report to file instead of stdout
--quiet                            Report errors only, ignore warnings
--ignore-path <path>               Custom ignore file path (default .eslintignore)
--ignore-pattern <pattern>         Pattern of files to ignore
--report-unused-disable-directives  Report unused eslint-disable comments
--max-warnings <number>            Number of warnings to trigger nonzero exit code

Exit codes: 0 if no linting errors, 1 if linting errors or config errors, 2 if execution error

Node.js API
class ESLint(options?: {
  cwd?: string;
  overrideConfigFile?: string;
  envs?: string[];
  extensions?: string[];
  cache?: boolean;
  cacheLocation?: string;
  fix?: boolean;
  fixTypes?: ("problem"|"suggestion"|"layout")[];
  allowInlineConfig?: boolean;
  ignore?: boolean;
  ignorePath?: string;
  ignorePattern?: string|string[];
  cwd? : string;
})

Methods
lintFiles(patterns: string|string[]): Promise<LintResult[]>
lintText(text: string, options?: { filePath?: string }): Promise<LintResult[]>
loadFormatter(nameOrPath: string): Promise<{ format(results: LintResult[]): string }>
outputFixes(results: LintResult[]): Promise<void>

Interfaces
interface LintResult {
  filePath: string;
  messages: LintMessage[];
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  output?: string;
}
interface LintMessage {
  ruleId: string | null;
  severity: 1|2;
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  fix?: { range: [number, number]; text: string };
}

Code Example
const { ESLint } = require("eslint");
(async () => {
  const eslint = new ESLint({ fix: true, overrideConfigFile: ".eslintrc.js" });
  const results = await eslint.lintFiles(["src/**/*.js"]);
  await ESLint.outputFixes(results);
  const formatter = await eslint.loadFormatter("html");
  const html = formatter.format(results);
  require("fs").writeFileSync("report.html", html);
})();

Troubleshooting
1. Invalid config file path error:
Command: eslint --config nonexistent.json src/
Expected: exit code 1, message "No ESLint configuration found"
Solution: Verify path and filename, use correct extension

2. Parsing error for unsupported syntax:
Error: Parsing error: Unexpected token
Solution: Update parserOptions.ecmaVersion to 2021 or later, install @babel/eslint-parser or @typescript-eslint/parser and configure parser field in config

3. Plugin not found:
Error: Failed to load plugin 'react'
Solution: npm install eslint-plugin-react --save-dev, ensure "react" appears in "plugins"

4. Formatter output not applied:
Using --format html but output printed to stdout
Solution: Add --output-file report.html flag


## Information Dense Extract
install:npm i eslint --save-dev;npx eslint --init
config files:.eslintrc.json/.yaml/.js/.cjs/package.json{eslintConfig}
config fields:env{browser,node,es6},parserOptions{ecmaVersion:2021,sourceType:module,ecmaFeatures.jsx},extends[],plugins[],rules{ruleId:[level,options]}
CLI:eslint [files] --config path --env list --ext .js,.jsx --fix --fix-dry-run --fix-type problem,suggestion,layout --format stylish|json|html --output-file file --quiet --ignore-path path --ignore-pattern pattern
NodeAPI:new ESLint({cwd,overrideConfigFile,extensions,fix,cache,ignorePath,ignorePattern})
methods:lintFiles(string|string[]):Promise<LintResult[]>;lintText(text:string,options?);loadFormatter(name:string):Promise<{format(results):string}>;outputFixes(results):Promise<void>
LintResult:{filePath,messages,errorCount,warningCount,fixableErrorCount,fixableWarningCount,output?}
LintMessage:{ruleId,severity,message,line,column,endLine?,endColumn?,fix?}
example: see code above
defaults:ecmaVersion:5,sourceType:script,ignorePattern:node_modules/*
troubleshoot:invalid config path,parsing errors,plugin load errors,formatter output issues

## Sanitised Extract
Table of Contents
1 Installation
2 Initialization
3 Configuration File Structure
4 CLI Usage
5 Node.js API

1 Installation
* npm install eslint --save-dev
* npx eslint --init for interactive setup

2 Initialization
* Generates .eslintrc.* based on prompts
* Supports popular style guides (Airbnb, Standard)

3 Configuration File Structure
Files supported:
  .eslintrc.json
  .eslintrc.yaml
  .eslintrc.js / .eslintrc.cjs
  package.json  { 'eslintConfig': {...} }
Fields:
  env            object of { [envName]: boolean }
  parserOptions  object { ecmaVersion: number|string, sourceType: 'script'|'module', ecmaFeatures: { jsx: boolean } }
  extends        array of string (shareable configs or 'eslint:recommended')
  plugins        array of string (plugin names without 'eslint-plugin-' prefix)
  rules          object { [ruleId]: 'off'|'warn'|'error' or [level, options] }
  overrideConfigFile path string to load config from custom path

4 CLI Usage
Syntax: eslint [options] [file|dir|glob ...]
Options:
  --config <path>
  --env <env1,env2>
  --ext <.js,.jsx,.ts>
  --fix (boolean)
  --format <formatterName|path>
  --quiet (boolean)
  --ignore-pattern <pattern>
Examples:
  eslint 'src/**/*.{js,jsx}' --fix --ext .js,.jsx --config .eslintrc.json

5 Node.js API
Import:
  const { ESLint } = require('eslint');
Constructor options:
  cwd            string (working directory, default process.cwd())
  fix            boolean (apply fixes)
  overrideConfigFile string (path to config)
Methods:
  lintFiles(patterns: string|string[]): Promise<ESLint.LintResult[]>
  lintText(text: string, options?: { filePath?: string }): Promise<ESLint.LintResult[]>
  loadFormatter(nameOrPath: string): Promise<Formatter>
  outputFixes(results: ESLint.LintResult[]): Promise<void>
Formatter:
  format(results: ESLint.LintResult[]): string

## Original Source
ESLint Official Documentation
https://eslint.org/docs/latest/

## Digest of ESLINT_USING

# Installation

Run in your project root:

```
npm install eslint --save-dev
npx eslint --init  # interactive configuration
```

# Configuration

Create one of these files at project root:

.eslintrc.json
.eslintrc.yaml
.eslintrc.js
.eslintrc.cjs
package.json  { "eslintConfig": { ... } }

Example .eslintrc.json:

```
{
  "env": { "browser": true, "node": true, "es6": true },
  "parserOptions": { "ecmaVersion": 2021, "sourceType": "module" },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "plugins": ["react"],
  "rules": { "no-console": "warn", "eqeqeq": ["error", "always"] }
}
```

# CLI Usage

Command syntax:

```
eslint [options] [file|dir|glob ...]
```

Key options:

--config path       Path to config file
--env list          Environments to define globals (comma-separated)
--ext list          File extensions to lint (comma-separated, default .js)
--fix               Automatically fix problems
--format name|path  Formatter to use (stylish, json, html, etc.)
--quiet             Report errors only
--ignore-pattern p  Pattern of files to ignore

Examples:

```
eslint "src/**/*.{js,jsx}" --fix --ext .js,.jsx --config .eslintrc.json
```

# Node.js API

Import and use ESLint class:

```
const { ESLint } = require("eslint");
async function run() {
  const eslint = new ESLint({
    cwd: process.cwd(),
    fix: true,
    overrideConfigFile: ".eslintrc.json"
  });
  const results = await eslint.lintFiles(["src/**/*.js"]);
  await ESLint.outputFixes(results);
  const formatter = await eslint.loadFormatter("stylish");
  const output = formatter.format(results);
  console.log(output);
}
run();
```

# Formatter Configuration

Formatters shipped:

stylish (default), compact, json, html, unix

Custom formatters: path to JS module exporting a function with signature function(results)

# Plugin Resolution

Plugins must be installed via npm: `npm install eslint-plugin-<name> --save-dev`. In config:

```
"plugins": ["<name>"],
"extends": ["plugin:<name>/recommended"]
```

# .eslintignore

Use .eslintignore at project root with glob patterns to exclude files/directories

Example:

```
node_modules/
build/
coverage/
```


## Attribution
- Source: ESLint Official Documentation
- URL: https://eslint.org/docs/latest/
- License: License
- Crawl Date: 2025-05-06T18:30:14.170Z
- Data Size: 1550767 bytes
- Links Found: 4643

## Retrieved
2025-05-06
sandbox/library/MINIMATCH.md
# sandbox/library/MINIMATCH.md
# MINIMATCH

## Crawl Summary
Direct API: minimatch(), filter(), match(), makeRe(), escape(), unescape(); Class Minimatch with constructor, properties (pattern, options, set, regexp, flags) and methods (makeRe, match, matchOne, hasMagic); Options list with type and defaults; Windows and UNC path rules; Glob features: brace expansion, extglob, globstar, POSIX classes; Performance optimizationLevel 0,1,2.

## Normalised Extract
Table of Contents
1 Installation & Import
2 Core API Functions
3 Minimatch Class Details
4 Options Reference
5 Windows & UNC Path Rules
6 Glob Features & Syntax
7 Optimization Levels
8 Troubleshooting

1 Installation & Import
npm install minimatch@10.0.1
import { minimatch } from 'minimatch'
or const { minimatch } = require('minimatch')

2 Core API Functions
minimatch(path: string, pattern: string, options?: Options): boolean
minimatch.filter(pattern: string, options?: Options): (path: string)=>boolean
minimatch.match(list: string[], pattern: string, options?: Options): string[]
minimatch.makeRe(pattern: string, options?: Options): RegExp
minimatch.escape(pattern: string, options?: Options): string
minimatch.unescape(pattern: string, options?: Options): string

3 Minimatch Class Details
new Minimatch(pattern: string, options?: Options)
Properties: pattern, options, set:Array<Array<RegExp|string>>, regexp:RegExp|false, negate:boolean, comment:boolean, empty:boolean
Methods: makeRe():RegExp|false, match(fpath:string):boolean, matchOne(fileArr:string[],patternArr:string[],partial?:boolean):boolean, hasMagic():boolean

4 Options Reference
option               type     default  effect
debug                boolean  false    log info to stderr
nobrace              boolean  false    disable {a,b} expansion
noglobstar           boolean  false    disable ** matching
dot                  boolean  false    allow .file matches
noext                boolean  false    disable extglob patterns
nocase               boolean  false    case-insensitive matching
nocaseMagicOnly      boolean  false    regex case-ignore on regex parts only
nonull               boolean  false    return [pattern] when no match
matchBase            boolean  false    match basename for patterns without /
magicalBraces        boolean  false    treat braces as magic in hasMagic
nonegate             boolean  false    disable ! negation
nocomment            boolean  false    disable leading # comments
flipNegate           boolean  false    invert negate result
partial              boolean  false    allow prefix matching in directory walks
windowsPathsNoEscape boolean  false    keep backslash as path separator only
windowsNoMagicRoot   boolean  true     preserve root-case regex(Windows/nocase)
preserveMultipleSlashes boolean false compress // to /
optimizationLevel    number   1       pattern preprocessing level
platform             string   process.platform override as 'win32'

5 Windows & UNC Path Rules
Pattern path separators: /
Backslash in pattern escapes next char unless windowsPathsNoEscape true
UNC: //?/c:/path and //host/share; preserve // at start; treat ? literally in //?/

6 Glob Features & Syntax
Brace Expansion: {a,b}, {1..3}
Extglob: +(a|b), !(x), ?(y)
Globstar: ** matches zero or more directories when alone in path segment
POSIX classes: [[:alpha:]], [[:digit:]], support Unicode

7 Optimization Levels
0: no changes, . and .. preserved
1: remove safe ../ segments
2: aggressive: collapse multiple **, remove ., dedupe patterns

8 Troubleshooting
Pattern returns no match: verify path slash style, use matchBase:true for basenames
Include dotfiles: set dot:true
Verbose debugging: set debug:true
No matches array: set nonull:true to return [pattern]
Invalid pattern: match returns false, makeRe returns false


## Supplementary Details
Parameter Examples
matchBase:true matches '*.js' to '/path/file.js'
partial:true treats '/a/b' against '/a/*/c' as possible match
windowsPathsNoEscape:true allows using path.join output in pattern
optimizationLevel:2 for large directory globs to improve performance
platform:'win32' to simulate Windows behavior on other OS

Implementation Steps
1. npm install minimatch@10.0.1
2. import directly or via require
3. choose API: direct call or filter, match functions
4. configure options per environment (dot, nocase, matchBase)
5. compile RegExp with makeRe for custom use
6. instantiate Minimatch for repeated matches or tree walking
7. use optimizationLevel 2 for heavy file-walk scenarios
8. apply windowsPathsNoEscape when running on Windows with path.resolve outputs


## Reference Details
API Signatures
minimatch(path: string, pattern: string, options?: Options): boolean
minimatch.filter(pattern: string, options?: Options): (path: string)=>boolean
minimatch.match(list: string[], pattern: string, options?: Options): string[]
minimatch.makeRe(pattern: string, options?: Options): RegExp
minimatch.escape(pattern: string, options?: Options): string
minimatch.unescape(pattern: string, options?: Options): string

Options Interface
interface Options {
  debug?: boolean
  nobrace?: boolean
  noglobstar?: boolean
  dot?: boolean
  noext?: boolean
  nocase?: boolean
  nocaseMagicOnly?: boolean
  nonull?: boolean
  matchBase?: boolean
  magicalBraces?: boolean
  nonegate?: boolean
  nocomment?: boolean
  flipNegate?: boolean
  partial?: boolean
  windowsPathsNoEscape?: boolean
  windowsNoMagicRoot?: boolean
  preserveMultipleSlashes?: boolean
  optimizationLevel?: number
  platform?: string
}

Examples
import { minimatch } from 'minimatch';
const ok = minimatch('bar.foo','*.foo',{debug:true}); // true
const filterJs = minimatch.filter('*.js',{matchBase:true});
const jsList = files.filter(filterJs);
const re = minimatch.makeRe('src/**/*.ts',{dot:true,nocase:true});
if(re.test('src/example.ts')) console.log('match');

const mm = new Minimatch('**/*.md',{dot:true,partial:true});
mm.makeRe();
mm.match('README.md');

Best Practices
- Always use forward-slashes in patterns
- Use dot:true to include dotfiles
- Use matchBase:true for simple filename patterns
- Use optimizationLevel:2 for file-walker utilities
- Use makeRe for RegExp reuse

Troubleshooting Commands
// Debug detailed matching
console.log(minimatch('a/b','a/*',{debug:true}));
// Return pattern on no match
minimatch.match([], 'x/*.js',{nonull:true}); // ['x/*.js']



## Information Dense Extract
minimatch(path: string,pattern: string,options?):boolean; filter(pattern,options?):fn; match(list,pattern,options?):string[]; makeRe(pattern,options?):RegExp; escape(pattern):string; unescape(pattern):string; Class Minimatch(pattern,options){pattern,options,set:Array<Array<RegExp|string>>,regexp:RegExp|false,negate,comment,empty}.methods makeRe(),match(),matchOne(),hasMagic().Options(default false):debug,nobrace,noglobstar,dot,noext,nocase,nocaseMagicOnly,nonull,matchBase,magicalBraces,nonegate,nocomment,flipNegate,partial,windowsPathsNoEscape,windowsNoMagicRoot,preserveMultipleSlashes; optimizationLevel:0|1|2; platform:string. Windows: use /; UNC //?/c:/ preserve root; windowsPathsNoEscape for backslash separators. Glob features: {a,b}, extglob, ** globstar, POSIX classes. Perf: level1 remove ../, level2 aggressive. Troubleshoot: debug:true, nonull:true, matchBase:true.

## Sanitised Extract
Table of Contents
1 Installation & Import
2 Core API Functions
3 Minimatch Class Details
4 Options Reference
5 Windows & UNC Path Rules
6 Glob Features & Syntax
7 Optimization Levels
8 Troubleshooting

1 Installation & Import
npm install minimatch@10.0.1
import { minimatch } from 'minimatch'
or const { minimatch } = require('minimatch')

2 Core API Functions
minimatch(path: string, pattern: string, options?: Options): boolean
minimatch.filter(pattern: string, options?: Options): (path: string)=>boolean
minimatch.match(list: string[], pattern: string, options?: Options): string[]
minimatch.makeRe(pattern: string, options?: Options): RegExp
minimatch.escape(pattern: string, options?: Options): string
minimatch.unescape(pattern: string, options?: Options): string

3 Minimatch Class Details
new Minimatch(pattern: string, options?: Options)
Properties: pattern, options, set:Array<Array<RegExp|string>>, regexp:RegExp|false, negate:boolean, comment:boolean, empty:boolean
Methods: makeRe():RegExp|false, match(fpath:string):boolean, matchOne(fileArr:string[],patternArr:string[],partial?:boolean):boolean, hasMagic():boolean

4 Options Reference
option               type     default  effect
debug                boolean  false    log info to stderr
nobrace              boolean  false    disable {a,b} expansion
noglobstar           boolean  false    disable ** matching
dot                  boolean  false    allow .file matches
noext                boolean  false    disable extglob patterns
nocase               boolean  false    case-insensitive matching
nocaseMagicOnly      boolean  false    regex case-ignore on regex parts only
nonull               boolean  false    return [pattern] when no match
matchBase            boolean  false    match basename for patterns without /
magicalBraces        boolean  false    treat braces as magic in hasMagic
nonegate             boolean  false    disable ! negation
nocomment            boolean  false    disable leading # comments
flipNegate           boolean  false    invert negate result
partial              boolean  false    allow prefix matching in directory walks
windowsPathsNoEscape boolean  false    keep backslash as path separator only
windowsNoMagicRoot   boolean  true     preserve root-case regex(Windows/nocase)
preserveMultipleSlashes boolean false compress // to /
optimizationLevel    number   1       pattern preprocessing level
platform             string   process.platform override as 'win32'

5 Windows & UNC Path Rules
Pattern path separators: /
Backslash in pattern escapes next char unless windowsPathsNoEscape true
UNC: //?/c:/path and //host/share; preserve // at start; treat ? literally in //?/

6 Glob Features & Syntax
Brace Expansion: {a,b}, {1..3}
Extglob: +(a|b), !(x), ?(y)
Globstar: ** matches zero or more directories when alone in path segment
POSIX classes: [[:alpha:]], [[:digit:]], support Unicode

7 Optimization Levels
0: no changes, . and .. preserved
1: remove safe ../ segments
2: aggressive: collapse multiple **, remove ., dedupe patterns

8 Troubleshooting
Pattern returns no match: verify path slash style, use matchBase:true for basenames
Include dotfiles: set dot:true
Verbose debugging: set debug:true
No matches array: set nonull:true to return [pattern]
Invalid pattern: match returns false, makeRe returns false

## Original Source
Minimatch Pattern Matching
https://www.npmjs.com/package/minimatch

## Digest of MINIMATCH

# Minimatch Pattern Matching

Retrieved: 2024-06-20
Data Size: 654687 bytes

# Usage

Install: npm install minimatch@10.0.1

Import:
import { minimatch } from 'minimatch'
const { minimatch } = require('minimatch')

Call:
minimatch(path: string, pattern: string, options?: Options) -> boolean

# Core API Functions

minimatch(path: string, pattern: string, options?: Options): boolean
minimatch.filter(pattern: string, options?: Options): (path: string)=>boolean
minimatch.match(list: string[], pattern: string, options?: Options): string[]
minimatch.makeRe(pattern: string, options?: Options): RegExp
minimatch.escape(pattern: string, options?: Options): string
minimatch.unescape(pattern: string, options?: Options): string

# Minimatch Class

Constructor:
new Minimatch(pattern: string, options?: Options)

Properties:
pattern: string
options: Options
set: Array<Array<RegExp|string>>
regexp: RegExp|false
negate: boolean
comment: boolean
empty: boolean

Methods:
makeRe(): RegExp|false
match(fpath: string): boolean
matchOne(fileArr: string[], patternArr: string[], partial?: boolean): boolean
hasMagic(): boolean

# Configuration Options

All options default to false except optimizationLevel (1) and platform (process.platform).
  debug              boolean
  nobrace            boolean
  noglobstar         boolean
  dot                boolean
  noext              boolean
  nocase             boolean
  nocaseMagicOnly    boolean
  nonull             boolean
  matchBase          boolean
  magicalBraces      boolean
  nonegate           boolean
  nocomment          boolean
  flipNegate         boolean
  partial            boolean
  windowsPathsNoEscape boolean
  windowsNoMagicRoot boolean (win32 default true)
  preserveMultipleSlashes boolean
  optimizationLevel number (0,1,2+)
  platform           string

# Windows & UNC

Use forward slash in patterns. Backslashes escape.
windowsPathsNoEscape: treat backslashes only as separators.
windowsNoMagicRoot: preserve case in UNC or drive roots.
UNC support: patterns starting with //?/, //host/share.

# Performance Levels

0: no path simplification (preserve . and ..)
1: remove safe ../ segments (default)
2: aggressive file-walk optimizations (dedupe **, collapse .)



## Attribution
- Source: Minimatch Pattern Matching
- URL: https://www.npmjs.com/package/minimatch
- License: License
- Crawl Date: 2025-05-06T12:32:16.191Z
- Data Size: 654687 bytes
- Links Found: 1823

## Retrieved
2025-05-06
