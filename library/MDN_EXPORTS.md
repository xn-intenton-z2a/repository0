NORMALISED EXTRACT

Topic: export statements (ECMAScript modules)

Definition and syntax overview
- Named exports: export { a, b as alias } ; export function fn() {} ; export const c = value
- Default export: export default expression
- Re-exporting: export { name } from 'module'
- Module consumers import with: import { a, alias } from './module.js' or import def from './module.js'

Table of contents
1. Named exports
2. Default export
3. Re-exporting and aggregation
4. File/module examples and patterns

Detailed technical content
1. Named exports
- Syntax: export const name = value; export function name() { }
- Consumers must import by exact exported name (or use aliasing during import).
- Multiple named exports allowed per module.

2. Default export
- Syntax: export default expression
- A module may have at most one default export.
- Consumers import the default with: import anyName from './module'

3. Re-exporting and aggregation
- Syntax: export { foo } from './other'; export * from './other' (re-export all named exports but not default)
- Use re-exports to create central barrel modules.

4. File/module patterns for Node.js ESM
- When writing src/lib/main.js as an ES module, export functions as named exports:
  - export function fizzBuzz(n) { ... }
  - export function fizzBuzzSingle(n) { ... }
- Alternatively export named consts: export const fizzBuzz = (n) => { ... }

SUPPLEMENTARY DETAILS

Common pitfalls
- Using module.exports (CommonJS) vs export (ESM): when type: module in package.json prefer ESM exports.
- Default vs named: prefer named exports for utility libraries to enable tree-shaking and clearer API surfaces.

REFERENCE DETAILS

Exact syntaxes
- export { name1, name2 as alias };
- export function fname(params) { }
- export const name = value;
- export default expression;
- import { name } from './mod.js'; import def from './mod.js';

Detailed digest
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
- Retrieved: 2026-03-18
- Bytes downloaded during crawl: 205605

Attribution
Content condensed from MDN Web Docs: export (Statements).