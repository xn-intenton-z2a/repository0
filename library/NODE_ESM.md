# NODE_ESM

## Crawl Summary
ECMAScript modules in Node.js use .mjs extension or package.json type: module. Detailed resolution algorithm (ESM_RESOLVE) determines URL and module format based on file extensions. Import meta properties include url, filename, dirname, and resolve(specifier). Supports relative, bare, and absolute specifiers, data: and node: imports, JSON and WASM module handling including mandatory import attributes. Includes error handling for invalid specifiers, package configuration, and module not found errors.

## Normalised Extract
TABLE OF CONTENTS:
1. Introduction
2. Enabling ECMAScript Modules
3. Import Specifiers and Mandatory File Extensions
4. URL Resolution and Data/Node Imports
5. Import Attributes and Built-in Modules
6. import() Expressions and import.meta API
7. CommonJS Interoperability
8. JSON and WASM Modules
9. Top-Level Await
10. Loaders and Resolution Algorithm
11. Customizing Specifier Resolution

1. Introduction: Modules defined with import/export; official ESM format in Node.js.
2. Enabling ECMAScript Modules: Use .mjs extension, package.json property "type": "module", or CLI flag --input-type=module; conversely use .cjs or "commonjs" for CommonJS.
3. Import Specifiers and Mandatory File Extensions: Relative, bare, and absolute specifiers require explicit file extensions; directory indexes must be fully specified.
4. URL Resolution and Data/Node Imports: Modules resolved as URLs; file:, node:, and data: schemes supported; percent encoding for special characters.
5. Import Attributes and Built-in Modules: Use import attributes such as { type: 'json' } to import JSON; built-in modules expose both default and named exports.
6. import() Expressions and import.meta API: Dynamic import() available; import.meta provides metadata (url, filename, dirname, resolve) with specific behaviors (e.g., import.meta.resolve returns a string synchronously).
7. CommonJS Interoperability: Importing CommonJS modules returns module.exports as default; static analysis provides named exports; __filename and __dirname replaced by import.meta properties.
8. JSON and WASM Modules: JSON imports require with { type: 'json' }; WASM modules enabled by --experimental-wasm-modules flag.
9. Top-Level Await: Allowed at module scope; non-resolving promises cause process exit code 13; synchronous top-level await influences module loading.
10. Loaders and Resolution Algorithm: Default loader resolves using URL semantics without default file extensions; ESM_RESOLVE and ESM_FILE_FORMAT functions determine module format based on file extension and package.json "type".
11. Customizing Specifier Resolution: Custom hooks allow overriding default module resolution behavior for non-standard cases.


## Supplementary Details
Configuration Options:
- File Extension: .mjs returns 'module', .cjs returns 'commonjs', .json returns 'json'.
- Flags: --input-type=module or --input-type=commonjs to explicitly set module type.
- Import Attributes: Use { type: 'json' } when importing JSON modules. Mandatory for correct parsing.

ESM_RESOLVE Algorithm (Key Steps):
1. If specifier is a valid URL, parse and use it directly.
2. For relative specifiers, resolve against parentURL.
3. For bare specifiers, invoke PACKAGE_RESOLVE to lookup in node_modules and package.json exports/imports.
4. Determine module format using ESM_FILE_FORMAT:
   - .mjs: 'module'
   - .cjs: 'commonjs'
   - .json: 'json'
   - .wasm (with flag): 'wasm'
   - .node (with flag): 'addon'

import.meta API Details:
- import.meta.url: string; absolute file URL.
- import.meta.filename: string; absolute file path, requires file: protocol.
- import.meta.dirname: string; directory of current module.
- import.meta.resolve(specifier[, parent]): string; synchronously resolves a specifier relative to the current module. Accepts an optional parent URL parameter (string or URL).

Error Handling:
- Invalid Module Specifier when specifier is not a valid URL or contains prohibited characters.
- Module Not Found if resolved file does not exist.
- Invalid Package Configuration for malformed package.json or conflicting exports.

Implementation Steps:
1. Choose the appropriate file extension or package type in package.json to signal module type.
2. Use import.meta properties in place of CommonJS globals.
3. Use URL-based resolution (e.g., new URL('./data.proto', import.meta.url)) to load local files.
4. For dynamic loading, use import() and handle promise rejections.
5. For custom module resolution, implement loader hooks as per Node.js documentation.


## Reference Details
API Specifications:
- import.meta.resolve(specifier: string, parent?: string | URL): string
   Parameters:
      specifier - The module specifier to resolve.
      parent (optional) - An absolute parent module URL; defaults to import.meta.url.
   Returns: A string representing the absolute URL of the resolved module.
   Exceptions: Throws Invalid Module Specifier if resolution fails for invalid URL, package configuration errors, or unsupported protocols.

Method Signature Examples:
// ES module file using import.meta.resolve
const resolved = import.meta.resolve('component-lib/asset.css');
// Returns: file:///app/node_modules/component-lib/asset.css

// Dynamic Import Example
import('node:fs').then(fsModule => {
  // fsModule contains the Node.js fs APIs
});

// CommonJS Interoperability Example
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cjsModule = require('./cjs-module.cjs');

Configuration Options:
- package.json "type": "module" or "commonjs" to force module resolution mode.
- CLI flags: --input-type=module or --input-type=commonjs
- Experimental flags: --experimental-wasm-modules to load .wasm files; --experimental-addon-modules for .node addon modules

Best Practices:
- Always specify file extensions in import statements for clarity and consistency.
- Use URL resolution (new URL) to compute paths relative to import.meta.url.
- Handle dynamic imports with proper error checking.

Troubleshooting Procedures:
1. Error: Module Not Found
   - Command: Verify file existence using ls and check capitalization and extensions.
   - Expected Output: File listed in directory.
2. Error: Invalid Module Specifier
   - Command: Check for prohibited characters (%2F, %5C) in URLs or specify full relative path.
   - Expected Output: Correctly resolved URL string.
3. Debugging Resolution:
   - Use console.log(import.meta.resolve('specifier')) to trace resolution paths.
   - Validate package.json exports and imports configuration.

Full Code Example with Comments:
// addTwo.mjs
// Exports a function that adds 2 to a number
function addTwo(num) {
  return num + 2;
}
export { addTwo };

// app.mjs
// Imports and uses the addTwo function
import { addTwo } from './addTwo.mjs';
console.log(addTwo(4)); // Expected output: 6

// Using import.meta to load a local file relative to current module
import { readFileSync } from 'node:fs';
const protoPath = new URL('./data.proto', import.meta.url);
const data = readFileSync(protoPath);
console.log(data);


## Information Dense Extract
ESM: .mjs => module, .cjs => commonjs, .json => json; package.json "type" sets resolution. Import specifiers: relative (./), bare, absolute (file:///). URL resolution via new URL(specifier, import.meta.url). import.meta: properties url (string), filename (string, file: only), dirname (string), resolve(specifier, [parent]) returns absolute URL. Dynamic import() expressions support asynchronous loading. ESM_RESOLVE algorithm processes valid URLs, relative paths, bare specifiers by package lookup; ESM_FILE_FORMAT returns module formats based on file extension or package type. API import.meta.resolve(specifier: string, parent?: string|URL): string; throws on invalid module specifier, package config errors, unsupported protocols. Flags: --input-type, --experimental-wasm-modules, --experimental-addon-modules. Best practices: explicit file extensions, use URL.pathToFileURL, fallback to module.createRequire for CommonJS interop, error handling via try-catch and logging resolved paths.

## Sanitised Extract
TABLE OF CONTENTS:
1. Introduction
2. Enabling ECMAScript Modules
3. Import Specifiers and Mandatory File Extensions
4. URL Resolution and Data/Node Imports
5. Import Attributes and Built-in Modules
6. import() Expressions and import.meta API
7. CommonJS Interoperability
8. JSON and WASM Modules
9. Top-Level Await
10. Loaders and Resolution Algorithm
11. Customizing Specifier Resolution

1. Introduction: Modules defined with import/export; official ESM format in Node.js.
2. Enabling ECMAScript Modules: Use .mjs extension, package.json property 'type': 'module', or CLI flag --input-type=module; conversely use .cjs or 'commonjs' for CommonJS.
3. Import Specifiers and Mandatory File Extensions: Relative, bare, and absolute specifiers require explicit file extensions; directory indexes must be fully specified.
4. URL Resolution and Data/Node Imports: Modules resolved as URLs; file:, node:, and data: schemes supported; percent encoding for special characters.
5. Import Attributes and Built-in Modules: Use import attributes such as { type: 'json' } to import JSON; built-in modules expose both default and named exports.
6. import() Expressions and import.meta API: Dynamic import() available; import.meta provides metadata (url, filename, dirname, resolve) with specific behaviors (e.g., import.meta.resolve returns a string synchronously).
7. CommonJS Interoperability: Importing CommonJS modules returns module.exports as default; static analysis provides named exports; __filename and __dirname replaced by import.meta properties.
8. JSON and WASM Modules: JSON imports require with { type: 'json' }; WASM modules enabled by --experimental-wasm-modules flag.
9. Top-Level Await: Allowed at module scope; non-resolving promises cause process exit code 13; synchronous top-level await influences module loading.
10. Loaders and Resolution Algorithm: Default loader resolves using URL semantics without default file extensions; ESM_RESOLVE and ESM_FILE_FORMAT functions determine module format based on file extension and package.json 'type'.
11. Customizing Specifier Resolution: Custom hooks allow overriding default module resolution behavior for non-standard cases.

## Original Source
Node.js Official Documentation
https://nodejs.org/api/esm.html

## Digest of NODE_ESM

# Introduction
Date Retrieved: 2023-10-12

ECMAScript modules (ESM) are the officially supported module format in Node.js. The documentation covers how to use ESM with file extensions (.mjs, .js with package.json "type": "module"), enables interoperability with CommonJS, and describes all related APIs such as import.meta and dynamic import().

# Enabling
Two module systems exist in Node.js: CommonJS and ECMAScript modules. To enable ESM:
- Use the .mjs extension
- Set "type": "module" in package.json
- Use the --input-type=module CLI flag

# Import Specifiers
Specifiers are the string values following the import keyword. There are three types: relative (e.g. ./startup.js), bare (e.g. some-package), and absolute (e.g. file:///opt/nodejs/config.js).

# Mandatory File Extensions
A file extension is required for relative and absolute imports. Directory indexes must be fully specified (e.g. ./startup/index.js).

# URLs
Modules are resolved as URLs. Special characters must be percent-encoded. Supported schemes include file:, node:, and data:. For example, file: URLs are resolved with url.pathToFileURL.

# data: and node: Imports
- data: URLs support MIME types: text/javascript for ESM, application/json for JSON, and application/wasm for WASM.
- node: URLs allow loading Node.js builtin modules (e.g. import fs from 'node:fs/promises').

# Import Attributes
Import attributes allow passing additional data with an import, as with JSON modules:
  import fooData from './foo.json' with { type: 'json' };
The type attribute is mandatory for JSON modules.

# Built-in Modules
Built-in modules provide named exports along with a default export that corresponds to CommonJS module.exports. These can be used to patch or modify exported values.

# import() Expressions
Dynamic import() expressions are available in both ESM and CommonJS, enabling asynchronous module loading.

# import.meta
The import.meta object contains metadata:
  - import.meta.url: The absolute file: URL of the module.
  - import.meta.filename: Absolute file path (requires file: protocol).
  - import.meta.dirname: Directory of the current module.
  - import.meta.resolve(specifier): Synchronously resolves a module specifier relative to the current module.

# Interoperability with CommonJS
When importing CommonJS modules in ESM:
  - The module.exports object is exposed as the default export.
  - Named exports may be provided via static analysis.
  - No __filename or __dirname are available; use import.meta properties instead.
  - Use module.createRequire() for operations like require.resolve.

# JSON Modules and WASM Modules
- JSON modules require the { type: 'json' } attribute when imported.
- WASM modules are experimental and enabled with --experimental-wasm-modules, allowing .wasm files to be imported.

# Top-Level Await
Top-level await is supported in ESM. It allows awaiting promises directly at the module scope, affecting module loading (e.g. a never resolving promise leads to process exit with code 13).

# Loaders and ESM Resolution Algorithm
The default loader resolves modules using URL-based resolution without default file extensions.

## ESM_RESOLVE
A high-level algorithm that takes a specifier and parentURL, returning the resolved URL and module format (module, commonjs, json, wasm, addon) based on file extensions (e.g. .mjs, .cjs, .json) or custom package configurations.

## Customizing Specifier Resolution
Module customization hooks allow overriding the default resolution algorithm. This includes support for non-standard behaviors like CommonJS-style resolution in ESM.

# Version Changes and Stability
Key version changes:
- v23.1.0: Import attributes are no longer experimental.
- v14.8.0: Top-level await unflagged.
- Earlier versions introduced support for import assertions and customization hooks.

# Attribution & Data Size
Source: Node.js Official Documentation (https://nodejs.org/api/esm.html)
Data Size: 3396924 bytes

## Attribution
- Source: Node.js Official Documentation
- URL: https://nodejs.org/api/esm.html
- License: License if known: MIT
- Crawl Date: 2025-04-26T05:46:41.469Z
- Data Size: 3396924 bytes
- Links Found: 1649

## Retrieved
2025-04-26
