TITLE: NODE_ESM

Table of contents:
1. Normalised extract (how Node resolves and runs ESM)
2. Supplementary details (package.json, extensions, top-level await)
3. Reference details (exact configuration and common resolution errors)
4. Troubleshooting & migration notes
5. Digest (source, retrieval date, bytes retrieved)
6. Attribution

1) Normalised extract (how Node resolves and runs ESM)
- Enabling ESM in Node.js:
  - Set package.json field "type": "module" to treat .js files as ESM.
  - Alternatively, use .mjs extension for ESM files when package.json does not set type: module.
- Import syntax in Node ESM requires file extensions for relative local imports: import { x } from './lib.js' (note: include .js).
- Top-level await is supported in ESM modules in modern Node releases; import.meta.url is available for module-specific URL resolution.
- CommonJS interop: require() is not available by default in ESM modules; to obtain require in ESM, use createRequire from the 'module' builtin.

2) Supplementary details (package.json, extensions, top-level await)
- package.json usage: setting "type": "module" in project root makes plain .js files be interpreted as ESM. Example JSON fragment: { "type": "module" }.
- Resolution and exports: Node resolves specifiers following the package exports map if present in package.json; an exports field restricts what paths consumers can import from the package.
- File-extension rules: when importing local files, include the extension (.js/.mjs/.cjs) to avoid ERR_MODULE_NOT_FOUND errors in Node ESM.
- createRequire pattern for interop: import { createRequire } from 'module'; const require = createRequire(import.meta.url); const pkg = require('some-cjs-package')

3) Reference details (exact configuration and common resolution errors)
- package.json: set "type": "module" or name individual files with .mjs to enable ESM parsing.
- Typical error patterns and fixes:
  - "Cannot use import statement outside a module": the file is loaded as CommonJS; fix by setting type: "module" or renaming to .mjs.
  - "ERR_MODULE_NOT_FOUND" when importing './file': include explicit extension './file.js'.
  - Default vs named import mismatches between CJS and ESM: inspect the package (module.exports vs exports) and use createRequire or adapt imports accordingly.
- Note: Node's package.json "exports" field may expose only specific entry points; trying to import a non-exported path will fail even if the file exists in package directory.

4) Troubleshooting & migration notes
- When migrating CommonJS to ESM, run unit tests frequently and verify import shapes; add small shims using createRequire where immediate migration is costly.
- For libraries consumed by both CJS and ESM, consider providing both CJS and ESM builds and using package.json "exports" to map consumer entry points.

5) Digest
- Source URL: https://nodejs.org/api/esm.html
- Retrieval date: 2026-03-21
- Bytes retrieved during crawl: 125511

6) Attribution
- Condensed from Node.js documentation (ECMAScript modules) retrieved 2026-03-21 (125511 bytes). Node.js docs: https://nodejs.org/
