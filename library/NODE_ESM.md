NODE_ESM

Table of contents
- Overview and motivation
- File/Package-level configuration (type field)
- Module resolution and import semantics
- Export forms and interop with CommonJS
- Entry points, loaders, and experimental flags
- Implementation details and best practices
- Troubleshooting and migration checklist
- Digest and attribution

Overview and motivation
- Node.js implements ECMAScript Modules (ESM) to support import/export standard module syntax in JavaScript
- ESM semantics differ from CommonJS: static imports, asynchronous module evaluation, and strict-mode by default

File/Package-level configuration
- package.json "type" field: "module" treats .js files as ESM; "commonjs" treats .js files as CommonJS
- Use .mjs extension to force ESM regardless of package type; use .cjs for CommonJS

Module resolution and import semantics
- import paths are resolved according to spec: relative imports require ./ or ../; bare specifiers require package resolution
- Node supports conditional exports in package.json to map specifiers to different entrypoints based on environment
- Top-level await allowed in ESM contexts

Export forms and interop
- ESM uses 'export' and 'export default'. CommonJS uses module.exports / exports.
- Interop caveats: importing CommonJS default-exports into ESM results in a default namespace object; use import pkg from 'pkg' and inspect pkg.default if necessary
- Prefer publishing dual packages (exports field) or using explicit interop helpers when targeting both environments

Entry points, loaders, and flags
- Entrypoint resolution: package.json "exports" and "main" influence which file is loaded
- Custom loaders (loader hooks) exist for advanced use; consult Node docs for current stable APIs

Implementation details and best practices
- Prefer consistent extension and package.type to avoid ambiguous loading rules
- Use explicit file extensions in import specifiers when targeting Node (e.g., import x from './mod.js')
- Test both Node and bundler environments when shipping libraries

Troubleshooting and migration checklist
- Common errors: "Must use import to load ES Module" occurs when requiring an ESM file from CommonJS
- Check package.json type field, file extensions, and exports mapping

Digest
- Source: Node.js ESM documentation
- Retrieved: 2026-03-14

Attribution and data size
- URL: https://nodejs.org/api/esm.html
- Crawl size: 125992 bytes
