JS_APIS

Table of contents
1. FizzBuzz core rule set
2. Number.isInteger (syntax, semantics, edge cases)
3. RangeError (usage patterns and constructor)
4. Modules (export/import, .mjs vs .js, import maps, MIME)
5. Vitest (installation, test patterns, configuration, CLI)
6. Supplementary implementation details (validation, API signature, errors)
7. Reference details (exact signatures, parameters, return types, config values)
8. Troubleshooting and best practices
9. Detailed digest (sources and retrieval)
10. Attribution and crawl status

1. FizzBuzz core rule set
- For each integer i in the inclusive sequence 1..n, produce an output at index (i-1) according to the following deterministic rules:
  - If i % 3 === 0 AND i % 5 === 0 -> output the exact string FizzBuzz
  - Else if i % 3 === 0 -> output the exact string Fizz
  - Else if i % 5 === 0 -> output the exact string Buzz
  - Else -> output the integer i (as a number for strongly-typed APIs; string form only if API explicitly returns strings)
- Implementation-critical: test the combined divisibility first (i % 15 === 0) or explicitly check both divisibility conditions to avoid misclassification.
- Deterministic contract: returned array length must equal n and element order must correspond to numbers 1..n.

2. Number.isInteger (syntax, semantics, edge cases)
- Syntax: Number.isInteger(value)
- Parameter: value — the value to be tested for integer-ness.
- Return: boolean true if value is an integer; otherwise false.
- Behavior details:
  - Returns false for NaN, Infinity, -Infinity, non-number typed values (strings, booleans, arrays, objects).
  - Returns true for floating point values that are representable as integral values due to IEEE-754 precision (for example 5.0 and values indistinguishable from 5 due to precision limits).
  - Precision caveat examples and effects:
    - Number.isInteger(5.0000000000000001) may return true because the literal is represented as 5 in IEEE-754.
    - Large numbers near Number.MAX_SAFE_INTEGER may show apparent fractional parts as integers due to precision loss (e.g., 4500000000000000.1 can be considered integer by Number.isInteger).
- Usage guidance for API validation:
  - Use Number.isInteger(n) to assert n is an integer before further checks.
  - Combine with explicit finite checks where appropriate (Number.isFinite is implicit here since NaN/Infinity return false).

3. RangeError (usage patterns and constructor)
- Purpose: throw when an argument's numeric value is outside allowed range or not one of allowed set of values.
- Construction: new RangeError(message) -> Error instance with name === "RangeError" and message as provided.
- Common use-cases:
  - Input numeric bounds (e.g., n < min or n > max)
  - Illegal array lengths
  - Numeric method bad values (toFixed/toExponential/toPrecision)
  - Invalid allowed-string enumerations (example: normalize allowed values)
- Typical pattern for input validation:
  - if (!Number.isInteger(n)) throw new RangeError('n must be an integer');
  - if (n < MIN_N) throw new RangeError('n must be >= ' + MIN_N);
  - if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N);
- Catching pattern example: try { check(n) } catch (err) { if (err instanceof RangeError) { /* handle */ } }

4. Modules (export/import, .mjs vs .js, import maps, MIME)
- Exporting features:
  - Named export example: export const name = "square";
  - Named function export: export function draw(ctx, length, x, y, color) { ...; return { length, x, y, color }; }
  - Aggregate export: export { name, draw, reportArea } at file bottom.
- Importing features:
  - Named import syntax: import { name, draw } from "./modules/square.js"; imported bindings are read-only views (cannot be re-assigned locally).
  - Default and namespace imports follow standard ES module syntax (use as needed; prefer named exports for clarity in libraries).
- .mjs vs .js:
  - Using .mjs makes module intent explicit but may cause server MIME misconfiguration; using .js with type="module" is portable if server serves text/javascript for .js files.
  - If using .mjs ensure server sets Content-Type to a JavaScript MIME (text/javascript) or you will get strict MIME type errors.\n- Import maps (browser-side remapping of module specifiers):
  - Defined in a <script type="importmap"> element as JSON with keys: imports and scopes.
  - imports maps: map bare specifiers to absolute/relative URLs: { "square": "./shapes/square.js" }
  - scopes: provide context-dependent remapping depending on the referrer path. The longest matching scope key is used when multiple match.
  - Path-prefix mapping: keys and values ending with '/' act as prefixes and can remap whole classes of URLs.
  - Use-case: allow bare module names in browser and emulate package resolution like Node (requires importmap support and/or polyfills).
- MIME and server configuration:
  - Browser requires module files be served with JavaScript MIME type (text/javascript); if not, browser throws a strict MIME type error and will not execute the module.
  - Development advice: either run a local server that serves correct MIME types or use .mjs when server supports it.

5. Vitest (installation, test patterns, configuration, CLI)
- Installation: npm install -D vitest (or yarn/pnpm/bun equivalents). Requires Vite >= 6.0.0 and Node >= 20.0.0 (project may require higher; check package.json engines).
- Test file naming: by default test files must include .test. or .spec. in filename (e.g., sum.test.js).
- Example test pattern: import { expect, test } from 'vitest'; test('adds 1 + 2', () => { expect(sum(1,2)).toBe(3) });
- CLI and scripts:
  - npm script "test": "vitest" runs in watch by default; use vitest --run or npm run test to execute tests in CI.
  - Coverage: vitest run --coverage or npm run coverage depending on scripts.
- Configuration:
  - Vitest reads vite.config.ts by default; to override provide vitest.config.ts or pass --config.
  - Supports same set of config extensions as Vite: .js, .mjs, .cjs, .ts, .cts, .mts (no .json).
  - Can merge Vite config via mergeConfig from 'vitest/config' or define separate config but beware override behavior.
  - Projects support: define multiple project configs in test.projects with name, root, environment, setupFiles.
- Automatic dependency installation: Vitest may prompt to install missing dependencies; disable via VITEST_SKIP_INSTALL_CHECKS=1.
- IDE integration: official VS Code extension available for test explorer integration.

6. Supplementary implementation details (validation, API signature, errors)
- Recommended constants and bounds:
  - MIN_N = 1
  - MAX_N = choose safe upper bound (example: 1e7) to avoid OOM/CPU; if exceeded, throw RangeError.
- Recommended primary API signature (ES module): export function fizzBuzz(n: number): Array<string | number>
  - Parameter: n (required) integer >= MIN_N and <= MAX_N
  - Return: Array with length n; index i-1 corresponds to number i; values are either number (i) or exact strings: "Fizz", "Buzz", "FizzBuzz".
- Validation pattern:
  - if (!Number.isInteger(n)) throw new RangeError('n must be an integer');
  - if (n < MIN_N) throw new RangeError('n must be >= ' + MIN_N);
  - if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N);
- Export pattern for library package (ESM):
  - package.json should include "type": "module" to allow .js to be parsed as ESM in Node, or use .mjs file extensions.
- Runtime and engines: align Node engine in package.json (example doc uses node >=24.0.0).

7. Reference details (exact signatures, parameters, return types, config values)
- Function: export function fizzBuzz(n: number): Array<string | number>
  - Parameters:
    - n: integer, required, inclusive upper bound of sequence starting at 1
  - Returns: array length n, items: number | 'Fizz' | 'Buzz' | 'FizzBuzz'
  - Errors thrown:
    - RangeError('n must be an integer') when Number.isInteger(n) === false
    - RangeError('n must be >= 1') when n < 1
    - RangeError('n must be <= ' + MAX_N) when n > MAX_N (if MAX_N enforced)
- Validation helper (preferred): function validateN(n, MIN_N = 1, MAX_N = 10000000) { if (!Number.isInteger(n)) throw new RangeError('n must be an integer'); if (n < MIN_N) throw new RangeError('n must be >= ' + MIN_N); if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N); }
- Module export examples (no code fences):
  - export const name = "square";
  - export function draw(ctx, length, x, y, color) { ... }
  - import { name, draw } from './modules/square.js';
- Import map example JSON (browser importmap script type): { "imports": { "square": "./shapes/square.js", "lodash/": "/node_modules/lodash-es/" }, "scopes": { "/node_modules/dependency/": { "cool-module": "/node_modules/some/other/location/cool-module/index.js" } } }
- Vitest CLI commands and common npm scripts:
  - "test": "vitest"
  - Run once in CI: vitest --run
  - Coverage: vitest run --coverage
- Server MIME requirement: Content-Type header must be a JavaScript MIME (such as text/javascript) for module loading to succeed in browsers.

8. Troubleshooting and best practices
- MIME type error when importing modules in browser: ensure server serves module files with Content-Type: text/javascript; if using .mjs verify server support or use .js with type="module" and package.json type: module for Node environments.
- Unexpected Number.isInteger true on fractional-looking literals: remember IEEE-754 precision; use additional checks if exact decimal fractions matter (avoid relying on string input parsing without validation).
- Performance and safety: choose a MAX_N to protect against OOM and DOS; prefer iterative generation and pre-allocate arrays when generating very large outputs.
- Testing: write unit tests with Vitest; create tests covering validation errors (non-integer, too small, too large) and correctness samples (first 15 values to assert Fizz/Buzz/FizzBuzz positions).
- API compatibility: prefer returning numbers for non-Fizz outputs in typed APIs; provide a string-output mode only if required and explicitly documented.

9. Detailed digest (sources and retrieval)
- Sources consulted (retrieved 2026-03-08):
  - https://en.wikipedia.org/wiki/Fizz_buzz — FizzBuzz rules, common interview usage, alternative variations (digit-triggering rules, other divisibility rules).
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules — ES module export/import syntax, .mjs vs .js considerations, import maps, import specifier resolution, MIME and server notes.
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger — Number.isInteger syntax, return semantics, examples and precision caveats.
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError — RangeError purpose, constructor pattern, examples for numeric and enumerated value checks.
  - https://vitest.dev/guide/ — Vitest installation, test file naming, configuration, projects support, CLI usage and common scripts.
- Crawl status: npm package page https://www.npmjs.com/package/fizzbuzz returned HTTP 403 from crawler; content not retrieved and therefore not included in the digest.
- Retrieval date: 2026-03-08 (as provided in the request)
- Approximate data retrieved per source (character counts are approximate):
  - Wikipedia Fizz_buzz: ~1,500 chars
  - MDN Modules guide: ~9,000 chars (truncated during fetch; full page longer)
  - MDN Number.isInteger: ~2,000 chars
  - MDN RangeError: ~1,200 chars
  - Vitest guide: ~8,000 chars
  - npm fizzbuzz: fetch failed (403) — no content retrieved

10. Attribution and crawl status
- Attribution: content extracted from the listed sources above; please preserve original source attribution when republishing.
- Crawl details: pages fetched on 2026-03-08, one page (npmjs fizzbuzz) failed with 403 and was omitted; other pages were fetched via developer web fetch and condensed into this document.

[NARRATIVE] Consolidated implementation-critical JavaScript API, module, error, and test-framework details from the supplied sources to support a concrete fizz-buzz implementation and test strategy.