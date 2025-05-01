# ECMASCRIPT_MODULES

## Crawl Summary
The Node.js ESM documentation details enabling modules via .mjs or package.json, strict file extension requirements, URL-based resolution with percent-encoding, and distinctions between relative, bare, and absolute import specifiers. It specifies inline import attributes (mandatory for JSON), built-in module handling, dynamic import() usage, and the structure of import.meta (dirname, filename, url, resolve). The resolution algorithm (ESM_RESOLVE) and file format detection (ESM_FILE_FORMAT) are described with error cases and package resolution details. Interoperability with CommonJS is outlined with guidance on module.createRequire and namespace wrapping.

## Normalised Extract
Table of Contents:
1. Introduction
   - ESM support in Node.js v23.11.0
2. Enabling ESM
   - Use .mjs extension, package.json type field, or --input-type flag.
3. Import Specifiers
   - Relative (must include file extension), Bare (package name with optional extension if exports exist), Absolute (full file URL).
4. Mandatory File Extensions and URL Resolution
   - File extensions are mandatory; directory indexes must be fully specified; URL schemes: file:, node:, data:.
5. Import Attributes and JSON Modules
   - Syntax: import foo from './foo.json' with { type: 'json' };
   - Only default export available; type attribute is required.
6. Built-in Modules & Dynamic Import
   - Built-in modules export named and default exports; dynamic import() supports asynchronous loading.
7. import.meta Properties
   - dirname: string, filename: string, url: string, resolve(specifier: string, [parent?: string|URL]) => string.
8. Resolution Algorithms:
   - ESM_RESOLVE: Resolves specifiers relative to parentURL, determines module format.
   - ESM_FILE_FORMAT: Returns 'module', 'commonjs', 'json', 'wasm' based on file extension and flags.
   - PACKAGE_RESOLVE and PACKAGE_EXPORTS_RESOLVE: Resolve bare specifiers using package.json 'exports' and 'imports'.
9. Interoperability with CommonJS
   - Importing CommonJS yields a namespace with default export; missing __filename, __dirname; use module.createRequire() for require functionality.
10. Experimental Features
    - Top-level await and WASM modules under experimental flags; module customization hooks usage.

## Supplementary Details
Enabling Options:
- .mjs extension or package.json "type": "module" or --input-type=module
- CommonJS: .cjs, package.json "type": "commonjs", or --input-type=commonjs

Import Attributes:
- JSON module import requires syntax: with { type: 'json' }

URL Resolution:
- file:, node:, and data: URL schemes supported. Percent-encoding required for special characters.

import.meta:
- import.meta.dirname: Derived from path.dirname(import.meta.filename).
- import.meta.filename: Absolute local path, symlink-resolved.
- import.meta.url: Absolute file URL.
- import.meta.resolve(specifier, [parent]) returns resolved URL as string.

Resolution Algorithms:
- ESM_RESOLVE(specifier, parentURL): returns an object containing resolved URL and format.
- ESM_FILE_FORMAT(url): Checks file extension; returns 'module' for .mjs, 'commonjs' for .cjs, 'json' for .json, 'wasm' if experimental flag enabled, 'addon' for .node with experimental flag.

CommonJS Interoperability:
- Use module.createRequire() for constructing a require in ESM.
- CommonJS modules imported into ESM provide a default export as the module.exports value; named exports detected via static analysis.

Troubleshooting:
- If import.meta.resolve throws, verify valid specifier and accessible file.
- For top-level await issues, ensure promises resolve; otherwise process exits with code 13.
- Verify package.json exports configuration for bare specifiers.

## Reference Details
API Specifications:
1. import.meta.resolve(specifier: string, [parent?: string|URL]) : string
   - Returns an absolute URL string for the given specifier relative to the current module.
   - Example usage:
       const resolvedUrl = import.meta.resolve('./dep.js');
2. module.createRequire(filename: string): NodeJS.Require
   - Creates a CommonJS require function scoped to the given filename.
   - Example usage:
       import { createRequire } from 'module';
       const require = createRequire(import.meta.url);
       const moduleExports = require('some-package');
3. ESM_RESOLVE(specifier, parentURL): { format: string, resolved: string }
   - Algorithm steps:
       a. If specifier is a valid URL, return parsed URL.
       b. If specifier starts with '/', './', '../', resolve relative to parentURL.
       c. Otherwise, resolve using PACKAGE_RESOLVE for bare specifiers.
4. ESM_FILE_FORMAT(url): string
   - Determines module format:
       .mjs -> 'module'
       .cjs -> 'commonjs'
       .json -> 'json'
       .wasm -> 'wasm' (if enabled)
       No extension: analyzes package.json type field and source syntax.
5. PACKAGE_RESOLVE(packageSpecifier, parentURL): string
   - Processes bare specifiers using package.json 'exports' or 'main' field.
   - Algorithm includes lookups in node_modules and verifies valid paths.

SDK Method Signatures:
- import.meta.resolve: (specifier: string, parent?: string|URL) => string
- module.createRequire: (filename: string) => RequireFunction

Configuration Options:
- package.json "type": "module" | "commonjs"
- Command-line: --input-type=module | --input-type=commonjs
- Experimental flags: --experimental-wasm-modules, --experimental-addon-modules

Best Practices:
- Always specify file extensions in import statements.
- Use import.meta for path and URL resolution instead of __dirname and __filename.
- For JSON imports, always include with { type: 'json' }.
- Use module.createRequire() when needing to load CommonJS modules in an ESM context.

Troubleshooting Procedures:
- If module resolution fails, run node with increased logging verbosity to trace ESM_RESOLVE steps.
- Validate package.json configuration when bare specifier resolution fails.
- For top-level await issues, test individual awaits in isolated modules and check for promise resolution; command: node --input-type=module yourModule.mjs, monitor exit code 13 for unresolved awaits.

## Information Dense Extract
ESM Node.js v23.11.0: Enabling via .mjs/package.json type or --input-type flag; Import specifiers: relative (must include extension), bare, absolute; Mandatory extension; URL resolution with file:, node:, data:; Import attributes require with { type: 'json' } for JSON; Built-in modules export named and default exports; Dynamic import() supported; import.meta properties: dirname, filename, url, resolve(specifier:string,[parent]); ESM_RESOLVE algorithm: parses specifier, relative resolution, bare specifier via PACKAGE_RESOLVE; ESM_FILE_FORMAT returns 'module', 'commonjs', 'json', 'wasm'; CommonJS interop: use module.createRequire, namespace wrapping of module.exports; API: import.meta.resolve(specifier:string,[parent]) returns string; configuration options: package.json type, experimental flags; best practices: explicit extensions, use import.meta over __dirname; troubleshooting: use verbose logging, check package.json exports.

## Sanitised Extract
Table of Contents:
1. Introduction
   - ESM support in Node.js v23.11.0
2. Enabling ESM
   - Use .mjs extension, package.json type field, or --input-type flag.
3. Import Specifiers
   - Relative (must include file extension), Bare (package name with optional extension if exports exist), Absolute (full file URL).
4. Mandatory File Extensions and URL Resolution
   - File extensions are mandatory; directory indexes must be fully specified; URL schemes: file:, node:, data:.
5. Import Attributes and JSON Modules
   - Syntax: import foo from './foo.json' with { type: 'json' };
   - Only default export available; type attribute is required.
6. Built-in Modules & Dynamic Import
   - Built-in modules export named and default exports; dynamic import() supports asynchronous loading.
7. import.meta Properties
   - dirname: string, filename: string, url: string, resolve(specifier: string, [parent?: string|URL]) => string.
8. Resolution Algorithms:
   - ESM_RESOLVE: Resolves specifiers relative to parentURL, determines module format.
   - ESM_FILE_FORMAT: Returns 'module', 'commonjs', 'json', 'wasm' based on file extension and flags.
   - PACKAGE_RESOLVE and PACKAGE_EXPORTS_RESOLVE: Resolve bare specifiers using package.json 'exports' and 'imports'.
9. Interoperability with CommonJS
   - Importing CommonJS yields a namespace with default export; missing __filename, __dirname; use module.createRequire() for require functionality.
10. Experimental Features
    - Top-level await and WASM modules under experimental flags; module customization hooks usage.

## Original Source
Node.js ECMAScript Modules (ESM) Documentation
https://nodejs.org/api/esm.html

## Digest of ECMASCRIPT_MODULES

# Introduction
Retrieved Date: 2023-10-14
Node.js supports ECMAScript modules (ESM) as the official standard for packaging JavaScript for reuse. This document details the configuration, resolution, and interoperability sections of the Node.js v23.11.0 ESM documentation.

# Enabling ESM
Use the .mjs extension, set package.json "type" field to "module", or use the --input-type flag set to "module". For CommonJS, use .cjs, "commonjs" or --input-type set to "commonjs". When no marker is present, Node.js inspects the module for ES syntax.

# Import Specifiers
Import specifiers fall into three categories:
1. Relative (e.g. ./startup.js, ../config.mjs) requiring file extensions.
2. Bare (e.g. some-package or some-package/shuffle). File extension is optional if package.json contains an "exports" field.
3. Absolute (e.g. file:///opt/nodejs/config.js) with full paths.

# Mandatory File Extensions & URLs
A file extension is mandatory for both relative and absolute imports. ES modules are resolved as URLs (file:, node:, data:) with special characters percent-encoded. For file: URLs, directory indexes must be fully specified.

# Import Attributes and JSON Modules
Import attributes are used inline with the import statement to pass additional information, for example:
  import fooData from './foo.json' with { type: 'json' };
In JSON modules, the type attribute is mandatory and only the default export is exposed. Data URL imports support MIME types such as text/javascript, application/json, and application/wasm.

# Built-in Modules & Dynamic Import
Built-in modules (e.g. node:fs, node:events) export both named exports and a default export (derived from CommonJS exports). Dynamic import() expressions are supported in both ESM and CommonJS and allow asynchronous module loading.

# import.meta Properties
The import.meta object includes:
- import.meta.dirname: Directory name of the current module (equivalent to path.dirname(import.meta.filename)), available on file: modules.
- import.meta.filename: The full absolute path with symlinks resolved.
- import.meta.url: The absolute file URL for the module.
- import.meta.resolve(specifier): Synchronously returns the absolute URL string for a given specifier. Signature: import.meta.resolve(specifier: string, [parent?: string|URL]) => string.

# Resolution and Loading Algorithms
The ESM loader uses the following algorithms:
- ESM_RESOLVE: Resolves a module specifier relative to a parentURL and suggests a module format.
- ESM_FILE_FORMAT: Determines the file format based on extensions (.mjs returns 'module', .cjs returns 'commonjs', .json returns 'json', .wasm returns 'wasm' when experimental flag is enabled).
- PACKAGE_RESOLVE and PACKAGE_EXPORTS_RESOLVE: Handle resolution for bare specifiers, using package.json's "exports" and "imports" fields.

# Interoperability with CommonJS
When importing CommonJS modules into ESM, Node.js wraps module.exports into a namespace object with a default export. CommonJS variables such as __filename and __dirname are not directly available in ESM; use import.meta.filename and import.meta.dirname instead. For functionalities like require, use module.createRequire().

# Experimental Features
Top-level await is supported; if a top-level await never resolves, Node exits with code 13. WASM module support is available under the --experimental-wasm-modules flag, and module customization hooks allow tailoring of the resolution algorithm.

# Attribution
Data Size: 3513035 bytes, Links Found: 2086, No reported errors.

## Attribution
- Source: Node.js ECMAScript Modules (ESM) Documentation
- URL: https://nodejs.org/api/esm.html
- License: License if known: MIT (Node.js is open source under the MIT license)
- Crawl Date: 2025-05-01T19:05:49.260Z
- Data Size: 3513035 bytes
- Links Found: 2086

## Retrieved
2025-05-01
