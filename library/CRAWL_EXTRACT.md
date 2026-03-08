CRAWL_EXTRACT

Table of contents
1. Normalised extract (canonical, directly actionable technical details)
   1.1 FizzBuzz canonical implementation
   1.2 Function signature and contract
   1.3 Deterministic mapping rules and invariants
   1.4 Input validation and error semantics
   1.5 Number.isInteger exact semantics
   1.6 RangeError constructor and message conventions
   1.7 JavaScript module resolution and package.json "type" rules
   1.8 Vitest essential commands and config patterns
2. Supplementary details (specs and implementation complements)
3. Reference details (API signatures, config keys, CLI flags, patterns)
4. Detailed digest (source extracts and retrieval date)
5. Attribution and crawl metadata (data sizes, failures)


1. Normalised extract (canonical, directly actionable technical details)

1.1 FizzBuzz canonical implementation
- Function contract: fizzBuzz(n: number) -> Array<string | number>
- For i = 1..n inclusive produce exactly one output per integer in sequence; outputs must be native numbers for numeric entries and exact strings for tokens: Fizz, Buzz, FizzBuzz.
- Token precedence (apply in this exact order):
  1) if i % 15 === 0 then output the exact string FizzBuzz
  2) else if i % 3 === 0 then output the exact string Fizz
  3) else if i % 5 === 0 then output the exact string Buzz
  4) else output numeric i (JavaScript Number)
- Invariants to enforce: returned array length === n; ordering corresponds to integers 1..n; non-token entries are numbers (not strings).

1.2 Function signature and contract
- Signature: fizzBuzz(n: number): Array<number | string>
- Behavior: Deterministic, pure mapping from integer domain 1..n to outputs defined above; no side-effects, no console output unless explicitly provided by a separate function.
- Complexity: O(n) time, O(n) memory for eager array; generator/yield variant allowed for streaming with O(1) additional memory.

1.3 Deterministic mapping rules and invariants
- Use integer arithmetic modulo operations with exact precedence above to ensure reproducible output across implementations and platforms.
- For streaming/generator implementations yield tokens in the same order and types.

1.4 Input validation and error semantics
- Validation steps and order (must be applied in this order):
  1) Type check: typeof n === 'number' -> if fails, throw TypeError('n must be a number')
  2) Finite check: Number.isFinite(n) === true -> if fails, throw RangeError('n must be finite')
  3) Integer check: Number.isInteger(n) === true -> if fails, throw RangeError('n must be an integer')
  4) Lower bound: if n < 1 throw RangeError('n must be >= 1')
  5) Optional upper bound: if n > MAX_N throw RangeError('n must be <= ' + MAX_N)
- Error type conventions: use TypeError for type mismatches and RangeError for numeric domain violations; error messages must be short and machine-parseable, starting with parameter name.

1.5 Number.isInteger exact semantics
- Signature: Number.isInteger(value) -> boolean
- Return true iff Type(value) is Number, value is finite, and value has zero fractional component in IEEE-754 representation.
- Returns false for NaN, +Infinity, -Infinity, and non-number types (strings, booleans, objects, BigInt).
- Note: due to IEEE-754 precision, some floating literals that appear fractional may be represented as exact integers and isInteger may return true (e.g., 5.0000000000000001 -> true in some cases). Implementations should not rely on isInteger to guarantee safe arithmetic beyond Number.MAX_SAFE_INTEGER.

1.6 RangeError constructor and message conventions
- Constructor: new RangeError(message?: string) -> RangeError
- Instance properties: name === 'RangeError', message as passed, instanceof RangeError === true.
- Usage: throw RangeError for numeric value domain violations only; prefer concise messages: 'n must be an integer', 'n must be >= 1', 'n must be <= 1000000'.

1.7 JavaScript module resolution and package.json "type" rules
- package.json "type" field values: exactly "module" or "commonjs". When "type":"module" then files with .js extension are parsed as ESM; when absent or "commonjs" .js files are CommonJS.
- File extensions that fix type regardless of package.json: .mjs => ESM, .cjs => CommonJS.
- Export forms: named exports via export { ... } or export const, default via export default; importing: static import {a} from './x.js', namespace import import * as X from './x.js', dynamic import() returns a Promise.
- Resolution: relative specifiers (./, ../) resolve to files with extension resolution rules; bare specifiers require package resolution via node_modules and package.json exports/main or an import map in browsers.
- For libraries that want dual consumers, provide both module and commonjs entrypoints via package.json exports map or fields 'module' and 'main' and ship .cjs/.mjs files.

1.8 Vitest essential commands and config patterns
- Installation: npm install -D vitest OR yarn add -D vitest OR pnpm add -D vitest. Vitest requires Vite >= 6.0.0 and Node >= 20.0.0.
- Common npm scripts: "test": "vitest"; to run once without watch use npm run test: vitest run or npm run test -- --run.
- Test file discovery: files containing .test. or .spec. in filename by default (example: example.test.js).
- Configuration: Vitest reads vite.config.* test property or vitest.config.* which can be .js/.mjs/.cjs/.ts/.cts/.mts. Use defineConfig from 'vitest/config' and export default defineConfig({ test: { ... } }).
- CI usage: install pinned version and run npm run test (or npm ci && npm test for lockfile-driven install). Disable dependency install prompts with VITEST_SKIP_INSTALL_CHECKS=1.


2. Supplementary details (specs and implementation complements)

2.1 Implementation patterns
- Eager array: allocate new Array(n) and fill by index from 0..n-1 applying mapping; ensures single pass, predictable memory O(n).
- Generator/streaming: implement function* fizzBuzzGenerator(max) { for (i=1;i<=max;i++) yield mapping(i); } to allow constant memory consumption and lazy consumption by callers.
- Precomputation: for very large n and repeated queries, consider caching token positions or using wheel sieving for multiples but only if benchmarked.

2.2 Packaging recommendations
- For npm packages: set package.json "type" appropriately for your chosen module format; provide both 'module' and 'main' fields plus exports map for precise conditional exports.
- For CLI tools, supply a bin field and a small wrapper that parses CLI args, validates using the numeric validation above, and prints tokens or writes to stdout in a streaming fashion.

2.3 Testing guidance
- Unit tests should assert exact token strings and numeric types; e.g., expect(result[0]).toEqual(1) (numeric), expect(result[2]).toBe('Fizz'), expect(result[14]).toBe('FizzBuzz'); assert array length equals n.
- Edge tests: n = 1, n = 3, n = 5, n = 15, invalid types (null, '10'), NaN, Infinity, fractional numbers (3.5), 0 and negative numbers, and very large n boundary tests if upper bound enforced.


3. Reference details (API signatures, config keys, CLI flags, patterns)

3.1 Function and error APIs
- fizzBuzz: signature: function fizzBuzz(n: number): Array<number | string>
  - Throws: TypeError('n must be a number') if typeof n !== 'number'
  - Throws: RangeError('n must be finite') if !Number.isFinite(n)
  - Throws: RangeError('n must be an integer') if !Number.isInteger(n)
  - Throws: RangeError('n must be >= 1') if n < 1
  - Optional: Throws RangeError('n must be <= ' + MAX_N) if n exceeds configured limit
- Number.isInteger(value): boolean
  - Parameters: value: any
  - Returns: boolean true when value is Number and finite and has zero fractional component
- RangeError constructor
  - new RangeError(message?: string) -> RangeError
  - message: optional string; recommended short messages starting with parameter name

3.2 package.json module keys and effects
- "type": "module" => .js parsed as ESM; "type": "commonjs" or absent => .js parsed as CommonJS
- "main": CommonJS entry point (legacy)
- "module": ESM entry (used by some bundlers)
- "exports": conditional exports map; shape example: { ".": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" } }
- "bin": mapping for CLI entrypoints, e.g. {"fizzbuzz":"./bin/fizzbuzz.js"}

3.3 Vitest CLI and config flags
- npm script: "test": "vitest"
- Run once: npx vitest run or vitest run
- Coverage: vitest run --coverage
- Config file resolution order: vitest.config.* (higher priority) or vite.config.* with test property
- Environment vars: VITEST_SKIP_INSTALL_CHECKS=1 disables automatic prompts

3.4 Exact mapping pattern (preferred simple implementation)
- For i from 1 to n:
  - if (i % 15 === 0) push('FizzBuzz')
  - else if (i % 3 === 0) push('Fizz')
  - else if (i % 5 === 0) push('Buzz')
  - else push(i)

3.5 Troubleshooting steps (step-by-step)
- Symptom: tokens wrong (e.g., 15 not FizzBuzz): verify precedence ordering of checks; ensure check for 15 (or lcm(3,5)) occurs before 3 and 5.
- Symptom: numeric outputs as strings: verify that non-token push uses numeric i, not String(i).
- Symptom: runtime TypeError on n: check caller input sources; if CLI, ensure numeric parsing via Number(arg) and validation as above.
- Symptom: test flakiness with large integers: check IEEE-754 precision limits and avoid using Number for values > Number.MAX_SAFE_INTEGER; if required, use BigInt and change validation and outputs accordingly.


4. Detailed digest (source extracts and retrieval date)
- Sources consulted (from project SOURCES.md):
  - Wikipedia Fizz Buzz — canonical description of game and algorithm (retrieved 2026-03-08)
  - MDN JavaScript Guide: Modules — module syntax, resolution, .mjs/.cjs/.js semantics (partial content retrieved 2026-03-08)
  - MDN Number.isInteger — exact behaviour, edge cases, spec pointer (retrieved 2026-03-08)
  - MDN RangeError — constructor, usage examples, and guidance on when to throw (retrieved 2026-03-08)
  - npm package page for fizzbuzz — attempted but fetch failed with HTTP 403; package existence noted in SOURCES.md (retrieval attempted 2026-03-08)
  - Vitest Guide — install, test discovery, config and CLI usage (retrieved 2026-03-08)

- Extracted key lines and technical points from each source are embedded in sections 1-3 above, preserving exact signatures, error types, CLI flags and package.json effects or values.


5. Attribution and crawl metadata
- Retrieval date: 2026-03-08T21:57:46.145Z
- Sources retrieved successfully and sizes (approximate characters fetched):
  - https://en.wikipedia.org/wiki/Fizz_buzz  — retrieved, ~1500 chars
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules — retrieved, ~8200 chars (truncated)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger — retrieved, ~1800 chars
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError — retrieved, ~1200 chars
  - https://www.npmjs.com/package/fizzbuzz — retrieval failed, HTTP 403 (access denied); package listed in SOURCES.md
  - https://vitest.dev/guide/ — retrieved, ~9200 chars (truncated)

- Notes: npmjs returned HTTP 403 when attempting programmatic fetch; repository's SOURCES.md still references the package and existing library contains NPM_FIZZBUZZ.md derived from that reference.


End of document.
