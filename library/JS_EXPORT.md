NORMALISED EXTRACT

Table of Contents:
1. export statement forms
2. Named exports
3. Default export
4. Re-exporting
5. Module resolution and file extensions
6. Implementation and usage patterns

1. export statement forms
- Export declarations in ECMAScript modules enable symbols (values, functions, classes, constants) to be made visible to importers.
- Two primary forms: named exports and default exports.

2. Named exports
- Syntax examples (declaration form): export function fn() { }, export const X = 1
- Export list form: export { A, B as C }
- Named export bindings are live: imported value reflects updates to the exported binding when mutable.
- Consumers import named bindings via: import { A, C } from './module.js'

3. Default export
- Syntax: export default expression OR export default function f() {}
- A module may have at most one default export.
- Consumers import default with: import AnyName from './module.js'
- Default export is a value binding, not a namespace object; can be a function, class, object, primitive, etc.

4. Re-exporting
- Re-export without local binding: export { named } from './other.js'
- Export all: export * from './other.js' (re-exports all named exports except default)
- Re-export default explicitly: export { default as name } from './other.js'
- When re-exporting, the origin binding remains the same live binding only if the implementation supports live bindings; spec mandates live bindings propagation for named exports

5. Module resolution and file extensions
- ESM resolution in browsers and Node requires exact file specifiers in many contexts; .js extension often required for Node when using 'type': 'module' in package.json
- Relative specifiers: './x.js', '../lib/y.js'
- Bare specifiers (e.g., 'lodash') are resolved by host (Node uses package exports field and node_modules resolution)

6. Implementation and usage patterns
- Prefer named exports for libraries with multiple exported utilities to allow tree-shaking and clearer import lists
- Use default export for a single primary export (e.g., a class or main function)
- Avoid mixing default and many named exports when consumers expect static analysis for tooling

SUPPLEMENTARY DETAILS

Runtime semantics and live bindings:
- Exports create immutable bindings to the exported name in the module namespace; the binding's value can change (when the local variable is mutable) and importers see updated values.
- Circular dependencies: modules execute in an order governed by dependencies; imported bindings may be live but may be uninitialized during module evaluation; avoid relying on side-effect order

REFERENCE DETAILS

Exact grammar patterns and behavior required for implementation compliance:
- export Declaration: ExportNamedDeclaration | ExportDefaultDeclaration as per ECMAScript module syntax
- Named export binding: exported name refers to local binding; importers observe current value via live reference
- Re-export semantics: export * from 'module' copies property getters for each exported name except default; export { name as alias } from 'module' creates an exported binding that references the original module's live binding

Implementation options and effects:
- When bundling: named exports permit tree-shaking; default export may be represented as a property 'default' on the module object when interop required
- When interoperating with CommonJS: Node provides synthetic default export mapping when importing CJS from ESM using createRequire or default interop rules; explicit patterns needed for deterministic behavior

DETAILED DIGEST

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
Retrieved: 2026-03-09
Extracted technical content: named/default export forms, re-exporting patterns, live bindings behavior, file specifier notes
Data size obtained: ~12 KB
Attribution: MDN Web Docs, Mozilla
