NORMALISED EXTRACT

Table of Contents:
1. module.exports vs export
2. exports resolution in Node.js
3. package.json "type" and file extensions
4. CommonJS and ESM interop

1. module.exports vs export
- CommonJS: module.exports = value; exports.name = value; require() returns module.exports.
- ESM: export and export default produce live bindings; import statements are static.

2. exports resolution in Node.js
- Node resolves module specifiers using algorithm: exact file matches, extensions (.js, .json, .node), package.json "exports" field, index files in directories.
- For bare specifiers, Node resolves via node_modules lookup using package.json "exports" and "main" fields.

3. package.json "type" and file extensions
- package.json "type": "module" makes .js files parsed as ESM; otherwise .js parsed as CommonJS. Use .mjs for explicit ESM when "type" not set.
- "exports" field allows package authors to restrict entry points and conditional exports for different environments (node, import, require).

4. CommonJS and ESM interop
- When CJS require imports ESM, Node performs synthetic default export wrapping; when ESM imports CJS, module's exports are treated as namespace with default mapping to module.exports.
- Transpilers may emulate ESM live bindings in CJS by defining getters on exports object to approximate semantics.

SUPPLEMENTARY DETAILS

Technical specifications and implementation details:
- Resolution algorithm: file URL resolution, path normalization, package scope boundaries, node_modules traversal up directories until root.
- "exports" conditional exports syntax: exports: {".": {"import":"./esm.js","require":"./cjs.js"}}; resolves by import type.
- Loading phases: resolve, load (module format detection), instantiate, evaluate.

REFERENCE DETAILS

Exact configuration patterns:
- package.json snippet: { "type": "module", "main": "dist/index.cjs", "exports": { ".": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" } } }
- Use require('pkg') in CJS to receive module.exports bound; use import pkg from 'pkg' in ESM to receive default if available.

TROUBLESHOOTING

- If import fails with ERR_REQUIRE_ESM, ensure target file is ESM or use dynamic import() from CJS.
- If package entry not found, check exports mapping and file paths relative to package root.

DIGEST

Source: https://nodejs.org/api/modules.html#modules_exports
Retrieved: 2026-03-09
Size: small (Node.js docs page)

ATTRIBUTION

Content adapted from Node.js documentation (nodejs.org) and packaging specification. Data size: ~1 page equivalent.