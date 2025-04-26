# ECMASCRIPT_MODULES

## Crawl Summary
ECMAScript modules in Node.js are activated via file extension (.mjs), package.json type fields, or CLI flags. The resolution algorithm (ESM_RESOLVE) distinguishes between relative, bare, and absolute specifiers and determines the module format based on file extension (.mjs, .cjs, .json) and package.json. Core APIs include import.meta with properties (url, filename, dirname, resolve) and dynamic import() expressions. Node.js provides detailed package resolution functions (PACKAGE_RESOLVE, ESM_FILE_FORMAT) for handling bare specifiers and exports mappings.

## Normalised Extract
Table of Contents:
1. Introduction
   - Overview of ECMAScript modules, usage of import/export, and full interoperability with CommonJS.
2. Enabling Modules
   - Use .mjs extension, package.json "type": "module", or CLI flag --input-type=module.
3. Import Specifiers
   - Relative: './file.js', Bare: 'package' or 'package/sub', Absolute: 'file:///' URLs.
4. Mandatory File Extensions
   - Require explicit file extensions and directory index specification.
5. URLs and Special Schemes
   - Supported schemes: file:, node:, data:. Percent-encoding required for special characters.
6. Import Attributes
   - Syntax: import foo from './foo.json' with { type: 'json' }.
7. Built-in Modules & import() Expressions
   - Built-in Node.js modules provide named and default exports; dynamic import() returns a Promise.
8. import.meta Object
   - Properties: url (string), filename (string), dirname (string), resolve(specifier) returns string.
9. CommonJS Interoperability
   - ES modules import CommonJS with default export wrapping and module.createRequire for require.
10. JSON and Wasm Modules
    - JSON requires mandatory { type: 'json' } attribute; Wasm experimental flag usage.
11. Top-Level Await
    - Use of await at module top level with process exit code 13 if unresolved.
12. Loaders and Resolution Algorithm
    - Custom loader support. Detailed functions: ESM_RESOLVE, ESM_FILE_FORMAT, PACKAGE_RESOLVE, PACKAGE_EXPORTS_RESOLVE, and others.

Detailed Technical Topics:
1. ESM_RESOLVE(specifier, parentURL):
   - Input: specifier (string), parentURL (string).
   - Steps: URL parsing, relative resolution, bare specifier lookup via PACKAGE_RESOLVE.
   - Returns: Object with resolved URL string and module format (e.g., 'module', 'commonjs').
2. ESM_FILE_FORMAT(url):
   - Determines format based on extension (.mjs -> module, .cjs -> commonjs, .json -> json) and package type from package.json.
3. import.meta.resolve(specifier):
   - Synchronous method returning the absolute URL for a given specifier relative to the module.
4. Package Resolution Functions:
   - PACKAGE_RESOLVE: Resolves bare specifiers through package name extraction, node_modules lookup, and package.json "exports".
   - PACKAGE_EXPORTS_RESOLVE: Handles mapping of subpaths based on package.json exports field.
5. Configuration Options:
   - Use of --experimental-wasm-modules for WASM, --experimental-addon-modules for addon support.
   - CLI flag --input-type to force module type interpretation.
6. Best Practices & Troubleshooting:
   - Always specify file extensions; use import.meta for path resolution. Utilize module.createRequire in mixed environments. Validate package.json exports configuration to avoid resolution errors.
   - Troubleshooting: Use require.resolve replacement via import.meta.resolve; check for synchronous file system calls that may impact performance.

## Supplementary Details
Technical Specifications:
- Module Enabling:
  • .mjs and .cjs file extensions; package.json "type" field (module or commonjs); --input-type flag values 'module' or 'commonjs'.
- ESM_RESOLVE(specifier, parentURL):
  • Input: specifier (string), parentURL (string).
  • Process: If specifier is a URL, use it directly; if relative, resolve against parentURL; if bare, call PACKAGE_RESOLVE.
  • Errors: Invalid Module Specifier, Module Not Found, Unsupported Directory Import.
- ESM_FILE_FORMAT(url):
  • Returns 'module' for .mjs, 'commonjs' for .cjs, 'json' for .json, 'wasm' if flagged and .wasm, 'addon' for .node if enabled.
  • Fallback: Detect module syntax in source if no extension.
- import.meta API:
  • import.meta.url: string absolute file URL.
  • import.meta.filename: string full path (file: only).
  • import.meta.dirname: directory of current module.
  • import.meta.resolve(specifier): Synchronous resolution returning absolute URL string. Signature: function(specifier: string, parentURL?: string): string.
- Package Resolution:
  • PACKAGE_RESOLVE: Extracts packageName and subpath. Uses package.json "exports" field if available.
  • PACKAGE_EXPORTS_RESOLVE: Resolves main export and subpath exports based on conditions array ["node", "import"].
- Configuration:
  • Flags: --experimental-wasm-modules, --experimental-addon-modules
  • CLI usage: node --input-type=module filename.mjs
- Troubleshooting Procedures:
  • If facing resolution errors, verify package.json "exports" config.
  • Use console.log(import.meta.url) for debugging paths.
  • For synchronous resolution issues, ensure file existence before import.meta.resolve usage.
  • Check error messages: 'Invalid Module Specifier', 'Module Not Found', or 'Unsupported Directory Import'.

## Reference Details
API Specifications:
1. import.meta.resolve(specifier: string): string
   - Resolves a module specifier relative to the current module.
   - Throws if the target file does not exist or is a directory.

2. ESM_RESOLVE(specifier: string, parentURL: string): { format: string, resolved: string }
   - Steps: Check if specifier is a valid URL; if relative then URL resolution against parentURL; if bare then PACKAGE_RESOLVE.
   - Returns resolved URL and module format. Throws errors: Invalid Module Specifier, Module Not Found.

3. ESM_FILE_FORMAT(url: string): string
   - Logic: 
       if (endsWith('.mjs')) return 'module';
       else if (endsWith('.cjs')) return 'commonjs';
       else if (endsWith('.json')) return 'json';
       else if (experimental WASM and endsWith('.wasm')) return 'wasm';
       else if (experimental addon and endsWith('.node')) return 'addon';
       else detect module syntax or return package type from package.json.

4. PACKAGE_RESOLVE(packageSpecifier: string, parentURL: string): string
   - Extracts package name and subpath.
   - If packageSpecifier is a Node.js builtin, returns 'node:' + packageSpecifier.
   - Otherwise, perform iterative lookup through node_modules directories using URL resolution.

Sample SDK method signature for creating a require in ESM:
   - const require = module.createRequire(import.meta.url);

Code Example for import.meta usage:
   // Using import.meta.resolve
   const resolvedURL = import.meta.resolve('./dep.js');
   // Using dynamic imports
   const moduleExports = await import(resolvedURL);

Best Practices:
   - Always specify file extensions in import statements.
   - Use import.meta.url and import.meta.dirname for path resolution instead of __filename and __dirname.
   - For CommonJS interoperability, prefer default imports or use module.createRequire() if necessary.

Troubleshooting Commands:
   - Validate module paths: node --trace-warnings filename.mjs
   - Check file existence with fs.existsSync(path) before dynamic import.
   - Run Node.js with increased verbosity using NODE_DEBUG=module for detailed resolution logs.

Configuration Options and Defaults:
   - CLI flag --input-type: default determined by file extension unless overridden.
   - experimental flags: --experimental-wasm-modules, --experimental-addon-modules must be explicitly provided.
   - package.json "type": defaults to commonjs in absence of specification.

Detailed Step-by-Step Implementation Pattern:
   1. Set up package.json with "type": "module".
   2. Use .mjs file extension or specify --input-type=module on CLI.
   3. Use import statements with explicit file extensions.
   4. For CommonJS modules, use import cjs from './module.cjs' or module.createRequire(import.meta.url).
   5. Debug using import.meta.url to ensure paths resolve correctly.
   6. For dynamic resolving, call import.meta.resolve with the target specifier.


## Information Dense Extract
ESM enabled by .mjs, package.json type, or --input-type flag; specifiers: relative ('./file.js'), bare ('package/sub'), absolute ('file:///path'); require explicit file extensions; supported URL schemes: file:, node:, data:; import.meta: { url: string, filename: string, dirname: string, resolve(specifier: string): string }; ESM_RESOLVE(specifier, parentURL) returns { format, resolved }; ESM_FILE_FORMAT: (.mjs -> 'module', .cjs -> 'commonjs', .json -> 'json', .wasm -> 'wasm' if flagged, .node -> 'addon' if flagged); PACKAGE_RESOLVE extracts package name/subpath via node_modules lookup; Use module.createRequire(import.meta.url) for CJS interop; CLI flags: --experimental-wasm-modules, --experimental-addon-modules; troubleshooting: NODE_DEBUG=module, check file existence, validate package.json exports.

## Sanitised Extract
Table of Contents:
1. Introduction
   - Overview of ECMAScript modules, usage of import/export, and full interoperability with CommonJS.
2. Enabling Modules
   - Use .mjs extension, package.json 'type': 'module', or CLI flag --input-type=module.
3. Import Specifiers
   - Relative: './file.js', Bare: 'package' or 'package/sub', Absolute: 'file:///' URLs.
4. Mandatory File Extensions
   - Require explicit file extensions and directory index specification.
5. URLs and Special Schemes
   - Supported schemes: file:, node:, data:. Percent-encoding required for special characters.
6. Import Attributes
   - Syntax: import foo from './foo.json' with { type: 'json' }.
7. Built-in Modules & import() Expressions
   - Built-in Node.js modules provide named and default exports; dynamic import() returns a Promise.
8. import.meta Object
   - Properties: url (string), filename (string), dirname (string), resolve(specifier) returns string.
9. CommonJS Interoperability
   - ES modules import CommonJS with default export wrapping and module.createRequire for require.
10. JSON and Wasm Modules
    - JSON requires mandatory { type: 'json' } attribute; Wasm experimental flag usage.
11. Top-Level Await
    - Use of await at module top level with process exit code 13 if unresolved.
12. Loaders and Resolution Algorithm
    - Custom loader support. Detailed functions: ESM_RESOLVE, ESM_FILE_FORMAT, PACKAGE_RESOLVE, PACKAGE_EXPORTS_RESOLVE, and others.

Detailed Technical Topics:
1. ESM_RESOLVE(specifier, parentURL):
   - Input: specifier (string), parentURL (string).
   - Steps: URL parsing, relative resolution, bare specifier lookup via PACKAGE_RESOLVE.
   - Returns: Object with resolved URL string and module format (e.g., 'module', 'commonjs').
2. ESM_FILE_FORMAT(url):
   - Determines format based on extension (.mjs -> module, .cjs -> commonjs, .json -> json) and package type from package.json.
3. import.meta.resolve(specifier):
   - Synchronous method returning the absolute URL for a given specifier relative to the module.
4. Package Resolution Functions:
   - PACKAGE_RESOLVE: Resolves bare specifiers through package name extraction, node_modules lookup, and package.json 'exports'.
   - PACKAGE_EXPORTS_RESOLVE: Handles mapping of subpaths based on package.json exports field.
5. Configuration Options:
   - Use of --experimental-wasm-modules for WASM, --experimental-addon-modules for addon support.
   - CLI flag --input-type to force module type interpretation.
6. Best Practices & Troubleshooting:
   - Always specify file extensions; use import.meta for path resolution. Utilize module.createRequire in mixed environments. Validate package.json exports configuration to avoid resolution errors.
   - Troubleshooting: Use require.resolve replacement via import.meta.resolve; check for synchronous file system calls that may impact performance.

## Original Source
Node.js Official Documentation: ECMAScript Modules
https://nodejs.org/api/esm.html

## Digest of ECMASCRIPT_MODULES

# ECMASCRIPT_MODULES

# Introduction
Node.js supports ECMAScript modules (ESM) as the official standard for packaging JavaScript for reuse. Code is defined with import/export statements and supports both static and dynamic imports.

# Enabling
JavaScript is interpreted as an ES module by using:
- .mjs file extension,
- package.json with "type": "module",
- --input-type flag set to "module".

Conversely, CommonJS can be specified using .cjs or setting "type": "commonjs".

# Import Specifiers
There are three specifier types:
1. Relative specifiers: e.g., ./startup.js (file extension required).
2. Bare specifiers: e.g., some-package or some-package/shuffle, with file extension needed if no package "exports" field.
3. Absolute specifiers: e.g., file:///opt/nodejs/config.js.

Bare specifier resolution uses the Node.js module resolution algorithm.

# Mandatory File Extensions
Import statements require a file extension for relative or absolute paths. Directory indexes must be fully specified (e.g., ./startup/index.js).

# URLs and Schemes
Modules are resolved and cached as URLs. Supported schemes include:
- file:
- node:
- data:

Percent encoding is required for characters like '#' and '?'.

# Special Imports
- file: URLs: used for loading modules with query parameters.
- data: imports: supported for MIME types (text/javascript, application/json, application/wasm).
- node: imports: load Node.js built-in modules using valid absolute URL strings.

# Import Attributes
Inline syntax to pass additional options (e.g., { type: 'json' } for JSON modules).
Supported attribute in Node.js is type with mandatory usage for JSON imports.

# Built-in Modules and import() expressions
Built-in modules expose both named exports and a default export. The dynamic import() expression is supported in both CommonJS and ESM to load modules asynchronously.

# import.meta
The import.meta object is available only in ES modules and includes:
- import.meta.url: absolute file URL of the module.
- import.meta.filename: absolute filename with resolved symlinks (file: modules only).
- import.meta.dirname: directory name, equivalent to path.dirname(import.meta.filename).
- import.meta.resolve(specifier): synchronously resolves a module specifier from the current module.

# Interoperability with CommonJS
ES modules can import CommonJS modules, in which case the module.exports object becomes the default export. The module.createRequire() method can be used to construct a require function inside an ESM.

Key differences:
- No require, exports, module.exports in ESM.
- __filename and __dirname are replaced by import.meta.filename and import.meta.dirname.
- Addon loading and require.cache are not supported in ESM.

# JSON and Wasm Modules
- JSON modules require the { type: 'json' } attribute and only expose a default export.
- Wasm modules are experimental and require the --experimental-wasm-modules flag.

# Top-Level Await
Top-level await is supported in ESM. A never-resolving await expression will exit with code 13.

# Loaders and Resolution Algorithm
Custom loaders allow module resolution customization. The default resolution algorithm (ESM_RESOLVE) works as follows:
- If specifier is a URL, parse and reserialize.
- If relative (starting with '/', './', '../'), resolve against parentURL.
- If bare specifier, use PACKAGE_RESOLVE to resolve via node_modules and package.json exports.

The resolution algorithm returns an object with the resolved URL and suggested module format (e.g., "module", "commonjs", "json", "wasm", "addon").

# Detailed Resolution Functions
- ESM_RESOLVE(specifier, parentURL): Resolves module specifiers.
- ESM_FILE_FORMAT(url): Determines file format based on file extension and package.json "type" field.
- PACKAGE_RESOLVE, PACKAGE_SELF_RESOLVE, PACKAGE_EXPORTS_RESOLVE, PACKAGE_IMPORTS_RESOLVE: Detailed resolution routines that resolve custom package subpaths and handle exports/imports mappings.

# Version History (selected changes)
- v23.1.0: Import attributes no longer experimental.
- v14.8.0: Top-Level Await unflagged.
- v12.0.0: ES modules supported using .js via package.json "type".

Retrieved on: 2023-10-XX
Data Size: 3383348 bytes, Links Found: 1343

## Attribution
- Source: Node.js Official Documentation: ECMAScript Modules
- URL: https://nodejs.org/api/esm.html
- License: License if known: MIT
- Crawl Date: 2025-04-26T02:15:38.583Z
- Data Size: 3383348 bytes
- Links Found: 1343

## Retrieved
2025-04-26
