SOURCES_DETAIL

NORMALISED EXTRACT

Table of contents
1. FizzBuzz rule set and deterministic contract
2. Input validation and error handling
3. API signatures and return types
4. Module system and export/import rules
5. Number.isInteger precise behavior
6. RangeError usage and constructor
7. Vitest CLI and configuration keys
8. Performance, bounds and memory considerations
9. Implementation patterns and examples

1. FizzBuzz rule set and deterministic contract
- For each integer i in the inclusive sequence 1..n produce an output at array index (i-1).
- Exact output mapping:
  - If i % 3 === 0 AND i % 5 === 0 then output the exact string: FizzBuzz
  - Else if i % 3 === 0 then output the exact string: Fizz
  - Else if i % 5 === 0 then output the exact string: Buzz
  - Else output the integer i as a number (preferred for typed APIs) or its decimal string when strings-only API is required.
- Combined-case detection: check i % 15 === 0 first or evaluate (i % 3 === 0 && i % 5 === 0) to avoid misclassification.
- Deterministic contract: returned array length MUST equal n; element order MUST correspond to integers 1..n.

2. Input validation and error handling
- Use Number.isInteger(n) to assert integer-ness.
- Reject NaN, Infinity, -Infinity and non-number types.
- Enforce lower bound: n >= 1.
- Recommended upper bound constant: MAX_N = 10000000 (10 million) to protect memory/time; enforce with RangeError when exceeded.
- Canonical checks and thrown errors (exact messages recommended):
  - if (!Number.isInteger(n)) throw new RangeError('n must be an integer');
  - if (n < 1) throw new RangeError('n must be >= 1');
  - if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N);
- Use RangeError for numeric type/range violations to match ECMAScript semantics: new RangeError(message) -> RangeError instance.

3. API signatures and return types
- Primary (ESM) signature:
  export function fizzBuzz(n: number): Array<string | number>
  - Parameter: n (required) — integer inclusive upper bound for sequence starting at 1.
  - Return: array of length n; elements are either the exact strings 'Fizz','Buzz','FizzBuzz' or the numeric value for non-multiples.
- Alternate strings-only API signature (if required):
  export function fizzBuzzStrings(n: number): string[]
  - Return: array of length n where non-multiples are decimal string representations.
- Deterministic behaviour: no side-effects; pure function.

4. Module system and export/import rules
- package.json "type" field values and effects:
  - "type": "module" -> .js files parsed as ESM.
  - Absent or "commonjs" -> .js files parsed as CommonJS.
  - .mjs -> always ESM; .cjs -> always CommonJS.
- ESM export forms:
  - Named export: export function name(params) { }
  - Default export: export default expression
  - Dynamic import: await import('specifier') returns Promise<ModuleNamespace>
- CommonJS interop:
  - module.exports = value; exports.named = value;
  - Use default interop when importing CJS from ESM with import pkg from 'cjs-package' and read pkg.default if necessary.

5. Number.isInteger precise behavior
- Signature: Number.isInteger(value) -> boolean
- Semantics:
  - Return true only if Type(value) is Number, value is finite, and value is mathematically an integer (no fractional part).
  - Returns false for NaN, +Infinity, -Infinity, and non-number types (string, object, boolean, BigInt, undefined, null).
  - IEEE-754 caveat: very large numbers near or above Number.MAX_SAFE_INTEGER may be represented as integers but lose arithmetic safety.

6. RangeError usage and constructor
- Constructor: new RangeError(message?: string) -> RangeError instance.
- Use-case: throw RangeError when a numeric parameter is outside allowed bounds or invalid numeric type (e.g., non-integer where integer required).
- Recommended canonical messages for public APIs: 'n must be an integer', 'n must be >= 1', 'n must be <= <MAX_N>'.

7. Vitest CLI and configuration keys
- Install: npm install --save-dev vitest
- Common CLI patterns and flags:
  - npx vitest --run            // run tests once
  - npx vitest --watch          // watch mode
  - npx vitest --run --coverage
  - Common npm scripts used in this repo: "test": "vitest --run tests/unit/*.test.js"
- Configuration schema (vitest.config.js using defineConfig): import { defineConfig } from 'vitest/config'; export default defineConfig({ test: { include, exclude, environment, globals, setupFiles, setupFilesAsync, reporters, threads } })
- Precise config keys and types:
  - include: string | string[]  (globs to include; default ['**/*.test.*','**/*.spec.*'])
  - exclude: string | string[]  (globs to exclude; default ['node_modules'])
  - environment: string         ('node' | 'jsdom' | custom)
  - globals: boolean           (provide global test APIs when true)
  - setupFiles: string[]       (sync files run before tests)
  - setupFilesAsync: string[]  (async setup files returning Promise)
  - reporters: Array<string | [string, any]>
  - threads: boolean           (enable worker threads)

8. Performance, bounds and memory considerations
- Time complexity: O(n) to compute n outputs.
- Memory complexity: O(n) for array-returning API. For large n prefer streaming/generator API to avoid O(n) memory.
- Practical upper bound recommendation: MAX_N = 1e7. For n near this value expect significant memory and time usage; prefer chunked processing.

9. Implementation patterns and examples
- Safe implementation checklist:
  - Validate input using Number.isInteger and explicit bounds.
  - Preallocate output array of length n and fill by index to ensure deterministic order.
  - Use integer arithmetic modulo operations; prefer a single pass with conditional checks ordered for combined-case first.
  - Return a pure array; do not mutate external state.
- Example behaviour (described, not quoted): fizzBuzz(5) -> [1, 2, 'Fizz', 4, 'Buzz']

SUPPLEMENTARY DETAILS

Technical specifications and implementation details
- MAX_N constant: 10000000 (10_000_000) — choose lower if environment memory constrained.
- Preallocation pattern: const out = new Array(n); for (let i = 1; i <= n; i++) { const idx = i - 1; if (i % 15 === 0) out[idx] = 'FizzBuzz'; else if (i % 3 === 0) out[idx] = 'Fizz'; else if (i % 5 === 0) out[idx] = 'Buzz'; else out[idx] = i; }
- Generator/stream alternative signature: export function* fizzBuzzGenerator(n: number): Generator<string | number, void, unknown>
- CLI packaging: expose both library API (src/lib/fizz.js) and CLI entrypoint (bin) that parses integer argument with same validation and prints newline-separated outputs.

REFERENCE DETAILS (API SPECIFICATIONS, SIGNATURES, CONFIG)

1) fizzBuzz
- Signature: export function fizzBuzz(n: number): Array<string | number>
- Parameters: n — integer >= 1 and <= MAX_N
- Returns: array length n with element i-1 corresponding to integer i
- Throws: RangeError('n must be an integer') if !Number.isInteger(n)
          RangeError('n must be >= 1') if n < 1
          RangeError('n must be <= ' + MAX_N) if n > MAX_N

2) fizzBuzzStrings (optional)
- Signature: export function fizzBuzzStrings(n: number): string[]
- Behavior: identical to fizzBuzz but non-multiples returned as decimal strings

3) fizzBuzzGenerator (optional)
- Signature: export function* fizzBuzzGenerator(n: number): Generator<string | number>
- Behavior: yields elements in sequence without allocating full array

4) Number.isInteger
- Signature: Number.isInteger(value: any): boolean
- Return: true if typeof value === 'number' && isFinite(value) && Math.floor(value) === value

5) RangeError
- Constructor: new RangeError(message?: string) -> RangeError
- Use: throw new RangeError(message)

6) Vitest defineConfig
- Import: import { defineConfig } from 'vitest/config'
- Usage: export default defineConfig({ test: { include: ['**/*.test.*'], exclude: ['node_modules'], environment: 'node', globals: true, setupFiles: [], reporters: ['default'], threads: true } })

TROUBLESHOOTING

- Symptom: Unexpected TypeError or incorrect outputs for combined multiples.
  - Fix: Ensure combined-case check (i % 15 === 0) is evaluated before single-case checks.
- Symptom: 'n must be an integer' thrown unexpectedly for numeric input like 5.0.
  - Fix: Number literals like 5.0 are valid numbers and Number.isInteger(5.0) returns true; if false, ensure input wasn't a string; coerce or parse first with Number(input) and revalidate.
- Symptom: Out of memory for large n.
  - Fix: Lower MAX_N or implement generator/streaming API to process in chunks.
- Symptom: Module import errors when switching between ESM and CommonJS.
  - Fix: Ensure package.json "type" matches intended module system or use .mjs/.cjs extensions. When importing CJS from ESM, check for default export on require interop.

DIGEST AND RETRIEVAL

Source list and retrieval date: 2026-03-08
- https://en.wikipedia.org/wiki/Fizz_buzz  (FizzBuzz algorithm rules and common implementations)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (ESM vs CJS rules, package.json type behavior)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (Number.isInteger signature and behavior)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (RangeError usage and constructor)
- https://www.npmjs.com/package/fizzbuzz  (NPM package reference; typical install and usage patterns)
- https://vitest.dev/guide/  (Vitest installation, CLI flags, and configuration schema)

Attribution and data size
- Attribution: Content extracted from the URLs listed in the Source list above; see each URL for original authorship.
- Approximate retrieved content size during crawl: ~12 KB total (estimate across all source pages).

END OF DOCUMENT
