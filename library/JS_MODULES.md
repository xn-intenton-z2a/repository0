MDN_MODULES

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
- package.json field: "type" accepts exactly two meaningful values: "module" or "commonjs". When "type":"module" is present at or above the package root, files with the .js extension are parsed as ECMAScript Modules (ESM). When absent or set to "commonjs", .js files are CommonJS. File extensions override this: .mjs = ESM, .cjs = CJS.
- Effect: the host resolver applies ESM parsing semantics, strict-mode by default for ESM, and validates import/export forms accordingly.

2. File extensions and resolution rules
- Extension behaviors: .mjs -> ESM; .cjs -> CJS; .js -> determined by package.json "type"; .json and .node follow host loader rules.
- Resolution rules: Relative specifiers (./, ../, /) resolve to file paths; bare specifiers (e.g., "lodash") use package resolution via node_modules, package.json "exports" or "main".
- When using browser ESM, prefer explicit file extensions in imports to avoid server-side inference issues.

3. Export forms (named, default, re-exports)
- Named export forms: export const name = value; export function fname(...) { ... }; export { local as exported }.
- Default export: export default expression; importer accesses as the module's default binding.
- Re-export: export { name } from 'module'; export * from 'module' (re-exports named exports except default); export { default as alias } from 'module'.
- Live binding rule: exported bindings are live and reflect updates performed by the exporter.

4. Import forms (static, namespace, dynamic)
- Static imports: import defaultExport from './mod.js'; import { name } from './mod.js'; import * as ns from './mod.js'; import './side-effect.js'.
- Dynamic import: import(specifier: string) -> Promise<ModuleNamespace>; resolves and evaluates asynchronously; ModuleNamespace exposes live bindings and a default property when present.
- Namespace objects are read-only views of exported bindings; cannot be reassigned by importers.

5. Live bindings and circular dependency behavior
- Live bindings: imports reference exported bindings, not copies; consumers see updates after exporter assignment.
- Circular import handling: modules execute following static dependency graph; if a binding is accessed before assignment, it may be observed as uninitialized (TDZ for const/let). Mitigate by deferring access to runtime calls or using factory functions.

6. Top-level await and execution timing
- Top-level await suspends module evaluation until the awaited promise settles; consumers importing that module will wait for resolution before dependent modules continue evaluation.
- Use only for intentional asynchronous initialization and ensure callers tolerate delayed readiness.

7. CommonJS interop rules
- ESM importing CJS: default import receives module.exports as the default binding; named imports are not mapped unless properties exist on module.exports.
- CJS requiring ESM: require cannot synchronously load ESM; use dynamic import bridges or wrapper CJS files that perform import().
- Shape differences: CJS allows mutation of module.exports; ESM provides live bindings from the exporter but an immutable namespace view to importers.

8. Loader, resolution and package exports
- package.json keys: "main" (legacy CJS entry), "module" (convention for ESM entry used by bundlers), "exports" (restricts and maps public subpaths), "type" (module detection).
- Exports mapping: "exports": { ".": "./lib/index.js", "./feature": "./lib/feature.js" } — importers can only resolve to declared export subpaths; unmatched subpaths throw a resolution error.
- Browser serving: serve ESM files with Content-Type: text/javascript; use <script type="module"> to enable module fetching semantics and strict mode.

9. Best practices and implementation patterns
- Prefer named exports to enable tree-shaking; reserve default exports for single-primary-export modules.
- Use explicit file extensions in import specifiers for browser compatibility: import './module.js'.
- Keep ESM/CJS mixing at package boundaries; provide dedicated bridge modules (.cjs/.mjs) rather than mixing formats in one file.
- Define public API via package.json "exports" to avoid accidental deep imports.
- Avoid circular initialization; if unavoidable, access via runtime functions rather than top-level reads.

10. Supplementary details (configuration keys and values)
- "type": "module" | "commonjs"
- "exports": object mapping allowed import subpaths to file paths or conditional objects
- "module": string (bundler ESM entry, convention only)
- "main": string (legacy CJS entry)

11. Reference details (exact syntax patterns and signatures)
- Imports:
  - import defaultExport from 'module-specifier'
  - import { name as alias } from 'module-specifier'
  - import * as ns from 'module-specifier'
  - import 'module-specifier'  // side-effect only
- Dynamic import:
  - import(specifier: string) -> Promise<ModuleNamespace>
  - ModuleNamespace: read-only live properties for each exported binding, plus default property if present
- Exports/public entry keys:
  - "type": "module" | "commonjs"
  - "exports": { ".": "./path", "./sub": "./subpath.js" }
  - "main": "./path.js"
  - "module": "./esm.js"

12. Digest and retrieval metadata
- Source extracted: developer.mozilla.org: JavaScript Guide — Modules
- Retrieval date: 2026-03-08 (crawl time: 2026-03-08T22:50:02.857Z)
- Extraction scope: module parsing semantics, syntax patterns, resolution mechanics, package.json fields, interop rules, and best practices needed to implement and publish ESM-compatible packages.

13. Attribution and data size
- Attribution: MDN Web Docs — JavaScript Guide: Modules (developer.mozilla.org)
- Extract size: ~12 KB of distilled technical content from the fetched page

End of MDN_MODULES
