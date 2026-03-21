MDN_MODULES

1) Normalised extract

Table of contents:
- ES module syntax
- Named exports vs default
- package.json type: module
- Import patterns
- Recommended export pattern for this project

ES module syntax (named exports):
- To export named functions from an ES module file: use the named export form at declaration site (for example, declare functions and export them by name from src/lib/main.js).
- Export alternatives: export function fizzBuzz(n) { ... } or export { fizzBuzz, fizzBuzzSingle }.

Named export vs default:
- Named exports allow multiple exported bindings per module; they are preferred when exposing multiple functions.
- Default export is a single value and not required for this mission.

package.json type field:
- If package.json contains "type": "module" then Node treats .js files as ES modules.
- The repository already declares "type": "module" so use ES module named exports in src/lib/main.js.

Import patterns:
- Import named functions with: import { fizzBuzz, fizzBuzzSingle } from './lib/main.js'
- Use explicit file extensions when importing in Node ESM (include .js) or use directory entry points configured in package.json.

Recommended pattern for this project:
- Implement and export named functions in src/lib/main.js using ES module syntax.
- Keep exported function signatures exact as required: fizzBuzz(n): Array<string> and fizzBuzzSingle(n): string.

2) Supplementary details
- Live bindings: exported identifiers are live bindings; reassigning an exported binding at runtime affects importers that reference it.
- Keep module surface small and well-documented.

3) Reference details
- Example export signatures (explicit specification):
  export function fizzBuzz(n) -> Array<string>
  export function fizzBuzzSingle(n) -> string
- Import usage: import { fizzBuzz, fizzBuzzSingle } from 'src/lib/main.js'

4) Detailed digest
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- Retrieved: 2026-03-21
- Data size fetched: 256786 bytes
- Extracted content: MDN documents the syntax for ES modules, named and default exports, the effect of package.json type, and import resolution semantics in Node and browsers.

5) Attribution
- Attribution: MDN Web Docs; retrieved 2026-03-21; raw HTML captured during crawl: 256786 bytes.
