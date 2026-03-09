NORMALISED EXTRACT

Table of Contents:
1. export statement forms
2. Syntax and semantics
3. Module binding and live references
4. Re-exporting patterns

1. export statement forms
- Named exports: export const A = ...; export function f() {} ; export { localName as exportedName };
- Default export: export default expression; export default function name?() {} ; export default class {}
- Aggregate export: export * from 'module'; export { name1, name2 as local } from 'module';

2. Syntax and semantics
- Named exports create exported bindings that are live views into module-local values. Importers receive a live reference.
- Default export provides a module-specific default binding; importing default uses import defaultName from 'module'.
- Export list (export { ... }) enumerates exported names; these names must be declared in the module scope or previously imported.

3. Module binding and live references
- Exported identifiers are not copies; they are bindings. If the module mutates an exported variable (e.g., export let x = 1; x = 2;), importers observing x will see updated value.
- Circular dependencies: because exports are live bindings, modules involved in cycles can observe partially initialized bindings; use caution and prefer functions rather than relying on initialization order.

4. Re-exporting patterns
- export { name } from 'module' re-exports an imported binding without creating a local binding.
- export * from 'module' re-exports all named exports except default.
- export { default as alias } from 'module' re-exports default under a named export.

SUPPLEMENTARY DETAILS

Technical specifications and implementation details:
- Export semantics follow ES Module Loader: importers resolve module specifiers, instantiate modules, evaluate in specific phases: parsing, instantiation (bindings created), evaluation (code runs).
- Exports must be statically analyzable: named exports and imports are resolved at compile time; dynamic export forms (e.g., export from variable) not allowed.
- When mixing CommonJS and ESM, default interop wrappers may apply; Node.js provides module.exports and exports mapping; prefer using export in ESM files (type: module).

REFERENCE DETAILS

API signatures and examples (semantic, not code-escaped):
- export { localName as exportedName } : re-exports localName under exportedName.
- export default expression : module's default export set to result of expression evaluation.

Configuration options and effects:
- In Node.js, set "type": "module" in package.json or use .mjs extension to enable ESM parsing.
- When transpiling, ensure tools preserve live binding semantics when converting to CommonJS; transpilers may emulate with getters.

TROUBLESHOOTING

- If imports see stale values, verify code mutates exported bindings after import time; ensure proper initialization order or refactor to use functions.
- If default not found when importing CommonJS, check transpiler or interop defaults (module.exports vs exports.default).

DIGEST

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
Retrieved: 2026-03-09
Size: small (MDN reference)

ATTRIBUTION

Content adapted from MDN Web Docs (developer.mozilla.org) and ECMAScript module semantics. Data size: ~1 page equivalent.