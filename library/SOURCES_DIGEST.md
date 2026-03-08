SOURCES_DIGEST

Table of contents
1. Normalised extract
  1.1 FizzBuzz canonical mapping and function contract
  1.2 Input validation and error semantics
  1.3 JavaScript modules: resolution, export/import, import maps
  1.4 Number.isInteger exact behavior
  1.5 RangeError constructor and usage patterns
  1.6 NPM package integration checklist (fizzbuzz) — install & inspection
  1.7 Vitest: install, config, CLI patterns
2. Supplementary details
3. Reference details
4. Detailed digest (sources and retrieval date)
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz canonical mapping and function contract
- Function signature: fizzBuzz(n: number) -> Array<string | number>
- Output rules (apply in exact priority order for each integer i from 1..n):
  - If (i % 15 === 0) output the exact string FizzBuzz
  - Else if (i % 3 === 0) output the exact string Fizz
  - Else if (i % 5 === 0) output the exact string Buzz
  - Else output the integer i as a native numeric value
- Invariants: returned array length MUST equal n; element ordering MUST correspond to integers 1..n; non-Fizz/Buzz entries MUST be numbers not strings.

1.2 Input validation and error semantics
- Validate parameter n with these exact checks in this order:
  1. Type check: typeof n === 'number' (reject non-number types)
  2. Finite check: Number.isFinite(n) === true (reject NaN, Infinity)
  3. Integer check: Number.isInteger(n) === true
  4. Range/bounds checks as required (e.g., n >= 1 and n <= MAX_N)
- On violation of numeric-domain constraints use RangeError with short machine-parseable messages starting with the parameter name, e.g., "n must be an integer", "n must be >= 1", "n must be <= 1000000".
- Use TypeError for non-numeric-type mismatches (e.g., if you accept string input separately, use explicit parsing and throw TypeError on invalid forms).

1.3 JavaScript modules: resolution, export/import, import maps
- package.json "type" rules: "module" => .js parsed as ESM; "commonjs" or absent => .js parsed as CJS; .mjs always ESM; .cjs always CJS.
- Exporting features: use top-level export declarations or single export list: export const name = "x"; export { name, fn }.
- Importing: import { name } from "./path/to/module.js"; imported bindings are read-only views; properties on imported objects can be mutated but binding cannot be reassigned.
- Import maps: define imports mapping inside a script type=importmap JSON object; keys without trailing slash match exact specifiers, keys with trailing slash are path-prefix matches; resolution chooses the longest matching key.
- Browser server requirement: serve modules with a JavaScript MIME type (e.g., Content-Type: text/javascript) or browsers may reject with MIME type errors.
- Bare specifiers in browsers require an import map; Node.js resolves bare specifiers via package resolution (node_modules, package.json exports/main).

1.4 Number.isInteger exact behavior
- Signature: Number.isInteger(value) -> boolean
- Algorithmic semantics (exact): return true iff Type(value) is Number, value is finite, and mathematical value has zero fractional component.
- Returns false for NaN, +Infinity, -Infinity, and non-number types (string, boolean, object, null, undefined, Symbol, BigInt).
- Due to IEEE-754 representation, some floating literals may appear integer (e.g., 5.0000000000000001 is represented as 5 and returns true); values beyond Number.MAX_SAFE_INTEGER may lose integer semantics despite isInteger returning true.

1.5 RangeError constructor and usage patterns
- Constructor: new RangeError(message?: string) -> RangeError with name === 'RangeError' and instanceof RangeError === true.
- Use RangeError specifically for numeric out-of-domain violations; prefer short messages: "param must be >= X", "param must be an integer". Do NOT use RangeError for non-numeric type mismatches.
- RangeError is serializable (structuredClone) and transferable between Workers with postMessage.

1.6 NPM package integration checklist (fizzbuzz)
- Installation commands (standard): npm install --save fizzbuzz  OR yarn add fizzbuzz  OR pnpm add fizzbuzz
- For CI reproducibility use lockfile-driven installs: npm ci, yarn install --frozen-lockfile, pnpm install --frozen-lockfile.
- Inspect metadata before use: npm view fizzbuzz --json  to read package.json fields (versions, main/module/types/bin/exports).
- Verify package entry points: look for "main", "module", "exports", and "bin" to determine programmatic API vs CLI binaries.
- Audit and security: run npm audit or pin exact semver version with npm install fizzbuzz@<version>.

1.7 Vitest: install, config, CLI patterns
- Install dev dependency: npm install -D vitest  (alternatives: yarn add -D vitest, pnpm add -D vitest)
- Requirements: Vite >= 6.0.0 and Node >= 20.0.0.
- Test files discovery: default file name patterns containing .test. or .spec. (e.g., foo.test.js).
- Config precedence: vitest will read vite.config.* if present; vitest.config.* has higher priority than vite.config; use defineConfig from 'vitest/config' or place test config under test property in vite config.
- CLI: use npm script "test": "vitest" or run npx vitest; run once with vitest run; coverage with vitest run --coverage.
- Projects support: define multiple project configs under test.projects for running different environments (node, happy-dom, etc.).

2. Supplementary details
- Implementation pattern for fizzBuzz (imperative): allocate array of length n and loop i=1..n pushing either number or exact strings per mapping. For large n, consider generator form to stream values.
- Suggested MAX_N guard: if supporting very large sequences, enforce an upper bound and document memory vs streaming trade-offs; throw RangeError when exceeded.
- Export patterns for library: provide both ESM export (export function fizzBuzz) and a small CommonJS wrapper if packaging for mixed-type consumers (use .cjs or package.json exports mapping).
- Testing checklist: include unit tests covering edge cases: n=1, n=15 (FizzBuzz present), non-integer inputs, NaN, Infinity, negative, zero, very large n, and proper type of non-Fizz entries (numbers not strings).

3. Reference details (exact API signatures & config entries)
- fizzBuzz: signature: fizzBuzz(n: number): Array<string | number>
  - Throws: RangeError("n must be an integer") if !Number.isInteger(n)
  - Throws: RangeError("n must be >= 1") if n < 1
  - Returns: array length === n with entries per canonical mapping
- Number.isInteger(value): boolean
- RangeError(message?: string): constructor signature -> RangeError
- package.json type field values: "module" | "commonjs"
- import map JSON structure example: { "imports": { "name": "./path.js", "pkg/": "./pkg/" } }
- Vitest config snippet semantics: defineConfig({ test: { environment: 'node' | 'happy-dom', projects: [ ... ], setupFiles: [ ... ] } })
- Vitest CLI flags: run (single-run) -> vitest run; watch -> vitest; coverage flag -> --coverage

4. Detailed digest
- Sources fetched and technical content extracted on 2026-03-08T21:50:01.384Z:
  - https://en.wikipedia.org/wiki/Fizz_buzz  (FizzBuzz canonical mapping, use as interview task; retrieved 2026-03-08)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (module types, export/import, import maps, .mjs vs .js, Content-Type requirements; retrieved 2026-03-08)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (exact semantics of Number.isInteger; retrieved 2026-03-08)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (RangeError constructor, usage patterns, examples; retrieved 2026-03-08)
  - https://www.npmjs.com/package/fizzbuzz  (npm package metadata and install patterns — direct fetch returned HTTP 403 from crawler; use npm view locally or CI to inspect package.json; retrieval attempted 2026-03-08)
  - https://vitest.dev/guide/  (Vitest install, requirements, config precedence with Vite, projects support and CLI; retrieved 2026-03-08)

5. Attribution and crawl data size
- Attribution: Wikipedia Fizz buzz (Wikipedia), MDN Web Docs (Modules guide, Number.isInteger, RangeError), Vitest Guide (vitest.dev), npm registry (npmjs.com package:fizzbuzz — fetch blocked).
- Crawl notes: npmjs.com returned HTTP 403 preventing automated content retrieval; MDN and Wikipedia pages fetched successfully; some MDN content was truncated by the fetch tool where indicated.
- Data size: crawler did not provide byte-accurate response sizes per source in this session; fetched page content lengths approximate (characters): Wikipedia ~1.5k, MDN Modules ~12k (truncated in fetch), MDN Number.isInteger ~2k, MDN RangeError ~1k, Vitest Guide ~9k, npmjs.com fizzbuzz: 0 (403). Treat these as approximate; for authoritative package metadata use `npm view fizzbuzz --json` in CI or local environment.

End of document.
