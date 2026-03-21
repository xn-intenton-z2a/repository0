NORMALISED EXTRACT

Table of contents
- ESM basics in Node.js
- package.json "type": "module" effects
- Export/import patterns for named exports
- File extension and interop notes

ESM basics in Node.js
- Node supports ECMAScript modules (ESM). Use standard export and import statements in .js files when package.json contains "type": "module".
- Named exports are the idiomatic way to provide multiple functions from a module.

package.json "type": "module" effects
- When package.json contains "type": "module", files with .js are treated as ESM by Node.
- To use CJS semantics in a file use .cjs extension or avoid ESM syntax.

Export/import patterns for named exports
- Exporting functions from src/lib/main.js: export function fizzBuzz(n) { } and export function fizzBuzzSingle(n) { } or define functions then export { fizzBuzz, fizzBuzzSingle }.
- Importing: import { fizzBuzz, fizzBuzzSingle } from '../src/lib/main.js'

File extension and interop notes
- Use .mjs to force module interpretation regardless of package.json, or .cjs for CommonJS.
- Interop with CommonJS requires default exports or dynamic import; prefer keeping project ESM-consistent as package.json indicates.

SUPPLEMENTARY DETAILS
- Node engine requirement in package.json is ">=24.0.0"; ensure features used are compatible with that runtime.
- For CLI entry points (start:cli) confirm Node executes the module path correctly under ESM.

REFERENCE DETAILS
- Key behavior: named exports create live bindings; import paths must be explicit (include .js extension when importing local files in ESM).
- Example patterns (descriptive):
  - export function fname(...) { }
  - export { fname };
  - import { fname } from './module.js';

DETAILED DIGEST
- Node ESM docs describe module resolution, package.json type, import/export syntax, and interop with CommonJS; they emphasise explicit file extensions and live binding semantics.
- Retrieval date: 2026-03-21
- Data size obtained during crawling: 125511 bytes

ATTRIBUTION
- Source: https://nodejs.org/api/esm.html
- Retrieved: 2026-03-21
- Content-Length (reported by server): 125511 bytes
