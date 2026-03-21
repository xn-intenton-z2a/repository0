TITLE: EXPORT_STATEMENT

Table of contents:
1. Normalised extract (export forms & semantics)
2. Supplementary details (live bindings and interop rules)
3. Reference details (syntax forms and patterns)
4. Implementation patterns for this repo (ESM named exports)
5. Digest (source, retrieval date, bytes retrieved)
6. Attribution

1) Normalised extract (export forms & semantics)
- The export declaration exports bindings from a module so other modules can import them.
- Export forms supported by ECMAScript and described on MDN:
  - Named exports via declarations: export const name = value; export function fname(...) {} export class C {}
  - Export list: export { a, b as alias } exports existing local bindings by name.
  - Default export: export default expression (module has a single default export accessible as default import).
  - Re-exports: export { name } from 'module'; export * from 'module'; export { default as alias } from 'module'.
- Exports create live bindings: imported bindings reflect updates to the exported binding in the source module (they are not copies).

2) Supplementary details (live bindings and interop rules)
- Live binding consequence: if module A exports let x = 0; and later updates x = 1; imports in B that import { x } will observe the updated value.
- Export declarations must refer to bindings (variables, functions, classes) — exporting expressions directly is performed with default exports or by assigning to an exported binding.
- CommonJS interop: importing a CommonJS module from ESM may yield the CommonJS module's exports as the default export; named imports may not map directly. Verify import shape when migrating or mixing module systems.

3) Reference details (syntax forms and patterns)
- Named declaration export forms:
  - export const NAME = VALUE
  - export let NAME = VALUE
  - export function NAME(PARAMS) { ... }
  - export class NAME { ... }
- Export list form:
  - export { a, b as c }
  - export { name1 } from 'module'   // re-export a specific binding from another module
- Re-export all:
  - export * from 'module'  // re-export all named exports (does not re-export default)
- Default export forms:
  - export default EXPRESSION
  - export default function NAME?() { ... }
- Example import correspondences (informal):
  - import defaultName from 'module'
  - import { name } from 'module'
  - import * as ns from 'module' // namespace object with live bindings

4) Implementation patterns for this repo
- Use named exports in src/lib/main.js to export fizzBuzz and fizzBuzzSingle: export function fizzBuzz(n) { ... } export function fizzBuzzSingle(n) { ... }
- Prefer named exports for core functions to make unit test imports explicit: import { fizzBuzz } from '../src/lib/main.js'
- Avoid default export for library core API when multiple functions are exported; use default only when exporting a single primary value.

5) Digest
- Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
- Retrieval date: 2026-03-21
- Bytes retrieved during crawl: 205603

6) Attribution
- Condensed from MDN Web Docs (export) retrieved 2026-03-21 (205603 bytes). MDN: https://developer.mozilla.org/
