MDN_EXPORT

Normalised extract:
- Export mechanisms in ECMAScript modules: named exports, default exports, re-exports and export declarations.
- Import forms: import defaultExport from 'module'; import { named } from 'module'; import * as ns from 'module'; dynamic import(importSpecifier) returns a Promise.

Table of contents:
1. Named exports
2. Default export
3. Re-exporting
4. Import forms
5. Dynamic import
6. Interop notes (Node / bundlers)

Details:
1. Named exports
   - Syntax patterns: export { a, b as alias } ; export const x = 1 ; export function fn() {}
   - Import using: import { a, alias } from './mod.js'

2. Default export
   - Syntax: export default expression or export default function/class
   - Import using: import anyName from './mod.js'

3. Re-exporting
   - Syntax: export { name } from 'module'
   - You can re-export a default as a named: export { default as alias } from 'module'

4. Import forms
   - Static import is hoisted and evaluated as a module binding.
   - Named imports are live read-only bindings to exported values.

5. Dynamic import
   - import('module').then(m => ...) returns a Promise resolving to the module namespace object
   - Useful for conditional loads or ESM-only code paths

6. Interop notes
   - In Node.js enable ESM with package.json { "type": "module" } or use .mjs extensions; named exports and default exports map to module namespace differently than CommonJS require.

Reference details:
- Named export signature: export { name1, name2 as alias2 }
- Default export signature: export default <expression>
- Import forms: import defaultExport from 'module'; import { named } from 'module'; import * as ns from 'module'

Detailed digest:
- Source: MDN "export" (developer.mozilla.org)
- Retrieval date: 2026-03-21
- Bytes fetched during crawl: 205603

Attribution:
- MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
