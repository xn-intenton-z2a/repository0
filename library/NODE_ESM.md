NODE_ESM

Normalised extract:
- Enabling ESM in Node.js: set package.json field "type": "module" OR use .mjs file extensions.
- Use import / export syntax for named and default exports; require() is not available for ESM modules.
- File resolution: include file extensions in import specifiers (import './lib/main.js').

Table of contents:
1. Enabling ESM
2. Module syntax and resolution
3. Import/Export rules
4. Interop with CommonJS
5. Practical integration notes for library exports

Details:
1. Enabling ESM
   - Set package.json: { "type": "module" } to treat .js as ESM
   - Alternatively, use .mjs extension for module files

2. Module syntax and resolution
   - Use import { named } from './module.js' (note explicit extension recommended)
   - Top-level await is available in ESM contexts where supported by Node version

3. Import/Export rules
   - Exports are static; named exports create live bindings
   - Default export available via export default

4. Interop with CommonJS
   - CommonJS require cannot import ESM named bindings; use dynamic import() in CJS or provide dual package entrypoints if needed
   - When importing CommonJS into ESM, the module namespace may provide a default property with the CJS exports

5. Practical integration for this project
   - Export fizzBuzz and fizzBuzzSingle as named exports from src/lib/main.js: export function fizzBuzz(...) {} ; export function fizzBuzzSingle(...) {}
   - Consumers import with: import { fizzBuzz, fizzBuzzSingle } from './lib/main.js'

Reference details:
- Node ESM documentation: https://nodejs.org/api/esm.html
- Example package.json: { "type": "module" }

Detailed digest:
- Source: Node.js "Modules: ECMAScript modules" (nodejs.org)
- Retrieval date: 2026-03-21
- Bytes fetched during crawl: 125511

Attribution:
- Node.js Documentation — https://nodejs.org/api/esm.html
