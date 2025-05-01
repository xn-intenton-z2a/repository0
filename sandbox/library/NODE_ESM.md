# NODE_ESM

## Crawl Summary
Node.js ESM documentation details explicit mechanisms to enable ECMAScript modules by using .mjs extensions, package.json configuration, and command-line flags. It specifies different import specifiers (relative, bare, absolute) with mandatory file extensions and URL encoding requirements. The documentation outlines import attributes syntax for JSON, the usage of built-in modules, dynamic import expressions, import.meta properties (dirname, filename, url, resolve), interoperability with CommonJS, JSON module handling (with mandatory type: 'json'), WASM module support under experimental flags, top-level await semantics, and comprehensive resolution algorithms (ESM_RESOLVE, PACKAGE_RESOLVE, etc.) with detailed error handling.

## Normalised Extract
Table of Contents:
1. ECMAScript Modules Fundamentals
   - Definition, export and import statements usage.
   - Example: function addTwo(num) { return num + 2; } and its import usage.
2. Enabling ESM in Node.js
   - Marking files with .mjs or package.json "type": "module".
   - Use of --input-type flag.
3. Import Specifiers
   - Relative: requires explicit file extension (./file.mjs).
   - Bare: resolved via node_modules and package exports.
   - Absolute: full file URL such as file:///path/to/file.
4. File and URL Handling
   - All modules resolved as URLs; special characters must be percent-encoded.
   - Directory indexes must be fully specified (e.g. ./folder/index.js).
5. Import Attributes
   - Syntax: import fooData from './foo.json' with { type: 'json' }.
   - Mandatory when importing JSON modules.
6. Built-in Modules and Dynamic Import
   - Import built-in modules using node: prefix (e.g. import fs from 'node:fs').
   - Dynamic import() works in both ESM and CommonJS for loading modules asynchronously.
7. import.meta Properties
   - import.meta.dirname: returns directory of current module (string).
   - import.meta.filename: returns full absolute filename (string).
   - import.meta.url: returns absolute file URL (string).
   - import.meta.resolve(specifier): synchronously returns resolved module URL as a string.
8. Interoperability with CommonJS
   - ES modules can import CommonJS modules; module.exports is treated as default export.
   - module.createRequire() allows CommonJS require() within ES modules.
9. JSON and WASM Modules
   - JSON import requires with { type: 'json' } and only exposes a default export.
   - WASM modules import under --experimental-wasm-modules flag.
10. Top-Level Await
    - Use await at module top-level. If unresolved, process exits with code 13.
11. Loaders and Resolution Algorithms
    - ESM_RESOLVE returns module format and resolved URL based on file extension (.mjs => module, .cjs => commonjs, .json => json, etc.).
    - Detailed procedures for PACKAGE_RESOLVE, PACKAGE_EXPORTS_RESOLVE, and error checking (Invalid Module Specifier, Module Not Found, etc.).

## Supplementary Details
Exact Specifications:
- Markers: .mjs extension, package.json "type": "module", --input-type=module for enabling ESM; .cjs or "commonjs" for CommonJS.
- URL Requirements: Must use file:, node:, data: schemes; percent-encoding required for special characters (e.g. '#' to %23).
- import Attributes: Syntax 'with { type: "json" }' is required when importing JSON modules. Supported for type attribute only.
- import.meta APIs:
  * import.meta.dirname (string) - available since v21.2.0 and v20.11.0 (release candidate stability 1.2).
  * import.meta.filename (string) - same version and stability as dirname.
  * import.meta.url (string) - analogous to browser environment.
  * import.meta.resolve(specifier: string, parent?: string|URL): string - available from v16.2.0 with synchronous return; supports WHATWG URL objects.
- Resolution Algorithms:
  * ESM_RESOLVE(specifier, parentURL) returns { format, resolved }.
  * ESM_FILE_FORMAT: Determines format based on file extension (.mjs => "module", .cjs => "commonjs", .json => "json", .wasm under flag => "wasm", .node under addon flag => "addon").
  * PACKAGE_RESOLVE and PACKAGE_EXPORTS_RESOLVE provide fallback resolution, throwing errors such as Invalid Module Specifier, Module Not Found, or Unsupported Directory Import.
- Command-line flags: --experimental-wasm-modules; --experimental-addon-modules; --experimental-import-meta-resolve for additional parameters.
- Version History: Notable changes in v23.1.0 (import attributes stable), v22.0.0 (dropped import assertions), v17.1.0 (added experimental import assertions support), etc.
- Error Handling: Synchronous resolution errors include Invalid Module Specifier errors (if URL contains illegal characters) and Unsupported Directory Import errors if the resolved path is a directory.
- Troubleshooting: Verify file paths and extensions; ensure package.json is correctly configured; use module.createRequire() for CommonJS fallback; run Node.js with correct flags for experimental features.

## Reference Details
API Specifications and Code Examples:
1. import.meta.resolve(specifier: string, parent?: string|URL): string
   - Parameters: specifier (string) - module specifier to resolve; parent (optional string or URL) - base URL for resolution (defaults to import.meta.url).
   - Return: A string representing the fully resolved file URL.
   - Example Usage:
     // In an ES module file:
     const resolvedUrl = import.meta.resolve('./dep.js');
     // resolvedUrl might return: file:///app/dep.js

2. module.createRequire(import.meta.url): requireFunction
   - Description: Creates a CommonJS require function to load modules using CommonJS resolution from an ES module context.
   - Returns: A function that works like require in CommonJS modules.
   - Example Usage:
     import { createRequire } from 'module';
     const require = createRequire(import.meta.url);
     const cjsModule = require('./cjs.cjs');

3. Dynamic import() Expressions:
   - Syntax: import(specifier)
   - Returns: A Promise resolving to the module object.
   - Example Usage:
     import('./module.mjs').then(module => {
       module.myFunction();
     });

4. Built-In Modules Import:
   - Example: 
     import fs, { readFileSync } from 'node:fs';
     import { Buffer } from 'node:buffer';
     fs.readFileSync = () => Buffer.from('Hello, ESM');
     // Sync exporting built-in functions using module.syncBuiltinESMExports();

5. Top-Level Await Example:
   - Example: 
     // a.mjs
     export const five = await Promise.resolve(5);
     // b.mjs
     import { five } from './a.mjs';
     console.log(five);  // Outputs: 5

6. Resolution Algorithm Patterns:
   - ESM_RESOLVE(specifier, parentURL): Checks if specifier is a valid URL, then resolves relative specifiers or bare specifiers via PACKAGE_RESOLVE.
   - ESM_FILE_FORMAT(url): Returns the module format based on file extension. Throws an error if format is unrecognized.
   - Troubleshooting Procedures:
     * Check that file extensions are according to module standards (.mjs, .json, .cjs).
     * For module not found errors, verify the existence of the file and correct URL encoding.
     * Use --experimental flags when dealing with WASM or addon modules and confirm that package.json "type" field is set appropriately.

7. Configuration Options:
   - In package.json, set "type": "module" for ESM and "commonjs" for CommonJS.
   - Command-line flags:
       --input-type=module
       --experimental-wasm-modules
       --experimental-addon-modules
       --experimental-import-meta-resolve (with parent parameter support)

8. Best Practices:
   - Always specify file extensions in import statements.
   - Use import.meta.url with url.pathToFileURL for path resolution.
   - For interoperability, use module.createRequire() when accessing legacy CommonJS modules.
   - Ensure proper error handling when using top-level await to catch unresolved promises.

9. Detailed Troubleshooting Commands:
   - To diagnose module resolution issues, enable verbose logging in Node.js using environment variable NODE_DEBUG=module.
   - Use command: node --input-type=module yourFile.mjs to test ESM behavior.
   - Check for common errors: "Invalid Module Specifier" if special characters are not percent-encoded, or "Module Not Found" if file paths are incorrect.
   - For issues with import.meta.resolve, verify that the parent argument is a valid absolute URL.


## Information Dense Extract
ESM enabled via .mjs, package.json "type": "module", --input-type flag; Import Specifiers: Relative (./file.mjs), Bare (package-name), Absolute (file:///path); URLs require percent-encoding; Import Attributes: with { type: 'json' } mandatory for JSON; import.meta properties: dirname, filename, url, resolve(specifier) synchronous; Dynamic import() returns Promise; module.createRequire(import.meta.url) for CJS interop; Resolution Algorithms: ESM_RESOLVE, ESM_FILE_FORMAT (.mjs=module, .cjs=commonjs, .json=json, .wasm=wasm, .node=addon under flags); Error tests: Invalid Module Specifier, Module Not Found; Flags: --experimental-wasm-modules, --experimental-addon-modules; API examples provided for import.meta.resolve and dynamic import() usage.

## Sanitised Extract
Table of Contents:
1. ECMAScript Modules Fundamentals
   - Definition, export and import statements usage.
   - Example: function addTwo(num) { return num + 2; } and its import usage.
2. Enabling ESM in Node.js
   - Marking files with .mjs or package.json 'type': 'module'.
   - Use of --input-type flag.
3. Import Specifiers
   - Relative: requires explicit file extension (./file.mjs).
   - Bare: resolved via node_modules and package exports.
   - Absolute: full file URL such as file:///path/to/file.
4. File and URL Handling
   - All modules resolved as URLs; special characters must be percent-encoded.
   - Directory indexes must be fully specified (e.g. ./folder/index.js).
5. Import Attributes
   - Syntax: import fooData from './foo.json' with { type: 'json' }.
   - Mandatory when importing JSON modules.
6. Built-in Modules and Dynamic Import
   - Import built-in modules using node: prefix (e.g. import fs from 'node:fs').
   - Dynamic import() works in both ESM and CommonJS for loading modules asynchronously.
7. import.meta Properties
   - import.meta.dirname: returns directory of current module (string).
   - import.meta.filename: returns full absolute filename (string).
   - import.meta.url: returns absolute file URL (string).
   - import.meta.resolve(specifier): synchronously returns resolved module URL as a string.
8. Interoperability with CommonJS
   - ES modules can import CommonJS modules; module.exports is treated as default export.
   - module.createRequire() allows CommonJS require() within ES modules.
9. JSON and WASM Modules
   - JSON import requires with { type: 'json' } and only exposes a default export.
   - WASM modules import under --experimental-wasm-modules flag.
10. Top-Level Await
    - Use await at module top-level. If unresolved, process exits with code 13.
11. Loaders and Resolution Algorithms
    - ESM_RESOLVE returns module format and resolved URL based on file extension (.mjs => module, .cjs => commonjs, .json => json, etc.).
    - Detailed procedures for PACKAGE_RESOLVE, PACKAGE_EXPORTS_RESOLVE, and error checking (Invalid Module Specifier, Module Not Found, etc.).

## Original Source
Node.js ECMAScript Modules Documentation
https://nodejs.org/api/esm.html

## Digest of NODE_ESM

# Introduction
Node.js fully supports ECMAScript modules (ESM) as the official standard format to package JavaScript code for reuse. The documentation details explicit markers (such as .mjs extension, package.json "type": "module", or the --input-type flag) to enable ESM and explains interoperability with CommonJS modules.

# Enabling ESM in Node.js
- Use the .mjs extension or set "type": "module" in package.json.
- Alternatively, use the --input-type flag with value "module" to instruct Node.js to treat code as an ES module.
- Conversely, specify CommonJS with .cjs, "type": "commonjs" or --input-type commonjs.

# Import Specifiers
- Three types: Relative (e.g. ./file.mjs), Bare (e.g. some-package), and Absolute (e.g. file:///opt/nodejs/config.js).
- Bare specifiers are resolved using Node.js module resolution algorithm with node_modules lookup.
- A file extension is required for relative or absolute specifiers.

# URLs and File Loading
- ES modules are resolved as URLs. Special characters must be percent-encoded.
- Supported URL schemes: file:, node:, and data: URL schemes.
- file: URLs require full specification including directory indexes (e.g. ./startup/index.js).
- data: URLs support MIME types text/javascript, application/json, and application/wasm.

# Import Attributes
- Inline syntax to provide additional information when importing modules (e.g. import foo from './foo.json' with { type: 'json' }).
- The attribute "type: 'json'" is mandatory for JSON modules.

# Built-In Modules and Dynamic Import
- Built-in modules expose named exports and a default export pointing to module.exports (for backwards compatibility with CommonJS).
- Dynamic import() expressions are supported in both ESM and CommonJS contexts.

# import.meta Properties
- import.meta is an object available only in ES modules with properties:
  * import.meta.dirname: Directory of the current module (similar to path.dirname(import.meta.filename)).
  * import.meta.filename: Absolute file path resolving symlinks.
  * import.meta.url: The absolute file URL of the current module.
  * import.meta.resolve(specifier): Synchronously resolves and returns the absolute URL string for a module specifier (supports WHATWG URL objects and is not behind experimental flag in Node.js v20.6.0+).

# Interoperability with CommonJS
- ES modules can import CommonJS modules where module.exports becomes the default export.
- The use of module.createRequire() is recommended to access CommonJS behavior from within an ES module.
- CommonJS-specific globals such as __filename and __dirname are replaced by import.meta.filename and import.meta.dirname.

# JSON and WASM Modules
- JSON modules require explicit import with { type: 'json' } and provide only a default export.
- WASM modules can be imported under the --experimental-wasm-modules flag. Their integration aligns with the ES Module Integration Proposal.

# Top-Level Await
- Top-level await is supported, enabling asynchronous module loading. If a top-level await never resolves, Node.js exits with status 13.

# Loaders and Resolution Algorithms
- The default resolver implements fileURL-based resolution with no default extensions.
- Detailed resolution algorithms include ESM_RESOLVE, PACKAGE_RESOLVE, PACKAGE_EXPORTS_RESOLVE, and ESM_FILE_FORMAT.
- ESM_RESOLVE determines the absolute URL and module format (e.g. "module", "commonjs", "json", "wasm", or "addon") based on file extension and package.json type field.
- Errors include Invalid Module Specifier, Module Not Found, and Unsupported Directory Import.
- The resolution algorithm supports conditional exports and package customization hooks.

Retrieved on 2023-10-05. Data Size: 4348342 bytes. Attribution: Node.js v23.11.0 documentation.

## Attribution
- Source: Node.js ECMAScript Modules Documentation
- URL: https://nodejs.org/api/esm.html
- License: License: OpenJS Foundation (documentation under Node.js project license)
- Crawl Date: 2025-05-01T22:19:06.214Z
- Data Size: 4348342 bytes
- Links Found: 5345

## Retrieved
2025-05-01
