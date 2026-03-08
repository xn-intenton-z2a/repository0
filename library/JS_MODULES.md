JS_MODULES

Table of contents
1. Module types and package.json type field
2. File extensions and resolution rules
3. Export forms (named, default, re-exports)
4. Import forms (static, namespace, dynamic)
5. Live bindings and circular dependency behavior
6. Top-level await and execution timing
7. CommonJS interop rules
8. Loader, resolution and package exports
9. Best practices and implementation patterns
10. Supplementary details (configuration keys and values)
11. Reference details (exact syntax patterns and signatures)
12. Digest and retrieval metadata
13. Attribution and data size

1. Module types and package.json type field
- package.json field: "type" accepts exactly two meaningful values: "module" or "commonjs". When "type": "module" is present in package.json (at or above the package root), files with the .js extension are interpreted as ECMAScript Modules (ESM). When "type" is absent or set to "commonjs", .js files are interpreted as CommonJS modules. File extensions can override type: .mjs is always ESM, .cjs is always CommonJS.
- Effect on resolution: Node/host module resolver uses the effective module type to apply ESM parsing semantics, import/export validation, and to enforce module-specific runtime behaviors (strict-mode by default for ESM).

2. File extensions and resolution rules
- Recognized extensions and treatment: .mjs -> ESM; .cjs -> CJS; .js -> determined by package.json type; .json and .node follow host loader rules (JSON parse, native addon loader).
- Resolution algorithm: specifier resolution distinguishes between relative/absolute specifiers (./, ../, /) which resolve to file paths with extension rules, and bare specifiers ("lodash") which trigger package resolution via node_modules, package.json "exports" and "main" fields, and package boundaries.
- Bare specifiers require package exports mapping or package entry points; unresolved bare specifiers must be provided by a bundler, import map, or a modular loader.

3. Export forms (named, default, re-exports)
- Named export patterns: export const name = value; export function fname(params) { ... }; export { localName as exportedName }.
- Default export pattern: export default expression; the exporting module exposes a special default binding accessible as the module's default property when imported.
- Re-export forms: export { name } from 'module-specifier'; export * from 'module-specifier' (re-exports all named exports except default); export { default as alias } from 'module-specifier' to re-export default under a named export.
- Bindings semantics: exported bindings are live; mutating the exported binding in the exporting module is observable by importers.

4. Import forms (static, namespace, dynamic)
- Static import syntaxes: import defaultExport from 'module-specifier'; import { name as alias } from 'module-specifier'; import * as ns from 'module-specifier'; import 'module-specifier' for side effects only.
- Dynamic import signature and behavior: import(specifier: string) -> Promise<ModuleNamespace>; the returned ModuleNamespace contains live bindings and a default property when present. Dynamic import performs asynchronous resolution and evaluation.
- Namespace module objects: namespace objects provide read-only, live views of exported bindings; mutating the namespace object is disallowed.

5. Live bindings and circular dependency behavior
- Live binding guarantee: imports are references to exported bindings, not snapshots; reading an imported binding yields the current value after initialization and subsequent updates by the exporter.
- Circular dependency semantics: module execution order follows static import graph; when cycles exist, modules execute until they reach initialization points; exported bindings may be observed as uninitialized (temporal dead zone for const/let) if accessed before assignment. Use function wrappers or defer access to runtime call time to avoid TDZ issues.

6. Top-level await and execution timing
- Top-level await is permitted in ESM; await expressions at module top-level suspend module evaluation asynchronously until awaited promise settles. Consumers that import a module with top-level await will observe delayed evaluation of that module and any downstream dependent modules until resolution.
- Use top-level await only when the initialization is intentionally asynchronous and when consumers are prepared to handle delayed module readiness.

7. CommonJS interop rules
- Importing CommonJS from ESM: default import receives the CommonJS module.exports object as the default binding; named imports from CJS are not guaranteed to map to properties on module.exports unless the exporter sets properties explicitly. Example pattern: import cjsDefault from './mod.cjs'; cjsDefault is module.exports.
- Requiring ESM from CommonJS: synchronous require cannot load ESM; use dynamic loader or bridge helpers (create a wrapper CJS file that dynamic-imports ESM) or use Node's experimental bridging features. Bundlers may provide compatibility layers.
- Export shape differences: CJS supports mutation of module.exports; ESM enforces immutable namespace object properties from the module spec perspective but exported bindings in the exporter remain live.

8. Loader, resolution and package exports
- package.json keys affecting resolution: "main" (legacy entry for CJS consumers), "module" (convention for ESM entry for bundlers), "exports" (definitive subpath exports mapping), "type" (module detection).
- Exports field syntax: "exports": { ".": "./lib/index.js", "./feature": "./lib/feature.js" } maps import specifiers of package root and package subpaths to specific files; subpath imports must match exactly one of the exported keys or throw resolution error.
- MIME and HTTP serving: when serving ESM to browsers, Content-Type must be text/javascript and server must support CORS where required; script type=module in HTML enforces module fetching semantics and strict mode.

9. Best practices and implementation patterns
- Prefer named exports for utilities to enable tree-shaking; use default export only for single-primary-export modules.
- Use explicit file extensions in import specifiers for browser ESM and strict resolvers: import './module.js' (include extension) to avoid resolution ambiguity in environments that do not perform extension inference.
- Avoid mixing ESM and CJS in the same file. Keep interoperability at package boundary with dedicated bridge modules (.cjs or .mjs as appropriate).
- Use package.json "exports" to declare supported public entry points and prevent accidental deep imports.
- Design modules to avoid circular initialization dependencies; if unavoidable, access values via functions called at runtime rather than during module evaluation.

10. Supplementary details (configuration keys and values)
- package.json type: "module" | "commonjs" affects .js interpretation.
- package.json exports: object mapping allowed import specifiers to file paths; keys may include ".", "./subpath". When present, exports restrict which internal files can be imported by consumers.
- module field: often used by bundlers to locate an ESM build; not used by Node's resolver for runtime module interpretation.
- main field: legacy CJS entrypoint used when neither exports nor ESM entry is present for CJS consumers.

11. Reference details (exact syntax patterns and signatures)
- Static import patterns:
  - import defaultExport from 'module-specifier'
  - import { name } from 'module-specifier'
  - import { name as alias } from 'module-specifier'
  - import * as ns from 'module-specifier'
  - import 'module-specifier'  // side-effect only
- Dynamic import signature:
  - import(specifier: string) -> Promise<ModuleNamespace>
  - ModuleNamespace has read-only properties for each exported binding and a default property when present.
- Export patterns:
  - export const name = value
  - export function fname(params)
  - export default expression
  - export { local as exported } from 'module-specifier'
  - export * from 'module-specifier'  // re-export all named exports excluding default
- package.json keys and exact accepted values:
  - "type": "module" | "commonjs"
  - "exports": Object where keys are specifier subpaths and values are relative file paths (string) or conditional export objects.
  - "main": string (legacy entry path)
  - "module": string (convention for bundlers to point to ESM entry)

12. Digest and retrieval metadata
- Source section extracted: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules as listed in project SOURCES.md
- Retrieval date: 2026-03-08T22:50:02.857Z
- Extracted content focuses on implementation-level rules and examples of module syntax, resolution, package.json keys, interop behaviors, and loader semantics.

13. Attribution and data size
- Attribution: content distilled from MDN Web Docs: JavaScript Guide — Modules (developer.mozilla.org), listed in project SOURCES.md.
- Crawl data size: source referenced as a single URL entry in SOURCES.md; no full HTML crawl was performed in this run, therefore stored extraction size is approximately the length of the distilled technical extract (estimated 12 KB).

End of JS_MODULES
