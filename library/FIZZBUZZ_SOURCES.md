FIZZBUZZ_SOURCES

Table of contents
1. Normalised extract: core algorithm and contract
2. Input validation and exact error semantics
3. API signature and module consumption
4. JavaScript runtime primitives (Number.isInteger, RangeError)
5. Testing with Vitest (commands and config patterns)
6. NPM package note (fizzbuzz) and fetch status
7. Supplementary implementation details and performance
8. Reference details: exact signatures, messages, CLI commands
9. Detailed digest of SOURCES.md and retrieval metadata
10. Attribution and crawl data

1. Normalised extract: core algorithm and contract
- For each integer i in the inclusive sequence 1..n produce an output at array index (i-1).
- Output mapping (priority order):
  - If i % 15 === 0 -> exact string: FizzBuzz
  - Else if i % 3 === 0 -> exact string: Fizz
  - Else if i % 5 === 0 -> exact string: Buzz
  - Else -> the integer i as a number
- Deterministic contract: returned array length MUST equal n; element at index (i-1) corresponds to integer i. Preserve order and types (use numbers for non-Fizz/Buzz values when API is typed).

2. Input validation and exact error semantics
- Validate inputs using ECMAScript primitives:
  - Use Number.isInteger(n) to test integer-ness.
  - Use Number.isFinite(n) or Number.isFinite check to reject Infinity/NaN.
- Canonical checks and exact throw messages to implement verbatim:
  - if (!Number.isInteger(n)) throw new RangeError('n must be an integer');
  - if (n < 1) throw new RangeError('n must be >= 1');
  - const MAX_N = 10000000; if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N);
  - if (!Number.isFinite(n)) throw new RangeError('n must be finite');
- Use RangeError for all numeric range/type violations (per ECMAScript); do not substitute TypeError for these numeric constraints.

3. API signature and module consumption
- Primary ESM export (named):
  export function fizzBuzz(n: number): Array<string | number>
  - Parameter: n — required, finite integer, 1 <= n <= MAX_N
  - Return: Array of length n, each element exactly one of: 'Fizz', 'Buzz', 'FizzBuzz' or the numeric value i
- CommonJS consumption pattern when a CJS entry exists or interop is provided:
  const { fizzBuzz } = require('package');
- package.json "type" field effects:
  - "type": "module" => .js parsed as ESM; .mjs always ESM; .cjs always CommonJS. Ensure exports/main/module fields are set for correct resolution.

4. JavaScript runtime primitives (Number.isInteger, RangeError)
- Number.isInteger(value): returns true iff Type(value) is Number, value is finite, and numeric value has no fractional part. Returns false for NaN, Infinity, non-number types.
- RangeError(message?): constructor signature: new RangeError(message?: string) -> RangeError instance with name 'RangeError'. Use for numeric domain violations. Instance properties: name = 'RangeError', message = provided string.

5. Testing with Vitest (commands and config patterns)
- Install as devDependency: npm install -D vitest (or yarn add -D vitest, pnpm add -D vitest). Vitest requires Vite >= 6.0.0 and Node >= 20.0.0.
- Typical package.json scripts:
  "test": "vitest"
  "test:unit": "vitest --run --coverage tests/unit/*.test.js"
- CLI patterns:
  - npx vitest --run         (run once)
  - npx vitest --run --coverage
  - vitest reads vite.config.js or vitest.config.ts; priorities: vitest.config.ts > vite.config.ts when specifying test-specific options.
- Test file naming: include .test. or .spec. in filenames by default.

6. NPM package note (fizzbuzz) and fetch status
- Source package name: fizzbuzz (npm). Standard integration points: install via npm install --save fizzbuzz; inspect metadata with npm view fizzbuzz --json; verify tarball with npm pack and inspect.
- Crawl status during retrieval: request to https://www.npmjs.com/package/fizzbuzz returned HTTP 403 Forbidden; no page content was fetched. Implementers should inspect the package via the npm registry API (registry.npmjs.org/fizzbuzz) or use npm CLI locally for metadata instead of scraping the npm website.

7. Supplementary implementation details and performance
- Memory and time: allocating an Array of length n requires O(n) memory; recommended upper bound MAX_N = 10_000_000 to avoid excessive memory usage. If streaming output is required, produce an iterator/generator rather than an in-memory array.
- Algorithmic complexity: O(n) time, single pass; constant-time arithmetic checks per iteration. Prefer checking i % 15 === 0 first for correctness and performance micro-optimisation.
- Alternatives: compute combined divisibility via (i % 3 === 0 && i % 5 === 0) or (i % 15 === 0). For localized optimizations in very hot loops, replace modulo with counters that reset (counter3, counter5) to eliminate modulo cost.

8. Reference details: exact signatures, messages, CLI commands
- fizzBuzz signature: export function fizzBuzz(n: number): Array<string | number>
- Exact RangeError messages to use (machine-parseable):
  - 'n must be an integer'
  - 'n must be >= 1'
  - 'n must be <= ' + MAX_N (string concatenation with MAX_N numeric literal)
  - 'n must be finite'
- Number.isInteger: Number.isInteger(value) -> boolean
- RangeError constructor: new RangeError(message?: string) -> RangeError
- Vitest CLI: npx vitest --run [--coverage] [--config <file>]
- NPM install: npm install --save fizzbuzz (or npm install --save-dev fizzbuzz for dev-only use)

9. Detailed digest of SOURCES.md and retrieval metadata
- SOURCES.md entries processed:
  - https://en.wikipedia.org/wiki/Fizz_buzz  (content fetched and used for game origin and simple rule reference)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (module semantics, import/export, .mjs vs .js, import maps) — fetch truncated due to length in automated crawl; key module resolution and MIME notes extracted
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (full technical behaviour and edge cases extracted)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (constructor, usage, examples extracted)
  - https://www.npmjs.com/package/fizzbuzz  (HTTP 403 during crawl; use npm registry API or npm CLI for package metadata)
  - https://vitest.dev/guide/  (installation, config patterns, CLI, project support; details extracted)
- Retrieval date: 2026-03-08 (UTC)

10. Attribution and crawl data
- Sources and attribution:
  - Wikipedia — Fizz buzz — https://en.wikipedia.org/wiki/Fizz_buzz
  - MDN Web Docs — Modules guide — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - MDN Web Docs — Number.isInteger — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - MDN Web Docs — RangeError — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - npm — fizzbuzz package page — https://www.npmjs.com/package/fizzbuzz (403 forbidden on HTML site fetch; use registry API)
  - Vitest — Guide — https://vitest.dev/guide/
- Crawl notes and data sizes:
  - Wikipedia Fizz_buzz: page content fetched (partial-HTML/text), used for game definition and examples (approx. small, < 10 KB in extracted text)
  - MDN Modules: long guide; fetch returned truncated content in crawl; core sections (module resolution, .mjs/.js rules, import maps, export/import syntax, top-level module behaviors) extracted
  - MDN Number.isInteger: fetched (full) — extracted exact behavior and examples (approx. 2 KB)
  - MDN RangeError: fetched (full) — extracted constructor semantics and usage (approx. 1 KB)
  - Vitest Guide: fetched (full) — installation, scripts, config and CLI patterns extracted (approx. 6 KB)
  - npm fizzbuzz page: HTTP 403 Forbidden, no HTML content obtained from the npm website crawl; use registry.npmjs.org or npm CLI to obtain package.json and tarball

Data retrieval performed 2026-03-08 UTC; implementers should re-run registry queries for the npm package to obtain authoritative package metadata before publishing or pinning dependencies.

[END OF DOCUMENT]
