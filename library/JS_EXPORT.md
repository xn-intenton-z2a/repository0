NORMALISED EXTRACT

Table of Contents:
1. Export statement forms and grammar
2. Named exports (declaration and list forms)
3. Default export semantics
4. Re-exporting and export * semantics
5. Live bindings and mutation propagation
6. Module specifier resolution and file extension requirements
7. Interaction with bundlers and tree-shaking

1. Export statement forms and grammar
- Export declarations expose local bindings or create exported bindings directly from expressions. Two principal syntactic categories exist: export declarations that attach to a local declaration (export function f() {}, export const X = 1) and export list forms that enumerate exported bindings (export { A, B as C }).
- Export list form syntax: export { localName [as exportedName], ... } where each entry binds the exportedName to the live binding of localName.
- Named export declaration syntax creates an exported binding bound to the declared local identifier. The exported binding is live and reflects updates to the local binding.
- Re-export declaration syntax: export { name } from 'specifier' and export { default as name } from 'specifier' create exports forwarded from another module without creating a local binding.

2. Named exports (declaration and list forms)
- Declaration form: when a declaration is prefixed with export it creates a local binding and an exported binding with the same live value; e.g., export const PI = 3.1415 creates a local constant PI and exports it as a named export 'PI'.
- List form: export { A, B as C } exports existing local bindings. The exported names are aliases to the original local bindings; reassignment to the local binding updates the exported name because of live binding semantics.
- Importing named exports: import { A, C } from './module.js' resolves A and C to the current values of those live bindings at module evaluation and subsequent updates.

3. Default export semantics
- A module may declare a single default export: export default expression or export default function name() {}. The default export is a single binding exposed as the module's default.
- Importing default: import AnyName from './module.js' binds AnyName to the module's default export value.
- Default export is not a namespace; it is a single binding which can be a function, class, object, primitive, or other value.
- Re-exporting a default: export { default as name } from './other.js' forwards the default export of other.js under the named export 'name'.

4. Re-exporting and export * semantics
- Export forwarding: export { x } from 'mod' and export { default as d } from 'mod' forward bindings from the source module to the current module's export list without creating local mutable bindings.
- Export all: export * from 'mod' re-exports all named exports (not including the default) from mod. The resulting exports are live views onto the original module's named exports.
- When combining export * with local exports, name collisions cause a runtime resolution error at module instantiation if the same export name would be exported twice.

5. Live bindings and mutation propagation
- Named exports are live bindings: the exported name is a dynamic view of the originating module's internal binding. If the origin module mutates the binding (e.g., reassigns a let variable or updates an object referenced by a const), importers observe the updated value when they access the imported binding after mutation.
- Live binding mechanism: importers hold immutable references to the exported binding slot; the slot's current value reflects the origin module's binding value.
- Best practice: do not rely on mutation of primitive exported bindings across modules for configuration; prefer functions that return values or explicit setter APIs for predictable behavior.

6. Module specifier resolution and file extension requirements
- Specifiers in import/export statements must be valid module specifiers for the host environment. In Node.js with "type": "module", relative specifiers must include file extensions (e.g., './util.js') unless package exports maps or custom resolution are used.
- Bare specifiers (e.g., 'lodash') are resolved by the host resolution algorithm (Node uses package exports and node_modules lookup). Browsers treat bare specifiers as unresolved unless a bundler or import map translates them.
- Re-exporting from a specifier follows the same resolution rules as import; missing or ambiguous specifiers cause module resolution errors at load time.

7. Interaction with bundlers and tree-shaking
- Named exports enable tree-shaking: bundlers that support static analysis can include only the imported named exports when building for production.
- Prefer named exports for libraries with multiple utilities to allow tree-shaking; prefer default export when the module primarily exposes a single main value.
- Avoid dynamic export names or computed export lists; static export declarations are required for most bundlers to perform safe tree-shaking and static analysis.

SUPPLEMENTARY DETAILS

Implementation notes and patterns:
- Validate public API exports by creating an explicit export list: list exported symbols in a central index file using export { a, b, c } from './lib.js' to provide a stable public surface.
- Use export default sparingly in libraries intended for named import usage to maximize tree-shaking and clarity.
- When re-exporting for API consolidation, prefer explicit re-exports (export { name } from './file.js') rather than export * to avoid accidental exposure of internal symbols and to make surface area explicit.
- For Node.js packages using ESM, set package.json's "type": "module" to allow .js files to be parsed as ESM, or use .mjs extensions for ESM files in packages without type:module.
- For tools or runtimes requiring extensions, always include '.js' in relative module specifiers when targeting Node ESM.

Reference Details (explicit semantics and patterns)

1) Named export declaration pattern
- Form: export <declaration>
- Effect: creates a local binding per the declaration and an exported binding with the same name; exported binding is live and reflects local updates.

2) Export list forwarding pattern
- Form: export { name [, alias as exportedName] } from 'specifier'
- Effect: creates an export entry forwarding the specifier's binding; does not create a local binding in the current module.

3) Export all pattern
- Form: export * from 'specifier'
- Effect: re-exports all named exports from specifier except default; resulting exported names are live proxies to the original bindings.
- Collision rule: if two sources would export the same name or a local export collides with an export * entry, the module instantiation fails with a duplicate export error.

4) Default export pattern
- Form: export default <expression>
- Effect: exposes the module's default slot with the provided value; importers use default import syntax to bind to this slot.
- Re-export default: export { default as alias } from 'specifier' forwards default under an explicit named export.

5) Importer behavior regarding live bindings
- Import form: import { name } from 'specifier'
- Behavior: the imported binding is a read-only view of the origin module's live binding slot; assignments to the imported name are syntax errors in the importer.

6) Resolution rules notes for Node.js ESM
- When package.json contains "type": "module", .js is treated as ESM; relative imports must use exact file extensions unless package exports map is present.
- When importing CommonJS from ESM, default import receives module.exports; named imports may be undefined unless Node supplies statically analyzable named exports.

Best practices with implementation examples (plain text patterns):
- Library index pattern: export { utilA } from './utils/utilA.js'; export { utilB } from './utils/utilB.js'; // central public surface
- Avoid export * for public API: prefer explicit exports to make API boundary clear and avoid accidental export collisions.
- Prefer named exports for utilities: export function parse(input) { ... } export function stringify(obj) { ... }
- Use default export for primary single-value modules: export default function main(options) { ... }

Troubleshooting steps
- Symptom: import { x } from './mod' yields undefined at runtime. Check that './mod' actually exports named binding 'x' (export { x }) and that the specifier includes the correct file extension and path.
- Symptom: Duplicate export error when bundling. Check for multiple re-export sources using export * that expose the same name; replace export * with explicit export lists or rename exports.
- Symptom: Tree-shaking not removing unused code. Ensure exports are static (not created dynamically) and use named exports; verify bundler configuration supports ESM and sideEffects:false in package.json when safe.

DETAILED DIGEST
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
Retrieved: 2026-03-09
Extracted technical content: complete export declaration forms, re-export and export * semantics, live-binding behavior, resolution implications for host environments, explicit best-practice patterns for library authors
Data size obtained: ~9 KB
Attribution: MDN Web Docs, Mozilla

[ATTRIBUTION]
Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
License and attribution: MDN content reproduced under Mozilla Public License (check source for license terms); attributed to MDN Web Docs, Mozilla.

Data size obtained during crawl: approximately 9 KB of HTML/text.
