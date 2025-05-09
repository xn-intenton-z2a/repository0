# ESM_MODULES

## Crawl Summary
Node.js ES modules use explicit markers (.mjs, package.json type:module, --input-type). Relative specifiers require extensions; bare specifiers follow package exports field; absolute use file: URLs. import attributes support only { type: 'json' }. import.meta offers url, dirname, filename, resolve(specifier) -> string. CommonJS interop: default export = module.exports, named exports via static analysis, createRequire for require. JSON modules require with { type: 'json' } and expose default. WASM modules require --experimental-wasm-modules; support source imports. Top-level await enabled unflagged. Resolution algorithm: ESM_RESOLVE handles URLs, relative, imports (#), bare packages via PACKAGE_RESOLVE; format from extension or package.json type and content detection; throws specific errors.

## Normalised Extract
Table of Contents:
1. Enabling ES Modules
2. Import Specifiers
3. Import Attributes
4. import.meta API
5. CommonJS Interop
6. JSON Modules
7. WASM Modules
8. Top-Level Await
9. Resolution Algorithm

1. Enabling ES Modules
Markers:
  • .mjs extension
  • package.json: { "type": "module" }
  • CLI: node --input-type=module
Fallback: source scan for import/export syntax.

2. Import Specifiers
- Relative: './file.ext' (extension mandatory)
- Bare: 'pkg' or 'pkg/sub' (exports field controls access)
- Absolute: 'file:///path'

3. Import Attributes
Syntax: import x from 'file.json' with { type: 'json' }
Supported: type:'json'

4. import.meta API
import.meta.url      -> file: URL string
import.meta.dirname  -> path.dirname(import.meta.filename)
import.meta.filename -> absolute path of module
import.meta.resolve(specifier:string):string

5. CommonJS Interop
import defaultExport from 'cjs'
import * as ns from 'cjs'
createRequire:
  import { createRequire } from 'module'
  const require = createRequire(import.meta.url)

6. JSON Modules
import pkg from './package.json' with { type:'json' }
Exposes default export only; caches via CommonJS

7. WASM Modules
Flag: --experimental-wasm-modules
import * as Module from './mod.wasm'
import source wasmBinary from './mod.wasm'

8. Top-Level Await
Allowed. Exits with code 13 if never resolves.

9. Resolution Algorithm
ESM_RESOLVE(specifier,parentURL)
  • If valid URL -> parse
  • If starts with '/', './', '../' -> URL.resolve
  • If '#' -> PACKAGE_IMPORTS_RESOLVE
  • Else -> PACKAGE_RESOLVE
Format via ESM_FILE_FORMAT by extension (.mjs,module;.cjs,commonjs;.json,json;.wasm if flag,wasm)
Throws: Invalid Module Specifier, Module Not Found, Unsupported Directory Import, Invalid Package Target/Configuration, Package Path Not Exported

## Supplementary Details
Exact parameter values and flags:
--input-type=module | commonjs
package.json "type": "module" | "commonjs"
Extension-to-format mapping: .mjs->module, .cjs->commonjs, .json->json, .wasm->wasm (flag), .node->addon (flag)
import.meta.resolve: accepts specifier:string, returns absolute URL string; synchronous
MODULE ERRORS:
  Invalid Module Specifier: non-URL/bad package name
  Module Not Found: file missing
  Unsupported Directory Import: specifier resolves to directory
PACKAGE RESOLUTION:
PACKAGE_RESOLVE(pkgSpecifier,parentURL) extracts packageName, subpath, falls back up directories to node_modules, reads package.json exports field or main, supports conditions ["node","import"].
Conditions array default: ["node","import"].

Implementation steps:
1. Add "type":"module" to package.json
2. Rename .js to .mjs or use extension markers
3. Use import specifiers with extensions
4. For JSON imports, add with { type: 'json' }
5. For WASM, invoke node with --experimental-wasm-modules
6. Use import.meta.resolve to resolve specifiers programmatically

Best practice: Always specify extensions on relative imports; use import attributes for JSON; use createRequire for CJS interop; avoid mixing require() and import statements.



## Reference Details
API: import.meta.resolve
Signature: function resolve(specifier: string): string
Parameters: specifier: string (relative, bare, or absolute) 
Returns: string (absolute URL)
Throws: Error on invalid specifier or resolution failure

API: createRequire
import { createRequire } from 'module'
Signature: function createRequire(path: string | URL): NodeRequire

Code Example:
import { createRequire } from 'module'
import { readFileSync } from 'fs'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')
console.log(pkg.version)

// JSON Module import
import config from './config.json' with { type: 'json' }
console.log(config)

// Top-level await example
export const data = await fetch('https://api.example.com/data').then(r=>r.json())

// WASM import
// Run: node --experimental-wasm-modules index.mjs
import * as wasm from './lib.wasm'
console.log(wasm.add(1,2))

Troubleshooting:
Command: node --trace-warnings --experimental-wasm-modules app.mjs
Output: prints loader traces and resolution errors
Common errors:
Invalid Module Specifier at ESM_RESOLVE -> check specifier syntax
Module Not Found -> verify file path and extension
Unsupported Directory Import -> include index file or explicit file

Configuration options:
{ "type": "module" } in package.json defaults all .js files to ESM
--input-type=module treats stdin or --eval input as module
--experimental-wasm-modules enables .wasm handling

Best Practice Code Pattern:
// package.json
{
  "type": "module",
  "exports": {
    "./feature": "./src/feature.mjs"
  }
}

// src/index.mjs
import feature from './feature.mjs'
feature.init()



## Information Dense Extract
ESM: enable via .mjs, package.json type:module, --input-type=module. Relative imports require extensions; bare follow exports field; absolute use file: URL. import attributes: JSON: with {type:'json'}. import.meta: url:string, dirname:string, filename:string, resolve(specifier)->string. CommonJS interop via createRequire(import.meta.url); default export=module.exports; named via static analysis. JSON modules expose default only; cache in CJS. WASM: flag --experimental-wasm-modules; import and source import. Top-level await allowed; unresolved await exits code 13. Resolution: ESM_RESOLVE categorizes specifiers, calls PACKAGE_RESOLVE or IMPORTS_RESOLVE, uses ESM_FILE_FORMAT by extension or package.json type and syntax detection. Errors: Invalid Module Specifier, Module Not Found, Unsupported Directory Import, Invalid Package Target, Package Path Not Exported.

## Sanitised Extract
Table of Contents:
1. Enabling ES Modules
2. Import Specifiers
3. Import Attributes
4. import.meta API
5. CommonJS Interop
6. JSON Modules
7. WASM Modules
8. Top-Level Await
9. Resolution Algorithm

1. Enabling ES Modules
Markers:
   .mjs extension
   package.json: { 'type': 'module' }
   CLI: node --input-type=module
Fallback: source scan for import/export syntax.

2. Import Specifiers
- Relative: './file.ext' (extension mandatory)
- Bare: 'pkg' or 'pkg/sub' (exports field controls access)
- Absolute: 'file:///path'

3. Import Attributes
Syntax: import x from 'file.json' with { type: 'json' }
Supported: type:'json'

4. import.meta API
import.meta.url      -> file: URL string
import.meta.dirname  -> path.dirname(import.meta.filename)
import.meta.filename -> absolute path of module
import.meta.resolve(specifier:string):string

5. CommonJS Interop
import defaultExport from 'cjs'
import * as ns from 'cjs'
createRequire:
  import { createRequire } from 'module'
  const require = createRequire(import.meta.url)

6. JSON Modules
import pkg from './package.json' with { type:'json' }
Exposes default export only; caches via CommonJS

7. WASM Modules
Flag: --experimental-wasm-modules
import * as Module from './mod.wasm'
import source wasmBinary from './mod.wasm'

8. Top-Level Await
Allowed. Exits with code 13 if never resolves.

9. Resolution Algorithm
ESM_RESOLVE(specifier,parentURL)
   If valid URL -> parse
   If starts with '/', './', '../' -> URL.resolve
   If '#' -> PACKAGE_IMPORTS_RESOLVE
   Else -> PACKAGE_RESOLVE
Format via ESM_FILE_FORMAT by extension (.mjs,module;.cjs,commonjs;.json,json;.wasm if flag,wasm)
Throws: Invalid Module Specifier, Module Not Found, Unsupported Directory Import, Invalid Package Target/Configuration, Package Path Not Exported

## Original Source
Node.js ESM Modules
https://nodejs.org/api/esm.html

## Digest of ESM_MODULES

# Introduction

ECMAScript modules are the official standard format to package JavaScript code for reuse. Modules are defined using import and export statements. Node.js supports ES modules via .mjs extension, "type": "module" in package.json, or the --input-type flag. Without explicit markers, Node.js inspects source for ES syntax.

# Enabling

Explicit markers:
- .mjs file extension
- package.json: { "type": "module" }
- CLI flag: --input-type=module

CommonJS markers:
- .cjs file extension
- package.json: { "type": "commonjs" }
- CLI flag: --input-type=commonjs

# Import Specifiers

Types:
1. Relative ("./file.mjs", extension required)
2. Bare ("package" or "package/subpath")
3. Absolute ("file:///path/to/file.js")

# Import Attributes

Syntax:
import data from './file.json' with { type: 'json' };
Supported attributes:
- type: 'json'

# import.meta Properties

import.meta.url        : string (file: URL of current module)
import.meta.dirname    : string (directory of current module)
import.meta.filename   : string (absolute path, symlinks resolved)
import.meta.resolve    : function(specifier: string) -> string (absolute URL)

# Interoperability with CommonJS

- import cjsDefault from 'cjs'    // default = module.exports
- import * as ns from 'cjs'        // namespace with default and named
- module.createRequire(import.meta.url)

# JSON Modules

import config from './config.json' with { type: 'json' };
Default export only, cached in CommonJS cache.

# Wasm Modules

--experimental-wasm-modules flag
import * as M from './module.wasm';
import source wasmModule from './module.wasm';

# Top-Level Await

Allowed in ES modules:
export const val = await Promise.resolve(5);

# Resolution Algorithm

ESM_RESOLVE(specifier, parentURL) -> { format: string, resolved: URL }
- URLs -> parse directly
- "." or "/" prefixes -> relative URL resolution
- "#" prefixes -> PACKAGE_IMPORTS_RESOLVE
- else bare -> PACKAGE_RESOLVE
Format detection via ESM_FILE_FORMAT by extension and package.json "type" field.

# Errors

Invalid Module Specifier, Module Not Found, Unsupported Directory Import, Invalid Package Configuration, Package Path Not Exported.

## Attribution
- Source: Node.js ESM Modules
- URL: https://nodejs.org/api/esm.html
- License: License
- Crawl Date: 2025-05-09T23:41:18.475Z
- Data Size: 3733629 bytes
- Links Found: 3224

## Retrieved
2025-05-09
