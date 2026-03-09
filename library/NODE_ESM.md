NORMALISED EXTRACT

Table of Contents:
1. ESM in Node.js: modes and package type
2. File specifiers and extensions
3. Import and export semantics
4. Interop with CommonJS
5. Loader hooks and experimental flags
6. Best practices

1. ESM in Node.js: modes and package type
- Node supports ECMAScript modules (ESM) when either the file has .mjs extension or package.json contains "type":"module" and files use .js extension.
- Without type:module, .js is treated as CommonJS by default; explicit extension or .mjs required for ESM.

2. File specifiers and extensions
- Import specifiers must be either relative or absolute or package specifiers; relative specifiers require file extensions (./util.js) unless a package exports map is defined.
- Directory imports require an index file or resolution via package exports.
- URL-style specifiers are supported in some contexts; file:// URLs can be used.

3. Import and export semantics
- import X from './x.js' and named imports behave according to ECMAScript module live bindings semantics.
- Top-level await is supported in ESM; modules can use await at top-level and the module evaluation will be asynchronous.
- Module caching: modules are cached by specifier after successful evaluation; multiple imports of same specifier share the same module instance.

4. Interop with CommonJS
- Importing CommonJS from ESM: default import receives the module.exports object as the default binding; named imports are undefined unless Node provides special statically analyzable exports.
- Exporting ESM to CommonJS: require() cannot directly import ESM; Node provides dynamic import() as recommended bridge.
- createRequire from module 'module' can be used to load CommonJS from an ESM context when needed.

5. Loader hooks and experimental flags
- Node provides loader hooks for custom resolve/transform (experimental; implementation-specific and can require --experimental-loader in older Node versions)
- Source maps and loaders may alter resolution behavior; prefer standard specifiers for portability

6. Best practices
- Use explicit file extensions in import specifiers to avoid resolution surprises
- Set "type":"module" in package.json for ESM-first projects, or use .mjs for mixed codebases
- Use import() dynamic import for runtime loading of ESM from both CJS and ESM contexts when needed

SUPPLEMENTARY DETAILS

Impact on tooling and packaging:
- Bundlers may rewrite specifiers; Node resolution rules matter for runtime-only code. Ensure package exports field aligns with built artifacts.
- When publishing packages provide both CJS and ESM entry points using exports map to enable both runtimes

REFERENCE DETAILS

Exact Node.js behaviors to implement:
- file type detection: if package.json.type === 'module' then .js files are ESM; otherwise .js are CommonJS
- import resolution: relative specifiers must include extension unless exports or index resolution applies
- top-level await: module evaluation returns a promise; consumers should await dynamic import() or rely on top-level evaluation order in ESM

DETAILED DIGEST

Source: https://nodejs.org/api/esm.html
Retrieved: 2026-03-09
Extracted technical content: package type handling, file extension requirements, import specifier rules, top-level await, interop patterns
Data size obtained: ~28 KB
Attribution: Node.js documentation
