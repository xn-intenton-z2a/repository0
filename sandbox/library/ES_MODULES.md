# ES_MODULES

## Crawl Summary
Explicit ES module markers: .mjs, package.json type:module, --input-type=module. Relative specifiers require extension. Bare specifiers resolved via node_modules and exports field. Absolute via file: URLs. Supported URL schemes: file, data, node. Import attributes: with { type:'json' } required for JSON modules. import.meta properties: url:string, dirname:string, filename:string, resolve(specifier):string. ES↔CJS interop: default export = module.exports, named exports via static analysis, dynamic import() in CJS, module.createRequire for CJS in ESM. JSON modules: default only, cached. Wasm modules behind flag, support instance and source-phase imports. Top-level await allowed. Resolution algorithm: ESM_RESOLVE→URL/relative/imports/bare, returns format and URL, errors on invalid specifiers, missing files, unsupported directories, bad package exports/imports.

## Normalised Extract
Table of Contents
1. Enabling ES Modules
2. Import Specifiers
3. URL Schemes
4. Import Attributes
5. import.meta API
6. CommonJS Interoperability
7. JSON Modules
8. Wasm Modules
9. Top-Level Await
10. Resolution Algorithm

1. Enabling ES Modules
Markers:
  • .mjs extension
  • package.json: "type": "module"
  • CLI flag --input-type=module
Inverse for CJS:
  • .cjs | "type":"commonjs" | --input-type=commonjs

2. Import Specifiers
Relative:
  import X from './file.js'
Bare:
  import X from 'pkg'
Absolute:
  import X from 'file:///abs/path.js'

3. URL Schemes
file: → local FS URLs (use url.pathToFileURL)
data: → text/javascript, application/json, application/wasm
node: → builtin modules (import fs from 'node:fs')

4. Import Attributes
import data from './foo.json' with { type: 'json' }
await import('./foo.json', { with: { type: 'json' } })

5. import.meta API
import.meta.url returns module file URL
import.meta.dirname returns directory path
import.meta.filename returns file path
import.meta.resolve(specifier) → absolute URL string

6. CommonJS Interoperability
import cjsDefault from 'cjs-module'
import { named } from 'cjs-module'
const req = module.createRequire(import.meta.url)
const cjs = req('./cjs.cjs')

7. JSON Modules
import cfg from './config.json' with { type: 'json' }
exports: default only
cache: shared with CJS

8. Wasm Modules
node --experimental-wasm-modules index.mjs
import * as M from './lib.wasm'
import source mod from './lib.wasm'
const inst = await WebAssembly.instantiate(mod, imports)

9. Top-Level Await
export const data = await fetchData()
Node exit code 13 on unresolved promises

10. Resolution Algorithm
Call: ESM_RESOLVE(specifier, parentURL)
Steps:
  1. If valid URL → normalize
  2. If startsWith './', '../', or '/' → resolve URL
  3. If startsWith '#' → PACKAGE_IMPORTS_RESOLVE
  4. Else → PACKAGE_RESOLVE
Output: { format: 'module'|'commonjs'|'json'|'wasm'|'addon', resolvedURL }
Error types: Invalid Module Specifier, Module Not Found, Unsupported Directory Import, Invalid Package Configuration, Package Path Not Exported, Package Import Not Defined

## Supplementary Details
package.json examples:
{
  "type": "module",
  "dependencies": { }
}

CLI usage:
node --input-type=module file.js
node --input-type=commonjs file.cjs

Dynamic import in CJS:
(async () => {
  const mod = await import('./esm.mjs');
  console.log(mod);
})();

module.createRequire:
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const cjsLib = require('./lib.cjs');

URL import example:
import data from new URL('./data.txt', import.meta.url);

Error reproduction:
> import x from './file'
SyntaxError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension "." on file ./file
Fix: add extension or set "type": "module".


## Reference Details
import.meta.resolve(specifier: string): string
  • specifier: module specifier
  • returns: absolute URL string

createRequire(path: string): NodeRequire
  • path: file path or URL string
  • returns: require function with resolve, cache, extensions

Dynamic import:
Promise<any> import(modulePath)
  • returns module namespace object

JSON import attributes:
with: { type: 'json' }
  • mandatory for JSON

Top-level await:
allowed at module root

Wasm modules:
--experimental-wasm-modules flag required
import * as M from './mod.wasm'
import source M from './mod.wasm'

Resolution errors and codes:
ERR_INVALID_MODULE_SPECIFIER
ERR_MODULE_NOT_FOUND
ERR_UNSUPPORTED_DIR_IMPORT
ERR_INVALID_PACKAGE_CONFIG
ERR_PACKAGE_PATH_NOT_EXPORTED
ERR_PACKAGE_IMPORT_NOT_DEFINED

Best practice:
Always include file extensions on imports
Use package.json "type" field for .js modules
Cache JSON modules via import attributes
Use import.meta.resolve for cross-platform paths
Use module.createRequire to access CJS-only APIs

Troubleshooting commands:
node --trace-warnings esm-example.mjs  # show ESM warnings
node --input-type=module --trace-resolution file.js  # debug resolution


## Information Dense Extract
ESM markers: .mjs | package.json type:module | --input-type=module. Specifiers: relative(./x.js), bare(pkg[/sub]), absolute(file:///). URLs: file, data(MIME: js|json|wasm), node. Import attributes: with { type: 'json' }. import.meta: url, dirname, filename, resolve(specifier). CJS interop: import default=module.exports, named via static analysis, dynamic import() in CJS, module.createRequire(import.meta.url). JSON modules: default only, cached. Wasm: --experimental-wasm-modules, import * as M, import source. Top-level await allowed, unresolved exit 13. Resolution: ESM_RESOLVE→URL/relative/imports/bare→format via extension or package.json type→errors: ERR_INVALID_MODULE_SPECIFIER, ERR_MODULE_NOT_FOUND, ERR_UNSUPPORTED_DIR_IMPORT, ERR_INVALID_PACKAGE_CONFIG, ERR_PACKAGE_PATH_NOT_EXPORTED, ERR_PACKAGE_IMPORT_NOT_DEFINED.

## Sanitised Extract
Table of Contents
1. Enabling ES Modules
2. Import Specifiers
3. URL Schemes
4. Import Attributes
5. import.meta API
6. CommonJS Interoperability
7. JSON Modules
8. Wasm Modules
9. Top-Level Await
10. Resolution Algorithm

1. Enabling ES Modules
Markers:
   .mjs extension
   package.json: 'type': 'module'
   CLI flag --input-type=module
Inverse for CJS:
   .cjs | 'type':'commonjs' | --input-type=commonjs

2. Import Specifiers
Relative:
  import X from './file.js'
Bare:
  import X from 'pkg'
Absolute:
  import X from 'file:///abs/path.js'

3. URL Schemes
file:  local FS URLs (use url.pathToFileURL)
data:  text/javascript, application/json, application/wasm
node:  builtin modules (import fs from 'node:fs')

4. Import Attributes
import data from './foo.json' with { type: 'json' }
await import('./foo.json', { with: { type: 'json' } })

5. import.meta API
import.meta.url returns module file URL
import.meta.dirname returns directory path
import.meta.filename returns file path
import.meta.resolve(specifier)  absolute URL string

6. CommonJS Interoperability
import cjsDefault from 'cjs-module'
import { named } from 'cjs-module'
const req = module.createRequire(import.meta.url)
const cjs = req('./cjs.cjs')

7. JSON Modules
import cfg from './config.json' with { type: 'json' }
exports: default only
cache: shared with CJS

8. Wasm Modules
node --experimental-wasm-modules index.mjs
import * as M from './lib.wasm'
import source mod from './lib.wasm'
const inst = await WebAssembly.instantiate(mod, imports)

9. Top-Level Await
export const data = await fetchData()
Node exit code 13 on unresolved promises

10. Resolution Algorithm
Call: ESM_RESOLVE(specifier, parentURL)
Steps:
  1. If valid URL  normalize
  2. If startsWith './', '../', or '/'  resolve URL
  3. If startsWith '#'  PACKAGE_IMPORTS_RESOLVE
  4. Else  PACKAGE_RESOLVE
Output: { format: 'module'|'commonjs'|'json'|'wasm'|'addon', resolvedURL }
Error types: Invalid Module Specifier, Module Not Found, Unsupported Directory Import, Invalid Package Configuration, Package Path Not Exported, Package Import Not Defined

## Original Source
Node.js ESM Modules
https://nodejs.org/api/esm.html

## Digest of ES_MODULES

# Enabling

Node.js interprets modules as ES modules when any of the following explicit markers are present:

• File extension ".mjs"
• package.json field "type": "module"
• CLI flag --input-type=module

Inverse markers for CommonJS:

• File extension ".cjs"
• package.json field "type": "commonjs"
• CLI flag --input-type=commonjs

Example:

node --input-type=module index.mjs

# Import Specifiers

Three specifier types supported by `import`:

Relative:
• ./file.js | ../dir/file.mjs (extension mandatory, directories fully specified)

Bare:
• "pkg" | "pkg/sub.js" (resolved via node_modules and exports field)

Absolute:
• file:///path/to/file.js

# URL Schemes

Supported:
• file: URLs (use url.pathToFileURL for paths)
• data: URLs (v12.10.0+) with MIME types text/javascript, application/json, application/wasm
• node: URLs for builtin modules (v12.20.0+)

Remarks:
• file URLs with differing query or fragment load distinct modules
• data: imports support only bare or absolute specifiers for builtins

# Import Attributes

Syntax:

import jsonData from './data.json' with { type: 'json' }
await import('./data.json', { with: { type: 'json' } })

Supported attribute:
• type: 'json' (mandatory for JSON modules)

# import.meta

Properties (ES modules only):

import.meta.url  → string  // absolute file: URL of the module
import.meta.dirname → string  // directory name (v20.11.0+, file: only)
import.meta.filename → string  // absolute path with symlinks resolved (v20.11.0+)
import.meta.resolve(specifier: string) → string  // resolved absolute URL

# Interoperability with CommonJS

• `import` in ES modules can load CJS:
  - default export = module.exports
  - named exports from static analysis (cjs-module-lexer)

• Dynamic `import()` works in CJS to load ES modules

• `module.createRequire(path: string): NodeRequire` for CJS methods in ESM

# JSON Modules

import config from './package.json' with { type: 'json' }

• default export only
• cached in CJS cache for deduplication

# Wasm Modules (Experimental)

Flags: --experimental-wasm-modules

Instance imports:
import * as M from './lib.wasm'

Source phase imports (v24.0.0+):
import source mod from './lib.wasm'
const inst = await WebAssembly.instantiate(mod, imports)

# Top-Level Await

• Allowed in ES modules (v14.8.0+)
• Unresolved await causes exit code 13

# Resolution and Loading Algorithm

Features:
• FileURL-based resolution
• No default extensions or folder mains
• Bare specifier lookup via node_modules and package.json exports
• Loader supports file:, data:, node: URLs only

Resolution routine ESM_RESOLVE(specifier, parentURL) returns { format, resolvedURL }
• Valid URL → parse and normalize
• Relative (./, ../, /) → URL resolution
• # imports → PACKAGE_IMPORTS_RESOLVE
• Otherwise bare → PACKAGE_RESOLVE

Format from extension or package.json "type"

Errors:
Invalid Module Specifier, Module Not Found, Unsupported Directory Import,
Invalid Package Configuration, Package Path Not Exported, Package Import Not Defined

## Attribution
- Source: Node.js ESM Modules
- URL: https://nodejs.org/api/esm.html
- License: License: CC BY 4.0
- Crawl Date: 2025-05-13T12:31:52.630Z
- Data Size: 4210035 bytes
- Links Found: 3241

## Retrieved
2025-05-13
