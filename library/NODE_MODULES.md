Title: NODE_MODULES

Table of contents:
- Named exports and ES modules rules
- package.json main and type fields
- Recommended export patterns for small libraries
- Digest and retrieval metadata
- Attribution and data size

Named exports and ES modules rules:
- When package.json contains "type": "module", use ES module syntax:
  export function fizzBuzz(n) { ... }
  export function fizzBuzzSingle(n) { ... }
- Consumers may import with: import { fizzBuzz, fizzBuzzSingle } from 'your-package'

package.json main and type fields:
- "main" points to entry file; for ESM packages prefer "exports" or set "type":"module" and provide an ES module entry in "main".
- For this repository, src/lib/main.js is the declared main entry.

Recommended export patterns for small libraries:
- Provide named exports for each function and a default export only if a single primary function exists; prefer named exports per mission.
- Example minimal pattern: export function fizzBuzz(...) and export function fizzBuzzSingle(...)

Digest and retrieval metadata:
- Retrieved: 2026-03-21
- Source: https://nodejs.org/api/modules.html
- Extract size (first chunk fetched): approx 90 KB (partial)

Attribution:
- Source: Node.js documentation
- URL: https://nodejs.org/api/modules.html
- Retrieved on 2026-03-21
