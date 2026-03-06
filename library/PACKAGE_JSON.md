PACKAGE_JSON

NORMALISED EXTRACT

This document extracts the exact, implementation-relevant fields from package.json and SOURCES.md to provide an actionable reference for running, testing, and integrating the repository.

Table of Contents
1. Package identity and module format
2. Entrypoint and CLI behavior
3. NPM scripts (exact commands and effects)
4. Dependencies and devDependencies (exact versions)
5. Engine requirement and runtime constraints
6. Running and testing commands (step-by-step)
7. Troubleshooting and common fixes

1. Package identity and module format
name: repo
version: 0.1.0
type: module
main: src/lib/main.js

2. Entrypoint and CLI behavior
- main file is an ECMAScript module at src/lib/main.js. It is the package entrypoint for node - the script is executed with `node src/lib/main.js` via the "start" script. The entrypoint exports runtime utilities (hamming utilities) and a minimal CLI shim that prints args as a JSON string when invoked directly.

3. NPM scripts (exact commands and effects)
- build: echo "Nothing to build"
  - Effect: no build step; intended placeholder for build automation.
- test: vitest --run tests/unit/*.test.js
  - Effect: Run unit tests with Vitest once (no watch). Use this in CI.
- test:unit: vitest --run --coverage tests/unit/*.test.js
  - Effect: Run unit tests with coverage collection using Vitest and the coverage provider @vitest/coverage-v8.
- start: node src/lib/main.js
  - Effect: Run the package entrypoint using Node.js. Uses native ESM loader because type: module is set in package.json.

4. Dependencies and devDependencies (exact versions)
- dependencies:
  - @xn-intenton-z2a/agentic-lib: ^7.1.61
- devDependencies:
  - @vitest/coverage-v8: ^4.0.18
  - vitest: ^4.0.18

5. Engine requirement and runtime constraints
- engines.node: >=24.0.0
  - Effect: Node.js 24 or later required; ESM and top-level await, and modern runtime features are expected.
  - Recommended: Use nvm, volta, or similar to pin Node.js >=24 in developer environments and CI images.

6. Running and testing commands (step-by-step)
- Install dependencies: npm ci  (preferred for CI) or npm install
- Run unit tests once: npm run test
- Run unit tests + coverage: npm run test:unit
- Start the CLI/entrypoint: npm run start
- Re-run tests locally with verbose output: npx vitest --run --reporter verbose tests/unit/*.test.js

7. Troubleshooting and common fixes
- Node version mismatch: If npm ERR! engine Unsupported, install Node >=24 and ensure your shell uses it (nvm use 24 || nvm install 24).
- Vitest failures due to environment: ensure devDependencies installed and run with NODE_OPTIONS=--experimental-vm-modules only if required by older Node versions (not needed for Node >=24).
- Missing modules after clone: run npm ci to get deterministic install; do not commit node_modules.
- Coverage provider errors: confirm @vitest/coverage-v8 is present in devDependencies and compatible with installed vitest version.

SUPPLEMENTARY DETAILS

Exact package.json content (extracted fields):
{
  "name": "repo",
  "version": "0.1.0",
  "type": "module",
  "main": "src/lib/main.js",
  "scripts": {
    "build": "echo \"Nothing to build\"",
    "test": "vitest --run tests/unit/*.test.js",
    "test:unit": "vitest --run --coverage tests/unit/*.test.js",
    "start": "node src/lib/main.js"
  },
  "dependencies": {
    "@xn-intenton-z2a/agentic-lib": "^7.1.61"
  },
  "devDependencies": {
    "@vitest/coverage-v8": "^4.0.18",
    "vitest": "^4.0.18"
  },
  "engines": {
    "node": ">=24.0.0"
  }
}

REFERENCE DETAILS (exact commands, options, and behaviors)
- npm run build
  - Runs shell command: echo "Nothing to build"
  - Return: prints "Nothing to build" to stdout and exits 0
- npm run test
  - Runs: vitest --run tests/unit/*.test.js
  - Option --run: run tests once and exit (non-watch)
  - Behavior: Executes tests matching tests/unit/*.test.js using the locally installed vitest binary
- npm run test:unit
  - Runs: vitest --run --coverage tests/unit/*.test.js
  - Effect: collects coverage via configured coverage provider (@vitest/coverage-v8) and writes coverage artefacts per Vitest defaults
- npm run start
  - Runs: node src/lib/main.js
  - Behavior: Executes ESM module entrypoint; entrypoint expects to be run on Node >=24

Best practices and implementation examples
- CI: use node:24 image (or later) and run npm ci && npm run test to ensure deterministic installs and single-run tests.
- Local development: use nvm alias default 24 to pin developer Node version. Use npm run test for quick feedback.
- Adding a build step: Replace build script with a specific bundler invocation (esbuild, rollup) if transpilation or packaging is required. Keep scripts idempotent and non-interactive for CI.

Step-by-step troubleshooting procedures
1. Problem: tests fail immediately with Cannot find module 'vitest'
   Fix: run npm ci and verify devDependencies installed; confirm node_modules/.bin/vitest exists.
2. Problem: engine unsupported on npm install
   Fix: install Node >=24 and ensure PATH resolves that version (nvm use 24; node -v should be >=24).
3. Problem: coverage collection fails
   Fix: ensure @vitest/coverage-v8 version is compatible with vitest version; if mismatch, align versions in package.json and run npm ci.

DETAILED DIGEST
- Source: package.json (repository root)
- Source: SOURCES.md (repository root) which lists repository URLs used by maintain-library workflow
- Retrieved on: 2026-03-06
- Key actionable items extracted: exact npm scripts, dependency versions, engine constraint, and file locations for entrypoint and tests

ATTRIBUTION AND DATA SIZE
- Crawled sources and files:
  - package.json — 583 bytes (raw file size)
  - SOURCES.md — 263 bytes (raw file size)
- Primary source URL listed in SOURCES.md:
  - https://github.com/xn-intenton-z2a/repository0

Document created from repository files and SOURCES.md; use this document as the canonical quick-reference for package/runtime configuration and CI invocation.
