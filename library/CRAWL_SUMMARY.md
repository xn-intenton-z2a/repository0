CRAWL_SUMMARY

Table of contents
1. Normalised extract
  1.1 FizzBuzz algorithm and deterministic contract
  1.2 Input validation and canonical error semantics (exact checks and messages)
  1.3 API signature and return types
  1.4 Module resolution and consumption (ESM/CommonJS implications)
  1.5 Number and Range semantics (Number.isInteger, Number.isFinite, RangeError)
2. Supplementary details and implementation knobs
3. Reference details (exact API signatures, parameters, return values, config keys)
4. Detailed digest (SOURCES.md excerpt and retrieval metadata)
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz algorithm and deterministic contract
- For each integer i in the inclusive integer sequence 1..n produce an element at result index (i-1).
- Mapping (apply in this exact priority order):
  - If i modulo 15 equals 0 then element is the exact string FizzBuzz
  - Else if i modulo 3 equals 0 then element is the exact string Fizz
  - Else if i modulo 5 equals 0 then element is the exact string Buzz
  - Else element is the integer i (a JavaScript Number value)
- Contract rules that MUST be satisfied by implementations:
  - Returned array length MUST equal n.
  - Element ordering MUST correspond to integers 1..n.
  - Elements representing non-Fizz/Buzz results MUST be Number typed values (not strings).

1.2 Input validation and canonical error semantics (exact checks and messages)
- Validation checks and exact RangeError messages; perform checks in this order and throw RangeError with the exact message shown when a check fails:
  1. If Number.isFinite(n) === false then throw new RangeError('n must be finite')
  2. If Number.isInteger(n) === false then throw new RangeError('n must be an integer')
  3. If n < 1 then throw new RangeError('n must be >= 1')
  4. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)
- Use RangeError exclusively for numeric domain/type violations; do not use TypeError for these numeric range checks.
- Define MAX_N as an implementation constant; recommended value used in this codebase: 10000000.

1.3 API signature and return types
- Primary export name: fizzBuzz
- Canonical programmatic signature (informal declaration): fizzBuzz(n: number) -> Array<string | number>
- Behavioural contract:
  - On valid numeric n produce an array of length n whose elements follow the mapping in 1.1.
  - On invalid input throw RangeError with exact messages as specified in 1.2.
- CLI entrypoints (if present) should parse and validate numeric input using the same checks and print the array or formatted output in the same deterministic order.

1.4 Module resolution and consumption (ESM/CommonJS implications)
- package.json type field affects interpretation of .js files:
  - "type": "module" makes .js files be parsed as ESM.
  - Absence of "type" or "type": "commonjs" makes .js files be CommonJS by default.
- File extensions override package type: .mjs is ESM, .cjs is CommonJS.
- Consumers should expose both ESM named exports and a CommonJS-compatible main when supporting mixed environments, or use conditional exports mapping in package.json to specify module vs main entry points.
- When providing a CLI, include a bin entry and a shebang in the executable file maintained for the correct module format (use a small loader wrapper for ESM-only packages if Node version compatibility is required).

1.5 Number and Range semantics (Number.isInteger, Number.isFinite, RangeError)
- Number.isInteger(value) semantics (exact): returns true only when Type(value) is Number, value is finite, and the mathematical value has no fractional component. Returns false for NaN, +Infinity, -Infinity and non-Number types.
- Number.isFinite(value) semantics: returns true only if Type(value) is Number and the value is finite; return false for NaN and infinities and non-number types.
- RangeError constructor: new RangeError(message?: string) produces an Error-derived object with name 'RangeError'. Use RangeError for numeric value/domain violations; messages must be short, machine-parseable strings beginning with the parameter name and the constraint.

2. Supplementary details and implementation knobs
- MAX_N: integer ceiling to limit memory/time; recommended constant: 10000000. Implementations can choose lower ceilings for constrained environments but must update error message to include the chosen MAX_N value.
- Return typing: prefer explicit TypeScript signature Array<string | number> for library type declarations; runtime must still use Number primitives for non-Fizz outputs.
- Performance: generate results in O(n) time and O(n) space; to reduce peak memory produce a streaming API variant (generator) that yields each element in order rather than returning the full array.
- Streaming API signature (informal): fizzBuzzGenerator(n: number) -> Generator<string | number, void, unknown> — must apply same validation rules and mapping.
- CLI formatting: when producing textual output from CLI, preserve the element order and use a stable separator (newline) between elements; do not quote numeric values.

3. Reference details (exact API signatures, parameters, return types, config keys and effects)
- Library API signatures and exact messages:
  - fizzBuzz(n: number) -> Array<string | number>
    - Throws:
      - RangeError('n must be finite') if Number.isFinite(n) === false
      - RangeError('n must be an integer') if Number.isInteger(n) === false
      - RangeError('n must be >= 1') if n < 1
      - RangeError('n must be <= ' + MAX_N) if n > MAX_N
  - fizzBuzzGenerator(n: number) -> Generator<string | number>
    - Same throws as fizzBuzz and yields elements in order for i from 1 to n.
- Package.json fields and effects relevant to consumers:
  - "type": "module" -> ESM for .js files
  - "main": string -> CommonJS entry point (legacy consumers)
  - "exports": mapping -> conditional exports to provide separate ESM and CJS builds
  - "bin": mapping -> CLI command name to executable file path
- Recommended package publish layout:
  - Provide ESM source under ./dist/index.mjs and CommonJS build under ./dist/index.cjs
  - package.json "exports" example (informal): {"./": {"import": "./dist/index.mjs", "require": "./dist/index.cjs"}}
- Vitest integration commands and script names used in this repository:
  - npm test -> vitest --run tests/unit/*.test.js
  - npm run test:unit -> vitest --run --coverage tests/unit/*.test.js
  - Configuration export form: export default defineConfig({ test: { include: ['tests/unit/*.test.js'], environment: 'node', globals: true } }) from 'vitest/config'
- Vitest API exact import surface:
  - describe(fn)
  - it(name, fn) / test(name, fn)
  - beforeAll(fn), afterAll(fn), beforeEach(fn), afterEach(fn)
  - expect(value) -> matchers: toBe, toEqual, toStrictEqual, toContain, toMatch, toThrow, resolves, rejects
  - vi -> mocking utilities (vi.fn, vi.spyOn, vi.useFakeTimers)

4. Detailed digest (SOURCES.md excerpt and retrieval metadata)
- Sources listed in repository SOURCES.md at retrieval:
  - https://en.wikipedia.org/wiki/Fizz_buzz
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - https://www.npmjs.com/package/fizzbuzz
  - https://vitest.dev/guide/
- Retrieval timestamp: 2026-03-08T17:50:58.248Z
- Notes: repository already contains derived library documents (FIZZBUZZ.md, JS_MODULES.md, NUMBER_ISINTEGER.md, RANGE_ERROR.md, NPM_FIZZBUZZ.md, VITEST.md) which contain expanded extracts; this summary consolidates the mission-critical implementation points into one actionable reference.

5. Attribution and crawl data size
- Attribution: content distilled from the sources listed above (Wikipedia Fizz_buzz, MDN Web Docs, npm registry entry for fizzbuzz, Vitest guide). The document consolidates technical rules and exact messages derived from those sources.
- Crawl data size: metadata-only extraction from SOURCES.md within this repository; no external HTTP fetch performed in this run. Reported data size: 0 bytes fetched; derived document size: approximately 8 KB.

[END OF DOCUMENT]
