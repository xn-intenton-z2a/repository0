RUNBOOK

NORMALISED EXTRACT

Table of Contents
1. Required secrets and exact names
2. Repository settings and permissions
3. Init, update and run commands
4. agentic-lib core config snippet (exact keys and values)
5. Entrypoint behaviour and exported utilities
6. Hamming utilities: exact API signatures and error semantics
7. NPM scripts and engine requirement

1. Required secrets and exact names
COPILOT_GITHUB_TOKEN
- Exact repository secret name: COPILOT_GITHUB_TOKEN
- Token type: Fine-grained Personal Access Token (PAT)
- Required minimal permissions: Copilot SDK: read (or read-only Contents if Copilot UI maps permissions that way)
- Purpose: Authenticate the Copilot SDK for agentic tasks (issue generation, code edits, PRs)

WORKFLOW_TOKEN
- Exact repository secret name: WORKFLOW_TOKEN
- Token type: Classic personal access token
- Required scopes: repo workflow or workflow (ability to modify files in .github/workflows/)
- Purpose: Allow automation to update workflow files when GITHUB_TOKEN lacks write permissions

2. Repository settings and permissions (exact values)
- GitHub Actions: Allow all actions
- Workflow permissions: Read and write
- Allow GitHub Actions to create pull requests: Enabled
- GitHub Discussions: Enabled (for discussions bot)
- Optional branch protection recommendations (production): Require PR reviews; Require status checks and select the `test` workflow

3. Init, update and run commands (exact commands)
- Manual init/update of agentic infra: npx @xn-intenton-z2a/agentic-lib@latest init
- Run package entrypoint: node src/lib/main.js
- Run tests (CI): vitest --run tests/unit/*.test.js
- Run unit tests with coverage: vitest --run --coverage tests/unit/*.test.js
- Placeholder build (no-op): echo "Nothing to build"

4. agentic-lib core config snippet (exact keys and values)
(specific keys used by automation; change values to tune behaviour)
[schedule]
supervisor = "daily"    # options: off | weekly | daily | hourly | continuous

[paths]
mission = "MISSION.md"
source = "src/lib/"
tests = "tests/unit/"

[limits]
feature-issues = 2
attempts-per-issue = 2

5. Entrypoint behaviour and exported utilities (exact mechanics)
- Entry file: src/lib/main.js (ESM module; package.json type: module)
- main(args: string[] | undefined) -> void
  - Behavior: writes a single line to stdout: Run with: <JSON-stringified-args>
  - Invocation: when process.argv[1] === fileURLToPath(import.meta.url), main is called with process.argv.slice(2)
  - Return: void
- Re-exports: hammingDistance, hammingDistanceBits (imported from ./hamming.js and re-exported)
- CLI: invoked via node src/lib/main.js, prints JSON of args

6. Hamming utilities: exact API signatures and error semantics
hammingDistance(a: string, b: string) -> number
- Parameters: a (ECMAScript string), b (ECMAScript string)
- Precondition: both inputs must be type string; otherwise throw TypeError
- Normalization: normalize both inputs to Unicode Normalization Form C (NFC) before processing
- Comparison unit: compare by Unicode code points; implementations MUST convert strings to code point arrays (Array.from or equivalent) so surrogate pairs count as single code points
- Length requirement: if code point counts differ, throw RangeError
- Behavior: return integer count of indices i where normalizedCodePointsA[i] !== normalizedCodePointsB[i]
- Return: non-negative integer; identical after normalization returns 0

hammingDistanceBits(x: Buffer | Uint8Array | ArrayBuffer, y: Buffer | Uint8Array | ArrayBuffer) -> number
- Parameters: x, y (byte-sequence buffers of identical length). Supported types: Buffer, Uint8Array, ArrayBuffer
- Validation: throw TypeError for unsupported types; throw RangeError if byte lengths differ
- Behavior: for each corresponding byte pair, compute byteA ^ byteB, then add popcount(byte) to running total
- Return: non-negative integer equal to total differing bits across sequences

7. NPM scripts and engine requirement (exact values)
- package.json fields:
  - name: repo
  - version: 0.1.0
  - type: module
  - main: src/lib/main.js
- Scripts (exact commands):
  - build: echo "Nothing to build"
  - test: vitest --run tests/unit/*.test.js
  - test:unit: vitest --run --coverage tests/unit/*.test.js
  - start: node src/lib/main.js
- Engines: node >=24.0.0 (Node.js 24 or later required)

SUPPLEMENTARY DETAILS

Exact implementation notes and quick checks
- Verify COPILOT_GITHUB_TOKEN is a fine-grained PAT scoped to the repository and includes Copilot SDK read access; test by running a workflow that lists repository content via the Copilot integration
- If workflows cannot modify .github/workflows/, set WORKFLOW_TOKEN with classic token and minimal workflow scope
- To verify entrypoint behavior locally: node src/lib/main.js a b c  -> expected stdout: Run with: ["a","b","c"]
- To import utilities in code: import { hammingDistance, hammingDistanceBits } from 'repo' (or from ./src/lib/main.js when using local file path)

REFERENCE DETAILS

Exact method signatures and usage patterns (copy-paste ready)
- hammingDistance(a: string, b: string) -> number
  - Throws: TypeError when a or b not strings; RangeError when code point lengths differ
  - Deterministic contract: Unicode normalization to NFC must be applied prior to comparison

- hammingDistanceBits(x: Buffer | Uint8Array | ArrayBuffer, y: Buffer | Uint8Array | ArrayBuffer) -> number
  - Throws: TypeError for unsupported types; RangeError when byte lengths differ
  - Implementation pattern: convert ArrayBuffer to Uint8Array(view) when necessary; accumulate popcount(xor) across bytes

Exact commands and configuration values (copy-ready)
- Initialize/update agentic infra: npx @xn-intenton-z2a/agentic-lib@latest init
- Run tests: npm test  (expands to vitest --run tests/unit/*.test.js)
- Node engine requirement: set in CI to Node.js 24+ (example for actions: actions/setup-node with node-version: '24')

Best practices and troubleshooting steps (step-by-step)
1. Secrets and tokens
  - Step 1: Add COPILOT_GITHUB_TOKEN as a fine-grained PAT scoped to the repo
  - Step 2: Add WORKFLOW_TOKEN only if workflows need to modify .github/workflows/
  - Verification: trigger a workflow that runs an agentic task; check logs for Copilot SDK authentication success

2. Workflow failures
  - Check: Workflow permissions are set to Read and write
  - Check: Actions are allowed in repository settings
  - If workflow fails to update workflow files: ensure WORKFLOW_TOKEN is present and used in the job that edits .github/workflows/

3. Entrypoint and exports
  - If importing from package fails: confirm package.json has type: module and main: src/lib/main.js
  - If CLI prints unexpected args: confirm process.argv slicing and invocation condition in src/lib/main.js

DETAILED DIGEST

Source: README.md (repository root) and src/lib/main.js retrieved from https://github.com/xn-intenton-z2a/repository0
Date retrieved: 2026-03-06

Key extracted content (verbatim-critical items)
- Required secrets: COPILOT_GITHUB_TOKEN, WORKFLOW_TOKEN
- Repository settings: Actions allowed, Workflow permissions read/write, Discussions enabled
- Core commands: npx @xn-intenton-z2a/agentic-lib@latest init; node src/lib/main.js; vitest --run tests/unit/*.test.js
- agentic-lib config keys and example values: [schedule].supervisor = "daily"; [paths].mission = "MISSION.md"; [limits].feature-issues = 2
- Entrypoint mechanics: main(args) prints Run with: <JSON>; file re-exports hamming utilities
- Hamming API contracts and error semantics as specified above

ATTRIBUTION AND CRAWL METADATA

Source URL: https://github.com/xn-intenton-z2a/repository0
Files read from repository during extraction: README.md (repository root), src/lib/main.js, SOURCES.md
Data obtained during crawl (combined approximate size in bytes):
- README.md: 3500 bytes (approx)
- src/lib/main.js: 860 bytes (approx)
- SOURCES.md: 120 bytes (approx)
Total data size: ~4480 bytes

Attribution: content derived from repository https://github.com/xn-intenton-z2a/repository0 as of 2026-03-06
