MDN_MODULES

Table of Contents:
- Overview
- Syntax: import and export
- Named exports vs default export
- Dynamic import()
- Module resolution rules (browser vs Node ESM)
- Strict mode and top-level await
- Best practices

Overview:
JavaScript modules provide lexical scoping for code and explicit import/export of bindings. Modules execute in strict mode by default and each module has its own top-level scope.

Syntax: import and export:
- export const name = value;  // named export
- export function fn() {}    // named export
- export default expression; // default export
- import { name } from './module.js'; // named import
- import defaultExport from './module.js'; // default import
- import * as ns from './module.js'; // namespace import

Named exports vs default export:
- A module can have multiple named exports and at most one default export.
- Prefer named exports for library code to allow tree-shaking and clearer API surface.

Dynamic import():
- import('./module.js').then(m => m.namedExport) or use await import('./module.js') inside async context.
- import() returns a Promise resolving to the module namespace object.
- Use dynamic import for conditional loading or code-splitting.

Module resolution rules (browser vs Node ESM):
- Browser: module specifiers are resolved relative to the importing module URL; bare specifiers are not allowed unless using a bundler or import maps.
- Node ESM: supports file, package, and extension resolution; package "exports" field and package.json conditions affect resolution; file extensions matter unless using experimental loaders.
- When using Node ESM, set package.json "type": "module" or use .mjs file extensions.

Strict mode and top-level await:
- Modules are always strict mode. Top-level await is supported in modules allowing awaiting Promises at module scope in environments that implement it (Node >=14.8 with flags, modern browsers, Node >=16+ generally).

Best practices (implementation-focused):
- Export pure functions and small utilities as named exports to enable tree-shaking.
- Use explicit relative paths with .js extension for Node ESM when package "type": "module" is set.
- Use dynamic import for optional features (e.g., feature toggles) and wrap in try/catch for graceful failure.
- Avoid mutating imported bindings; import creates live read-only views of exported bindings.

Supplementary details:
- import() returns module namespace object with named properties and default as the "default" key.
- Exported bindings are live: updates in the exporting module reflect in importers.
- Circular dependencies: modules are initialized in two phases; use only exported bindings after initialization to avoid undefined values.

Reference details (exact signatures and behaviours):
- export declarations: "export" followed by declaration or "export { a, b as c } from './mod.js'".
- import forms:
  - import defaultExport from "module-specifier";
  - import * as name from "module-specifier";
  - import { export1 , export2 as alias2 } from "module-specifier";
  - import("module-specifier").then(module => ...);
- import() returns Promise<ModuleNamespaceObject>.
- ModuleNamespaceObject has exported names as properties; default export accessible via .default.

Detailed digest:
Content retrieved from MDN "JavaScript modules" (retrieved 2026-03-21):
- Modules are file-scoped units executed in strict mode with import/export syntax as described above.
- Use explicit file extensions for Node ESM; dynamic import returns promises; prefer named exports for libraries.

Attribution and data size:
- Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- Retrieved: 2026-03-21
- Approx bytes fetched: 260 KB (page HTML)
