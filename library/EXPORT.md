EXPORT

Table of contents
- export statement forms
- Named export syntax
- Default export syntax
- Re-exporting and aggregation (export * / export { } from)
- Live bindings semantics
- Module resolution notes

export statement forms
- Named exports: export { name1, name2 as alias } and export const x = ...; export function f() {}. - Default export: export default expression; export default function f() {}. - Re-exports: export * from 'module'; export { name } from 'module'

Named export syntax
- Named binding export: export const a = 1; import { a } from './m'; - Named list export: export { foo, bar as baz };

Default export syntax
- Single default per module: export default value; import defaultBinding from './m'; - Default can be an expression or declaration.

Re-exporting and aggregation
- export * from 'mod' re-exports all named exports except default. - export { name } from 'mod' re-exports specific bindings. - Use these to create barrels or aggregated modules.

Live bindings semantics
- Exports are live bindings: importers observe updated values from the exporting module if the exported binding is mutated.

Module resolution notes
- Syntax is static; exports are analyzed at parse/compile time. - In Node ESM, file extension and package type affect resolution.

Reference details
- Statement forms and signatures:
  - export { specifierList } from 'module'
  - export default <expression>
  - export * from 'module'
- Effects: establishes module record exported bindings, not copies.

Detailed digest
Source: MDN — export (retrieved 2026-03-15). Raw HTML size: 210927 bytes.

Attribution and crawl data
- MDN Web Docs — export statement. Retrieved 2026-03-15. 210927 bytes.
