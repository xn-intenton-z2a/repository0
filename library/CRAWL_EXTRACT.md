CRAWL_EXTRACT

Table of contents
1. Normalised extract
   1.1 FizzBuzz algorithm and deterministic contract
   1.2 Input validation and canonical error semantics
   1.3 JavaScript Modules (export/import rules, .mjs vs .js, import maps)
   1.4 Number.isInteger (signature, exact behavior and edge cases)
   1.5 RangeError (constructor, when to throw, canonical messages)
   1.6 Vitest (installation, CLI, configuration, usage patterns)
2. Supplementary details and implementation knobs
3. Reference details (API signatures, exact messages, config keys)
4. Detailed digest (sources and retrieval metadata)
5. Attribution and crawl data size


1. Normalised extract

1.1 FizzBuzz algorithm and deterministic contract
- For each integer i in the inclusive sequence 1..n produce a value at result index (i-1).
- Mapping (exact strings and priority):
  - If i % 15 === 0 then result[i-1] = FizzBuzz
  - Else if i % 3 === 0 then result[i-1] = Fizz
  - Else if i % 5 === 0 then result[i-1] = Buzz
  - Else result[i-1] = i (JavaScript Number)
- Deterministic contract: returned array length MUST equal n; element order MUST correspond to integers 1..n; non-Fizz/Buzz elements MUST be numeric Number values when API is typed as Array<string | number>.

1.2 Input validation and canonical error semantics
- Canonical numeric validation steps (apply in this order):
  1. If Number.isFinite(n) === false -> throw new RangeError('n must be finite')
  2. If Number.isInteger(n) === false -> throw new RangeError('n must be an integer')
  3. If n < 1 -> throw new RangeError('n must be >= 1')
  4. If n > MAX_N -> throw new RangeError('n must be <= ' + MAX_N) where MAX_N is an implementation-chosen safe upper bound (recommended 10000000)
- Use RangeError for numeric range/type violations. Do not use TypeError for numeric range messages.

1.3 JavaScript Modules (export/import rules, .mjs vs .js, import maps)
- package.json "type" field behavior:
  - "type": "module" -> files with .js are treated as ESM
  - Absence of "type" or "type": "commonjs" -> .js treated as CommonJS
  - .mjs always ESM; .cjs always CommonJS
- Export forms: named exports and aggregated exports. Example canonical exports: export const name = "square"; export function draw(...) { ... } ; or export { name, draw } at module end.
- Import forms: static named import: import { a, b } from "./module.js" ; namespace import: import * as ns from "./module.js" ; dynamic import: await import("./module.js").
- Live bindings: imported values are read-only views; re-assignment must occur in the exporting module.
- .mjs versus .js: use .mjs if you need explicit module file type clarity; ensure server serves correct Content-Type (text/javascript) for .mjs; otherwise prefer .js and rely on package.json "type".
- Import maps (browser): import map is a JSON object in a script type="importmap" providing imports and scope remapping; keys without trailing slash match whole specifier, keys with trailing slash act as path-prefix matches; the most-specific (longest) key wins when multiple matches apply.

1.4 Number.isInteger (signature, exact behavior and edge cases)
- Signature: Number.isInteger(value) -> boolean
- Algorithmic semantics:
  - If Type(value) !== Number -> return false
  - If value is NaN or +Infinity or -Infinity -> return false
  - If value is finite and mathematically integral (no fractional part) -> return true
  - Otherwise return false
- Edge cases due to IEEE-754 precision: numeric literals like 5.0000000000000001 may be represented as 5 and thus return true; very large magnitudes near Number.MAX_SAFE_INTEGER can exhibit precision loss so isInteger may return true for values that are not mathematically exact integers when represented.

1.5 RangeError (constructor, when to throw, canonical messages)
- Constructor: new RangeError(message?) -> RangeError instance with name property "RangeError" and message string.
- Use RangeError when a numeric parameter is outside an allowed domain. Canonical messages (machine-parseable short forms):
  - "n must be an integer" when Number.isInteger(n) === false
  - "n must be >= 1" when n < 1
  - "n must be <= <MAX_N>" when n > MAX_N (concatenate chosen MAX_N)
  - "n must be finite" when Number.isFinite(n) === false
- RangeError instances are serializable and subclass Error. Use instanceof RangeError for detection.

1.6 Vitest (installation, CLI, configuration, usage patterns)
- Installation: npm install -D vitest OR yarn add -D vitest OR pnpm add -D vitest (requires Vite >= 6.0.0 and Node >= 20.0.0)
- CLI: npx vitest or script alias "test": "vitest"; run tests once with vitest run (or vitest --run). To run a single run without watch: vitest run ; for coverage: vitest run --coverage or script "coverage": "vitest run --coverage".
- Configuration priority: vitest reads vite.config.ts by default; to override provide vitest.config.ts or pass --config <file>. Supported config extensions: .js, .mjs, .cjs, .ts, .cts, .mts (not .json).
- Projects: vitest supports multiple project configurations via test.projects in config (glob patterns or explicit entries) to run different environments in one process.
- Automatic dependency prompts can be disabled with VITEST_SKIP_INSTALL_CHECKS=1.


2. Supplementary details and implementation knobs
- Recommended API: export function fizzBuzz(n: number): Array<string | number> ; prefer named ESM export when package type is module.
- Implementation pattern (performance): allocate array of length n once and fill by iterating i from 1..n, evaluating combined divisibility check first (i % 15 === 0) then 3 then 5; complexity O(n) time, O(n) memory.
- MAX_N guidance: choose explicit upper bound for public APIs (example 1e7) to avoid memory/CPU exhaustion; check and throw RangeError with exact message.
- CommonJS consumers: provide CJS interop or dual entry (main for CJS, module for ESM) or document require('package').fizzBuzz usage when a CJS build/export is emitted.
- Testing with Vitest: add package.json script "test": "vitest --run tests/unit/*.test.js" for CI; use npm ci in CI to ensure deterministic installs.


3. Reference details (API signatures, exact messages, config keys)
- fizzBuzz API: export function fizzBuzz(n: number): Array<string | number>
  - Parameters: n (required) finite integer, 1 <= n <= MAX_N
  - Returns: array of length n where element at index i-1 is either string 'Fizz', 'Buzz', 'FizzBuzz' or numeric i
  - Throws (exact): new RangeError('n must be finite') ; new RangeError('n must be an integer') ; new RangeError('n must be >= 1') ; new RangeError('n must be <= ' + MAX_N)
- Number.isInteger signature: Number.isInteger(value) -> boolean
- RangeError constructor: new RangeError(message?: string) -> RangeError ; detection: instance instanceof RangeError
- package.json "type" values: "module" | "commonjs" ; file extension overrides: .mjs (ESM), .cjs (CJS)
- Vitest config keys of interest: test.projects (array), test.environment, test.setupFiles, CLI flags: --config <file>, run vs watch modes, --coverage


4. Detailed digest (sources and retrieval metadata)
- Sources consulted and retrieval date: 2026-03-08
  - Wikipedia: https://en.wikipedia.org/wiki/Fizz_buzz  (content: FizzBuzz game definition, typical sequence, cultural notes)
  - MDN Modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (content: module background, export/import syntax, .mjs vs .js, import maps, feature detection)
  - MDN Number.isInteger: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (content: syntax, parameter, return, edge cases, spec link)
  - MDN RangeError: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (content: description, constructor, examples, spec link)
  - Vitest Guide: https://vitest.dev/guide/  (content: install commands, Node/Vite version constraints, writing tests, config and CLI usage)
  - npmjs fizzbuzz: https://www.npmjs.com/package/fizzbuzz  (fetch failed - HTTP 403; npm registry metadata not retrieved)
- Note: npm package page returned HTTP 403; use npm view fizzbuzz --json locally or npm registry API to retrieve package.json fields when network access or credentials permit.


5. Attribution and crawl data size
- Attribution: content extracted from the public documentation pages listed in the SOURCES.md file (Wikipedia, MDN, Vitest). Specific MDN pages list last-modified timestamps as maintained by MDN contributors (page footers).
- Crawl notes and sizes: fetched MDN Number.isInteger and MDN RangeError full pages; MDN Modules content truncated at 15000-character fetch limit in this run; Wikipedia Fizz_buzz content fetched (intro and examples); Vitest guide fetched (full guide sections used). npmjs page fetch returned 403 so npm package metadata not available from HTTP fetch.
- Retrieved content character counts: approximate (pages varied; MDN pages ~3–15 KB each, Wikipedia intro ~1–2 KB, Vitest guide ~10–20 KB); npm page not retrieved (403).


---

End of CRAWL_EXTRACT
