MDN_EXPORT

Table of contents:
- ES module export forms (exact patterns)
- Named vs default exports
- Re-export patterns
- Import patterns for consumers
- Node ESM considerations (package.json type)
- Detailed digest and retrieval info

NORMALISED EXTRACT
Exact export patterns (plain-text syntax examples)
- Named function export at declaration: export function name(args) { /* ... */ }
- Named bound export after declaration: function name(args) { /* ... */ } export { name };
- Named export with alias: export { localName as exportedName };
- Default export: export default expression; import defaultExport from './module.js';
- Re-export from another module: export { name } from './other.js';

Named vs default
- Named exports are imported with curly braces: import { name } from './module.js'.
- Default export is imported without braces: import name from './module.js'.
- A module can have multiple named exports but only one default export.

Node ESM and package.json
- For Node.js to accept ESM syntax in .js files, package.json must include "type": "module". The repository already specifies type: module so using 'export' named exports from src/lib/main.js is correct.

Implementation pattern for this mission
- Provide named exports for the two required functions as either:
  - export function fizzBuzz(n) { ... }
  - export function fizzBuzzSingle(n) { ... }
  or declare then export: function fizzBuzz(...) { } function fizzBuzzSingle(...) { } export { fizzBuzz, fizzBuzzSingle };
- Consumers can then import: import { fizzBuzz, fizzBuzzSingle } from '@xn-intenton-z2a/repository0/src/lib/main.js' (relative path or package entrypoint as appropriate).

DETAILED DIGEST
Extracted technical content retrieved: 2026-03-22
- MDN provides exact export statement forms, examples of named and default exports, and notes on module resolution and ESM in Node when package.json contains type: "module".

ATTRIBUTION AND CRAWL SIZE
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
Retrieved: 2026-03-22
Bytes downloaded during crawl: 205609