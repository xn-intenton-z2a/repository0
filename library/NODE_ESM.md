Table of contents
1. ESM module basics in Node.js
2. Export patterns required for mission
3. Running scripts and entry points
4. Digest and retrieval

1. ESM module basics in Node.js
- When package.json contains "type": "module" the project uses ESM; use export syntax instead of module.exports.
- Named exports: export function fizzBuzz(n) { } and export function fizzBuzzSingle(n) { }

2. Export patterns required for mission
- Main file src/lib/main.js should export named functions; consumers import { fizzBuzz } from '@xn-intenton-z2a/repository0' or relative path.
- For CLI entry: node src/lib/main.js runs as script; keep export statements compatible with Node ESM.

3. Running scripts and entry points
- package.json "main" points to src/lib/main.js; Node will load as ESM when "type":"module".
- Tests (vitest) run in Node environment supporting ESM; ensure exported functions are named and importable by tests.

4. Digest and retrieval
Source: https://nodejs.org/api/esm.html
Retrieved: 2026-03-21
Size: Node docs HTML retrieved (truncated) ~120KB
Attribution: Node.js documentation
