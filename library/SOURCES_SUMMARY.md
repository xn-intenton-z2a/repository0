SOURCES_SUMMARY

Table of contents
1. FizzBuzz algorithm rules (deterministic implementation)
2. JavaScript modules (ESM vs CommonJS, file extensions, package.json type)
3. Number.isInteger — signature, edge cases, exact behavior
4. RangeError — constructor and usage patterns
5. NPM package: fizzbuzz — installation and expected API pattern
6. Vitest — installation, CLI flags, and config keys
7. Supplementary details (validation constants, performance bounds)
8. Reference details (exact signatures, parameter lists, return types, config keys)
9. Detailed digest (SOURCES.md content and retrieval date)
10. Attribution and data size


1. FizzBuzz algorithm rules (deterministic implementation)
- For each integer i in the inclusive sequence 1..n produce a value at index (i-1) in the returned sequence.
- Output rules (priority order):
  - If i % 3 === 0 AND i % 5 === 0 -> output the exact string FizzBuzz
  - Else if i % 3 === 0 -> output the exact string Fizz
  - Else if i % 5 === 0 -> output the exact string Buzz
  - Else -> output the integer i as a number (preferred for strongly-typed APIs) or as its decimal string when API requires string outputs
- Implementation-critical: test combined divisibility first (i % 15 === 0) or explicitly check both 3 and 5 to ensure the combined case is emitted.
- Deterministic contract: output array length must equal n; element at index (i-1) corresponds to integer i.

2. JavaScript modules (ESM vs CommonJS, file extensions, package.json type)
- ESM named export syntax: export function name(params) { /*...*/ }
- ESM default export syntax: export default expression
- ESM import syntax: import defaultExport from 'module'; import { named } from 'module';
- Dynamic import syntax: await import('module'); returns a promise resolving to module namespace object
- CommonJS export syntax: module.exports = value; or exports.named = value;
- CommonJS import syntax (in CJS): const mod = require('module');
- File extension rules and package.json type:
  - If package.json contains "type": "module" then .js files are interpreted as ESM by Node.js >= 12 (recommended Node >= 24 for this repo).
  - If package.json omits type or sets "type": "commonjs" then .js is CommonJS; use .mjs for explicit ESM when using CommonJS package type.
  - Use .cjs to force CommonJS when package type is module.
- MIME and web usage: server must deliver JavaScript modules with Content-Type: text/javascript and supporting import maps if used in browsers.

3. Number.isInteger — signature, edge cases, exact behavior
- Signature: Number.isInteger(value) -> boolean
- Parameters: value — any JavaScript value
- Return: true if typeof value === 'number' and value is finite and its numeric value is mathematically an integer (no fractional part), otherwise false
- Exact behavior and edge cases:
  - Returns false for NaN, Infinity and -Infinity
  - Returns false for non-number types (strings, booleans, objects, arrays)
  - Because JavaScript numbers are IEEE-754 double-precision floats, very large integers beyond Number.MAX_SAFE_INTEGER may be represented approximately; Number.isInteger performs the integer test against the numeric value as represented by IEEE-754
  - Examples of canonical checks to validate an API parameter n:
    - if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
    - if (!Number.isFinite(n)) throw new RangeError('n must be finite')

4. RangeError — constructor and usage patterns
- Constructor signature: new RangeError(message?: string) -> RangeError instance
- Use RangeError to indicate values that are outside of allowed numeric range or inappropriate for numeric arguments
- Example usage patterns (textual only):
  - if (n < 1) throw new RangeError('n must be >= 1')
  - if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)
- RangeError inherits from Error; check via instanceof RangeError

5. NPM package: fizzbuzz — installation and expected API pattern
- Installation: npm install --save fizzbuzz
- Typical import patterns (both styles):
  - ESM: import fizzBuzz from 'fizzbuzz';
  - CommonJS: const fizzBuzz = require('fizzbuzz');
- Expected canonical API signature (common, authoritative pattern for a fizzbuzz helper):
  - fizzBuzz(n: number) -> Array<string | number>
  - Parameters: n — integer >= 1
  - Returns: Array of length n where element[i-1] corresponds to i per rule set above
- If the package exposes CLI, expected pattern: n passed as command-line arg, outputs newline-separated sequence to stdout, exit code 0 on success; invalid numeric input -> stderr message and non-zero exit code

6. Vitest — installation, CLI flags, and config keys
- Install: npm install --save-dev vitest
- Common CLI usage: npx vitest --run or npx vitest (interactive watch by default without --run)
- Common flags used in CI: --run, --coverage, --config <file>, --reporter <name>, --threads <true|false>, --silent
- Exit codes: 0 -> all tests passed; 1 -> failures or fatal error (useful for CI detection)
- Configuration keys (defineConfig):
  - include: string | string[] — globs to include test files
  - exclude: string | string[] — globs to exclude
  - environment: 'node' | 'jsdom' | string
  - globals: boolean — if true, test globals (describe/test/expect) are injected
  - setupFiles / setupFilesAsync: string[] — paths executed before tests
  - reporters: Array<string|[string,object]>
  - threads: boolean

7. Supplementary details (validation constants, performance bounds)
- Recommended validation constants for public APIs:
  - MIN_N = 1
  - MAX_N = 10_000_000 (10e6) as a practical upper bound for in-memory array returns; choose lower if memory constrained
- Memory and performance: returning an Array of length n consumes O(n) memory; generating iteratively and streaming (or yielding) may be preferred for very large n
- Recommended error types: use RangeError for numeric parameter violations; use TypeError for wrong parameter types for non-numeric parameters

8. Reference details (exact signatures, parameter lists, return types, config keys)
- fizzBuzz: function fizzBuzz(n: number): Array<string|number>
  - Parameters: n — integer, MIN_N <= n <= MAX_N
  - Returns: array with length n; element at index (i-1) is either 'Fizz', 'Buzz', 'FizzBuzz', or the numeric i value
- Number.isInteger(value): boolean
- new RangeError(message?: string): RangeError
- ESM exports:
  - export function fizzBuzz(n) { /* ... */ }
  - export default fizzBuzz
- CommonJS exports:
  - module.exports = fizzBuzz
- Vitest config keys and types (textual listing): include: string | string[]; exclude: string | string[]; environment: string; globals: boolean; setupFiles: string[]; setupFilesAsync: string[]; reporters: Array<string|[string,any]>; threads: boolean

9. Detailed digest (SOURCES.md content and retrieval date)
- Retrieved sources and mapped topics (retrieval date: 2026-03-08):
  - https://en.wikipedia.org/wiki/Fizz_buzz  -> authoritative algorithm rules and cultural background; used for canonical rule set above
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  -> ESM/CJS patterns, import/export, .mjs/.cjs, package.json "type"
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  -> exact Number.isInteger signature and edge-case behavior
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError -> RangeError constructor and usage guidance
  - https://www.npmjs.com/package/fizzbuzz  -> typical npm package install and expected function/CLI patterns for fizzbuzz helpers
  - https://vitest.dev/guide/  -> installation, CLI flags, and configuration keys for Vitest
- Retrieval date: 2026-03-08

10. Attribution and data size
- Source: file SOURCES.md from repository root listing the above URLs
- Crawled items: 6 URLs
- Raw byte size of SOURCES.md at retrieval: 591 bytes
- Attribution: content extracted from the listed resources; primary authoritative specs referenced are MDN (Number.isInteger, RangeError, Modules), Wikipedia (FizzBuzz), npm registry (fizzbuzz), Vitest docs (vitest.dev)


Supplementary notes
- This document is a normalized, implementation-focused extraction of the technical content implied by SOURCES.md: it contains explicit API signatures, parameter validation rules, exact error types to throw, and practical config keys for test runner setup.
- For implementation, prefer ESM exports in new code in this repository: ensure package.json contains "type": "module" or use .mjs filenames as needed.

