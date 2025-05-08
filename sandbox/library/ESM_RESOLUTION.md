# ESM_RESOLUTION

## Crawl Summary
ESM_RESOLVE implements import specifier resolution: valid URL, relative, imports (#), bare specifier. file: URLs validated for existence, directory, encoding, then realpath and format via ESM_FILE_FORMAT. ESM_FILE_FORMAT maps extensions to module/commonjs/json/wasm/addon; falls back on package.json type or source syntax detection. PACKAGE_RESOLVE locates builtin modules, packages via exports/imports, main field or file resolution; PACKAGE_EXPORTS_RESOLVE handles exports mapping and wildcards; errors on invalid targets.

## Normalised Extract
Table of Contents:
1. ESM_RESOLVE Algorithm
2. ESM_FILE_FORMAT Rules
3. PACKAGE_RESOLVE Steps
4. PACKAGE_EXPORTS_RESOLVE Logic

1. ESM_RESOLVE Algorithm
   Inputs: specifier:string, parentURL:string
   Steps:
     a. If specifier is valid URL → resolved=normalized URL
     b. If starts with "/","./","../" → resolved=URL.resolve(parentURL, specifier)
     c. If starts with "#" → call PACKAGE_IMPORTS_RESOLVE(specifier,parentURL,["node","import"])
     d. Else → call PACKAGE_RESOLVE(specifier,parentURL)
     e. If resolved protocol == file:
        • Reject if %2F or %5C present
        • Error if directory or not exists
        • resolved=realpath(resolved), preserve query/fragment
        • format=ESM_FILE_FORMAT(resolved)
     f. Else format=protocol-based format lookup
     g. Return {resolved,format}

2. ESM_FILE_FORMAT Rules
   File extensions map to formats:
     .mjs → module
     .cjs → commonjs
     .json → json
     .wasm (with flag) → wasm
     .node (with flag) → addon
   .js & no ext:
     • If package.json type field → module|commonjs
     • Else detect syntax: import/export/top-level await/import.meta → module; else commonjs

3. PACKAGE_RESOLVE Steps
   Input: packageSpecifier:string, parentURL:string
   a. Builtin → return "node:"+name
   b. Parse packageName and subpath
   c. If in package scope and package.json.name==packageName & exports defined → PACKAGE_EXPORTS_RESOLVE
   d. Loop upward into node_modules:
      • Read package.json; if exports defined → PACKAGE_EXPORTS_RESOLVE
      • If subpath=="." and main present → resolve main
      • Else resolve subpath relative to package URL
   e. On failure → Module Not Found

4. PACKAGE_EXPORTS_RESOLVE Logic
   Inputs: packageURL:string, subpath:string, exports:Object|string|array, conditions:Array
   a. if exports string/array or object no dot-keys → mainExport
      → resolve via PACKAGE_TARGET_RESOLVE(packageURL,mainExport,null,false,conditions)
   b. if exports["."] defined → mainExport
   c. if only dot-keys → assert subpath starts with "./" then use PACKAGE_IMPORTS_EXPORTS_RESOLVE
   d. else → error



## Supplementary Details
Flags and Options:
--experimental-wasm-modules: enables .wasm format detection
--experimental-addon-modules: enables .node addon format
Input markers: .mjs extension, package.json "type":"module", --input-type=module flag
CommonJS interop: import.meta.resolve("specifier") returns string synchronous
Recommended utility: url.pathToFileURL(path) when constructing file: URL imports
module.createRequire(moduleURL) to replicate require in ES modules
syncBuiltinESMExports(): updates named exports of built-in modules after mutation


## Reference Details
import.meta.resolve(specifier:string):string
Throws on invalid URL or specifier patterns. Returns absolute URL string. Synchronous.

module.syncBuiltinESMExports():void
Updates named exports of built-in modules to reflect mutations on default export.

module.createRequire(id:string|URL):RequireFunction
Creates require function scoped to module URL or filename.

Dynamic import:
const module = await import(specifier:string);

Error conditions and exceptions:
- Invalid Module Specifier: when specifier is not valid URL, package name, or subpath
- Invalid Package Configuration: malformed package.json
- Invalid Package Target: exports/ imports target invalid pattern or type
- Package Path Not Exported: exports mapping missing target
- Package Import Not Defined: imports mapping missing key
- Module Not Found: file or package not found
- Unsupported Directory Import: when resolved path is directory

Best Practices:
Use explicit file extensions for imports; avoid implicit index resolution. Provide package.json exports field to lock internal paths. Use import.meta.resolve for cross-platform path resolution.

Troubleshooting:
Command: node --trace-warnings file.mjs
Expected Output: stack trace indicating error type and specifier
Command: node --experimental-wasm-modules app.mjs
If .wasm not enabled: load-time error “Unsupported module format"



## Information Dense Extract
ESM_RESOLVE(specifier,parentURL)->resolvedURL,format: valid URL,relativeURL,#imports->PACKAGE_IMPORTS_RESOLVE,bare->PACKAGE_RESOLVE; file: validated for no %2F/%5C,existence,directory; realpath->ESM_FILE_FORMAT. ESM_FILE_FORMAT: .mjs->module,.cjs->commonjs,.json->json,.wasm(with flag)->wasm,.node(with flag)->addon; .js/no ext->package.json type or source syntax detection(import/export/await/import.meta) else commonjs. PACKAGE_RESOLVE: builtin->node:, PACKAGE_SELF_RESOLVE, upward node_modules: pjson.exports->PACKAGE_EXPORTS_RESOLVE, main->main, subpath->relative. PACKAGE_EXPORTS_RESOLVE: string/array or obj no dot-keys->PACKAGE_TARGET_RESOLVE; obj with"."->main; only dot-keys->{'./...'}->PACKAGE_IMPORTS_EXPORTS_RESOLVE; else error. PACKAGE_TARGET_RESOLVE handles string, array, object with conditions, wildcards. Errors: Invalid Module Specifier, Invalid Package Configuration, Invalid Package Target, Package Path Not Exported, Package Import Not Defined, Module Not Found, Unsupported Directory Import.

## Sanitised Extract
Table of Contents:
1. ESM_RESOLVE Algorithm
2. ESM_FILE_FORMAT Rules
3. PACKAGE_RESOLVE Steps
4. PACKAGE_EXPORTS_RESOLVE Logic

1. ESM_RESOLVE Algorithm
   Inputs: specifier:string, parentURL:string
   Steps:
     a. If specifier is valid URL  resolved=normalized URL
     b. If starts with '/','./','../'  resolved=URL.resolve(parentURL, specifier)
     c. If starts with '#'  call PACKAGE_IMPORTS_RESOLVE(specifier,parentURL,['node','import'])
     d. Else  call PACKAGE_RESOLVE(specifier,parentURL)
     e. If resolved protocol == file:
         Reject if %2F or %5C present
         Error if directory or not exists
         resolved=realpath(resolved), preserve query/fragment
         format=ESM_FILE_FORMAT(resolved)
     f. Else format=protocol-based format lookup
     g. Return {resolved,format}

2. ESM_FILE_FORMAT Rules
   File extensions map to formats:
     .mjs  module
     .cjs  commonjs
     .json  json
     .wasm (with flag)  wasm
     .node (with flag)  addon
   .js & no ext:
      If package.json type field  module|commonjs
      Else detect syntax: import/export/top-level await/import.meta  module; else commonjs

3. PACKAGE_RESOLVE Steps
   Input: packageSpecifier:string, parentURL:string
   a. Builtin  return 'node:'+name
   b. Parse packageName and subpath
   c. If in package scope and package.json.name==packageName & exports defined  PACKAGE_EXPORTS_RESOLVE
   d. Loop upward into node_modules:
       Read package.json; if exports defined  PACKAGE_EXPORTS_RESOLVE
       If subpath=='.' and main present  resolve main
       Else resolve subpath relative to package URL
   e. On failure  Module Not Found

4. PACKAGE_EXPORTS_RESOLVE Logic
   Inputs: packageURL:string, subpath:string, exports:Object|string|array, conditions:Array
   a. if exports string/array or object no dot-keys  mainExport
       resolve via PACKAGE_TARGET_RESOLVE(packageURL,mainExport,null,false,conditions)
   b. if exports['.'] defined  mainExport
   c. if only dot-keys  assert subpath starts with './' then use PACKAGE_IMPORTS_EXPORTS_RESOLVE
   d. else  error

## Original Source
Node.js ECMAScript Modules
https://nodejs.org/api/esm.html

## Digest of ESM_RESOLUTION

# ESM_RESOLUTION_SPECIFICATION (retrieved 2024-06-15)

## ESM_RESOLVE(specifier, parentURL)

Defines resolution of import specifier to a fully qualified URL and suggested format.

1. If specifier is valid URL string, parse and reserialize; set resolved = URL.
2. Else if specifier starts with "/", "./", or "../": resolved = resolve relative URL against parentURL.
3. Else if specifier starts with "#": resolved = PACKAGE_IMPORTS_RESOLVE(specifier, parentURL, defaultConditions).
4. Else: resolved = PACKAGE_RESOLVE(specifier, parentURL).
5. If resolved URL protocol is "file:":
   - Reject percent-encoded "/" or "\\" segments with Invalid Module Specifier.
   - If path is directory: Unsupported Directory Import error.
   - If file does not exist: Module Not Found error.
   - Replace resolved with realpath maintaining query and fragment; format = ESM_FILE_FORMAT(resolved).
6. Else: format = content-type-based module format.
7. Return {format, resolved} to load phase.

## ESM_FILE_FORMAT(url)

Determines module format:

- .mjs → "module"
- .cjs → "commonjs"
- .json → "json"
- .wasm → "wasm" if --experimental-wasm-modules enabled
- .node → "addon" if --experimental-addon-modules enabled
- .js without extension: use package.json "type" field or source syntax detection:
   • type=module/commonjs yields that format
   • else parse source: static import/export/top-level await → "module" else "commonjs"
- no extension: same as above plus wasm header detection
- unknown → undefined (load-phase error)

## PACKAGE_RESOLVE(packageSpecifier, parentURL)

1. Builtin module name → return "node:"+packageSpecifier.
2. Parse packageName and packageSubpath.
3. PACKAGE_SELF_RESOLVE: find nearest package.json with matching name and exports; if matches, return exports resolution.
4. Traverse upward node_modules dirs:
   - Read pjson.exports: if exists, PACKAGE_EXPORTS_RESOLVE.
   - Else if main field and subpath==".": resolve main.
   - Else resolve subpath relative to package root.
5. On failure: Module Not Found error.

## PACKAGE_EXPORTS_RESOLVE(packageURL, subpath, exports, conditions)

1. exports as string/array/object with no non-dot keys → mainExport; resolve via PACKAGE_TARGET_RESOLVE.
2. exports object with "." key → mainExport.
3. Exports object with only dot-keys: match subpath = "./" prefix; use PACKAGE_IMPORTS_EXPORTS_RESOLVE.
4. Else: Package Path Not Exported error.

## Error types

Invalid Module Specifier
Invalid Package Configuration
Invalid Package Target
Package Path Not Exported
Package Import Not Defined
Module Not Found
Unsupported Directory Import


## Attribution
- Source: Node.js ECMAScript Modules
- URL: https://nodejs.org/api/esm.html
- License: License
- Crawl Date: 2025-05-08T06:30:28.143Z
- Data Size: 4217183 bytes
- Links Found: 3280

## Retrieved
2025-05-08
