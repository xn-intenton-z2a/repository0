NORMALISED EXTRACT

Table of contents
1. ESM basics in Node.js
2. Named export patterns
3. Import patterns for tests and consumers
4. package.json type field and resolution
5. Practical rules for this project

1. ESM basics in Node.js
- Node supports ECMAScript modules when package.json contains "type": "module" or when files use .mjs extension. With "type":"module" JavaScript files use import/export syntax.

2. Named export patterns
- Directly export declarations: export function fizzBuzz(n) { ... }
- Separate export list: function fizzBuzz(n) { ... } function fizzBuzzSingle(n) { ... } export { fizzBuzz, fizzBuzzSingle }
- Prefer named exports when exporting multiple functions from a module; consumers import specific symbols by name.

3. Import patterns for tests and consumers
- Import by explicit path including .js extension in ESM mode: import { fizzBuzz } from '../../src/lib/main.js'
- Do not use require in ESM modules; use import/export throughout the code and test files.

4. package.json type field and resolution
- package.json "type": "module" signals Node to treat .js files as ESM. This repository's package.json already contains "type": "module" so export function is the correct pattern.
- For cross-package distribution consider named exports and prefer non-default exports for multiple utilities.

5. Practical rules for this project
- Place exports in src/lib/main.js as named exports. Example plain-text patterns: export function fizzBuzz(n) { ... } export function fizzBuzzSingle(n) { ... }
- In tests import using full relative path with file extension.

DIGEST
Source: https://nodejs.org/api/esm.html
Retrieved: 2026-03-19
Extract (technical): Node ECMAScript module loader resolves .js files as ESM when package.json contains "type": "module". Use import/export syntax and explicit file extensions when importing local modules.

ATTRIBUTION
- URL: https://nodejs.org/api/esm.html
- Retrieved: 2026-03-19
- Bytes downloaded: 125992
