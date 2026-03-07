DOCUMENT: NODE_MODULES

NORMALISED EXTRACT

Table of contents:
1. Node.js module systems: CommonJS vs ESM
2. Determining module type rules
3. require() resolution algorithm (high-level)
4. Caching and caveats
5. require() interoperability with ESM
6. package.json fields affecting resolution
7. Creating and publishing Node modules (npm guidance)

1. Node.js module systems: CommonJS vs ESM
- Node.js supports CommonJS (require/exports/module.exports) and ECMAScript modules (import/export). Authors must choose how their package files are interpreted using extensions and package.json "type".

2. Determining module type rules
- File extensions:
  - .cjs => CommonJS
  - .mjs => ESM
  - .js => fall back to nearest package.json "type" ("module" => ESM, "commonjs" => CJS) or default CommonJS when no package.json in parents.
- Files with other extensions are treated depending on context; when included via require() they may be loaded as CommonJS.

3. require() resolution algorithm (high-level)
- Steps: check core modules; resolve as file (LOAD_AS_FILE), directory (LOAD_AS_DIRECTORY), package imports and node_modules search, package exports and imports fields. Key steps:
  - require(X) from Y: if X is core module, return built-in.
  - If X starts with './' or '/' use LOAD_AS_FILE and LOAD_AS_DIRECTORY attempts.
  - Else, perform package import resolution (LOAD_PACKAGE_IMPORTS/LOAD_PACKAGE_SELF) and node_modules traversal (NODE_MODULES_PATHS).
- LOAD_AS_FILE tries file, file.js, file.json, file.node; respects package.json "type" when deciding JS parsing.

4. Caching and caveats
- Modules are cached by resolved filename in require.cache; repeated require() returns same object reference.
- On case-insensitive filesystems or differing resolved filenames, same file can be loaded multiple times under different cache keys.
- Partially executed modules can be returned during circular dependencies. Use exported functions to defer execution for repeatable behavior.

5. require() interoperability with ESM
- require() can synchronously load ESM under conditions: module is synchronous (no top-level await) and either .mjs extension or nearest package.json "type"="module" or contains ESM syntax and no conflicting type field.
- When require() loads an ESM, it returns the module namespace object; default export appears under .default property.
- Special export name "module.exports" can be used in ESM to control value returned to CommonJS require() consumers, but using it may lose named exports for CommonJS consumers.
- If ESM contains top-level await, require() will throw ERR_REQUIRE_ASYNC_MODULE; use dynamic import() instead.

6. package.json fields affecting resolution
- "type": "module" | "commonjs"
- "main": CommonJS entry
- "module": ES module entry (optional)
- "exports": conditional exports mapping (use to present different entrypoints to ESM vs CJS and limit internal paths)
- "imports": package imports map for internal bare specifiers (starts with '#')

7. Creating and publishing Node modules (npm guidance)
- Steps to create package.json: run npm init and set required fields: name, version, main.
- Provide a file corresponding to "main" that populates exports object: exports.printMsg = function() { ... }
- To test local install: publish or use npm pack and install in another directory, then require and run.
- Publishing requires 2FA or tokens per npm policy; for private packages use npm publish; for scoped public packages use npm publish --access public.

SUPPLEMENTARY DETAILS

Implementation and packaging patterns:
- Provide both CommonJS and ESM entrypoints using package.json "exports" field to map different conditions: e.g., "exports": {"import": "./dist/index.mjs", "require": "./dist/index.cjs"}.
- When building, produce both ./dist/index.mjs (ESM) and ./dist/index.cjs (CJS) and ensure exports mapping points correctly.
- Use the "module" field for bundlers that prefer ES module entrypoints; use "main" for CommonJS consumers.

require() troubleshooting and fixes:
- ERR_REQUIRE_ASYNC_MODULE -> use dynamic import() for modules that use top-level await or remove top-level await.
- Module not found -> ensure correct package.json "exports" mapping or correct module specifier path; for bare specifiers in browsers, use import maps.
- Duplicate module instances -> resolve path consistency, avoid differing casing, symlinks, or multiple node_modules copies.

REFERENCE DETAILS (API, signatures, configuration)

require(moduleId) -> any
- moduleId: string (core module name, relative path, absolute path, or package name)
- Resolution: core modules -> built-in; path-like -> LOAD_AS_FILE/LOAD_AS_DIRECTORY; package name -> NODE_MODULES_PATHS and package.exports resolution

package.json fields
- "type": "module" | "commonjs" — determines default interpretation of .js files
- "main": string — entry point for CommonJS consumers
- "module": string — optional entrypoint for ES module-aware bundlers
- "exports": object — conditional exports mapping; keys may be "." or "./subpath" and values can be objects with conditions (import, require, default)
- "imports": object — package import aliases for internal resolution; keys start with '#'

Node resolution pseudocode summary (LOAD_AS_FILE, LOAD_AS_DIRECTORY)
- LOAD_AS_FILE(X): try X, X.js, X.json, X.node; for .js files use package scope "type" to decide ESM vs CJS when loading
- LOAD_AS_DIRECTORY(X): if X/package.json has "main" field, resolve that via LOAD_AS_FILE; else try X/index.js

DETAILED DIGEST

Sources referenced (from SOURCES.md):
- Node.js Modules documentation (nodejs.org/api/modules.html) — retrieved 2026-03-07
- npm docs: Creating Node.js modules (docs.npmjs.com) — retrieved 2026-03-07
Data retrieved on: 2026-03-07T03:59:20.633Z
Approximate data size fetched for these Node/npm pages: ~28 KB combined

ATTRIBUTION
Content condensed from nodejs.org and docs.npmjs.com pages; retrieved 2026-03-07.

END OF DOCUMENT
