NORMALISED EXTRACT

Table of contents
- export statement variants
- Named exports vs default exports
- Live bindings and module semantics
- Recommended usage for this repo

Export statement variants
- Named export declarations: export function name() { } or export const name = value;
- Aggregate export list: export { name1, name2 as alias };
- Re-exporting from another module: export { name } from './other.js';
- Default export: export default expression or export default function name() { }.

Named exports vs default
- Named exports export one or more named bindings; import with import { name } from './module.js'.
- Default export provides a single module-default binding; import with import defaultName from './module.js'.
- Prefer named exports for libraries providing multiple utilities (explicit, better for tree-shaking).

Live bindings and module semantics
- Exports are live bindings: the imported value is updated when the exported binding changes in the source module.
- Declarations exported directly (export const...) create bindings that reflect runtime updates on the original module.
- Circular import rules: careful with side-effects; evaluate module execution order and avoid accessing uninitialised bindings.

Recommended usage for this repository
- package.json contains "type": "module"; therefore use standard ESM named exports in src/lib/main.js:
  - export function fizzBuzz(n) { ... }
  - export function fizzBuzzSingle(n) { ... }
  - or export { fizzBuzz, fizzBuzzSingle } at end of the file.
- Consumers import via: import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js'

SUPPLEMENTARY DETAILS
- File extension rules: with type: module, .js files are ESM. Use .mjs only if mixing with CJS or to explicitly force ESM when type is unspecified.
- When publishing a package, provide both module and main fields if also supporting CJS consumers (not required here).

REFERENCE DETAILS
- Syntax summary (exact forms):
  - export declaration: export function fname([params]) { /* body */ }
  - named list export: export { identifier1, identifier2 as alias };
  - default export: export default expression;
  - re-export: export { x } from './module.js';
- Import examples:
  - import { fname } from './module.js';
  - import defaultExport from './module.js';

DETAILED DIGEST
- MDN "export" reference describes ESM export syntaxes, named vs default, live binding semantics, and usage examples; it recommends using named exports for libraries with multiple exports.
- Retrieval date: 2026-03-21
- Data size obtained during crawling: 205603 bytes

ATTRIBUTION
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
- Retrieved: 2026-03-21
- Content-Length (reported by server): 205603 bytes
