NORMALISED EXTRACT

TABLE OF CONTENTS
1. package.json "type" field
2. File extensions and resolution
3. import/export syntax and patterns
4. CommonJS interop
5. __filename/__dirname and import.meta.url
6. Top-level await and dynamic import
7. exports and conditional exports

1. package.json "type" field
- package.json may include a top-level property "type" set to either "module" or "commonjs".
- If "type": "module", files with .js extension are treated as ES modules; if "type": "commonjs", .js files are treated as CommonJS.
- Use .mjs extension to force ESM regardless of package.json; use .cjs to force CommonJS regardless of package.json.

2. File extensions and resolution
- ESM resolution in Node uses file URLs and exact file extensions; when importing local files you must include the extension in import specifiers: import x from './file.js'
- Directory imports require an index file or package exports; import './dir' resolves to './dir/index.js' only if that file exists and resolution rules apply.

3. import/export syntax and patterns
- Use import defaultExport from 'module' and import { named } from 'module' for named exports.
- Export forms: export default expression; export const name = value; export function f() {}
- Live bindings: imports are live read-only views of exported bindings; mutating imported binding directly is not allowed; re-exporting supported: export { default as name } from './mod.js'

4. CommonJS interop
- CommonJS require is not available natively in ESM; to require a CJS module in ESM: import { createRequire } from 'module'; const require = createRequire(import.meta.url); const c = require('some-cjs')
- Exporting default from CommonJS module will appear on module.default when imported as ESM unless the package has an interop wrapper.
- To support both consumers, consider providing both ESM and CJS entry points using package.json "exports" and dual-packaging files with .cjs and .mjs/.js depending on "type".

5. __filename/__dirname and import.meta.url
- __filename and __dirname are not defined in ESM. To obtain equivalent values:
  - import { fileURLToPath } from 'url'
  - const __filename = fileURLToPath(import.meta.url)
  - const __dirname = path.dirname(__filename)
- Use import.meta.url to get the current module file URL.

6. Top-level await and dynamic import
- Top-level await is supported in Node ESM environments; await can be used at module top-level without wrapping in async function.
- Dynamic import: await import('./mod.js') returns a module namespace object; use for conditional or late loading.

7. exports and conditional exports
- package.json "exports" field controls module entry points and conditional exports for different environments (import vs require, node vs browser).
- Exact structure example: "exports": { ".": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" } }
- Use conditional exports to present separate ESM and CJS builds from a single package.

SUPPLEMENTARY DETAILS

Exact configuration options and effects
- package.json: "type": "module" treats .js as ESM; absence or "commonjs" treats .js as CJS.
- File naming: use .mjs for ESM forced mode; use .cjs for CJS forced mode.
- import resolution: local specifiers must include file extensions; bare specifiers resolve via node_modules package resolution algorithm.

REFERENCE DETAILS

Implementation patterns and signatures
- createRequire usage:
  - import { createRequire } from 'module'
  - const require = createRequire(import.meta.url)
  - const pkg = require('some-package')
- fileURLToPath usage:
  - import { fileURLToPath } from 'url'
  - const __filename = fileURLToPath(import.meta.url)
  - const __dirname = path.dirname(__filename)
- Dynamic import signature: await import(specifier: string): Promise<ModuleNamespace>

Troubleshooting
1. Error: Cannot use import statement outside a module -> ensure package.json type is "module" or use .mjs extension.
2. Error: Must use import to load ES Module -> use import() or rename file to .mjs or set "type":"module".
3. Missing file extension errors -> include .js/.mjs in local import specifiers.

DIGEST
- Source: Node.js ESM documentation (listed in SOURCES.md)
- Retrieval date: 2026-03-07
- Crawl size: 0 bytes downloaded in this run; content synthesised from source list and local knowledge.

ATTRIBUTION
- Sources: Node.js ESM docs (nodejs.org) as referenced in SOURCES.md