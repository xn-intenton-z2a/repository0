NORMALISED EXTRACT:
ECMAScript modules in Node.js — rules and interoperability
- Modules: Node supports ECMAScript modules (ESM) with the import/export syntax. Module interpretation for .js files is controlled by the package.json field type: set "type": "module" to treat .js as ESM; otherwise .js is CommonJS by default and .mjs forces ESM.
- Top-level await: allowed inside modules.
- import.meta: provides module-specific metadata (import.meta.url is the module file URL).
- CommonJS interop: dynamic import() can load ESM; to use CommonJS APIs from ESM use the createRequire helper from the 'module' builtin; to import default from CommonJS, semantics differ depending on export shape and the exports field.
- Package exports/imports: package.json may declare "exports" and "imports" mappings to control resolution and conditional exports for ESM consumers.

TABLE OF CONTENTS:
1. File type resolution rules
2. Import/export syntax and limitations
3. Top-level await and import.meta
4. Interoperability with CommonJS
5. package.json fields: type, exports, imports
6. CLI flags and loader behaviour

DETAILED CONTENT:
1. File type resolution rules
- If package.json contains "type":"module" then .js files are parsed as ESM; otherwise .js is CommonJS and .mjs is ESM regardless of package type.
- Explicit file extensions must be used for local file imports (e.g., specify .js or .mjs in import specifiers when resolving local files).

2. Import/export syntax and limitations
- Static import: import { named } from 'pkg' or import defaultExport from './file.js'.
- Named and default exports are supported; cyclic dependency semantics follow ES module spec.
- require() is not available natively inside ESM modules without bridging helpers.

3. Top-level await and import.meta
- Top-level await is permitted in modules and suspends module evaluation until awaited promises settle.
- import.meta.url returns a file: URL string for the current module; convert to path for file-system operations when needed.

4. Interoperability with CommonJS
- To obtain a CommonJS require function inside ESM, use the module builtin's createRequire and call createRequire(import.meta.url).
- Importing CommonJS default exports into ESM can yield a namespace-like object; behaviour depends on whether the CommonJS module sets module.exports to a function/object.

5. package.json fields: type, exports, imports
- type: 'module' | 'commonjs' controls default interpretation of .js files within the package boundary.
- exports: object mapping entry subpaths to conditional exports; used by resolution algorithms to expose internal module entry points safely.
- imports: internal alias mappings for package-local import specifiers.

6. CLI flags and loader behaviour
- Node provides flags and runtime options that affect module loading; when evaluating scripts with node -e, specify --input-type=module to treat inline code as ESM.

SUPPLEMENTARY DETAILS:
- Migration patterns: adopt package.json type: 'module' as a package-wide opt-in or use .mjs for selective ESM files; update import paths to include extensions and convert require-based imports to dynamic import or createRequire-based bridges.
- Testing and tooling: configure bundlers/test-runners to resolve ESM semantics and support import.meta and top-level await.

REFERENCE DETAILS (SPEC):
- package.json: type: 'module' | 'commonjs'
- import.meta.url: string (file: URL)
- createRequire(from: string|URL): function for require-style resolution
- import(specifier: string): Promise<ModuleNamespace>
- export syntax: export default X; export const name = ...

DETAILED DIGEST:
Source: https://nodejs.org/api/esm.html
Retrieved: 2026-03-17
Data retrieved: 123.0 KB (HTML)
Extracted technical points: type field behaviour, explicit extensions for local imports, top-level await, import.meta.url, CommonJS interop patterns, exports/imports package.json fields.

ATTRIBUTION:
Content extracted and condensed from Node.js ESM documentation (URL above). Data size obtained during crawling: 123.0 KB.