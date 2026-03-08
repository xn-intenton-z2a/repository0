SOURCES_BRIEF

Table of contents
1. Normalised extract
  1.1 FizzBuzz algorithm and deterministic contract
  1.2 Input validation and canonical RangeError semantics (exact checks and messages)
  1.3 API signature and return types
  1.4 Module type and resolution notes
  1.5 Number.isInteger and Number.isFinite exact semantics
  1.6 Vitest and npm actionable commands
2. Supplementary details
3. Reference details (API signatures, parameters, return types, config values)
4. Detailed digest (sources and retrieval date)
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz algorithm and deterministic contract
- For each integer i in the inclusive integer sequence 1..n produce an element at result index (i-1).
- Mapping (apply in this exact priority order):
  - If i % 15 === 0 then element = the exact string FizzBuzz
  - Else if i % 3 === 0 then element = the exact string Fizz
  - Else if i % 5 === 0 then element = the exact string Buzz
  - Else element = the integer i (a JavaScript Number value)
- MUSTs for implementations:
  - Returned array length MUST equal n.
  - Element ordering MUST correspond to integers 1..n.
  - Elements representing non-Fizz/Buzz results MUST be Number typed values (not strings).

1.2 Input validation and canonical RangeError semantics (exact checks and messages)
Perform checks in the following exact order and throw RangeError with the precise message shown when a check fails:
1. If Number.isFinite(n) === false then throw new RangeError('n must be finite')
2. If Number.isInteger(n) === false then throw new RangeError('n must be an integer')
3. If n < 1 then throw new RangeError('n must be >= 1')
4. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)
- Use RangeError exclusively for numeric domain/type violations (do not use TypeError for these checks).

1.3 API signature and return types
- Primary export name: fizzBuzz
- Function signature: fizzBuzz(n: number) -> Array<string | number>
- Behavior: returns an array of length n where each element follows the mapping in 1.1.

1.4 Module type and resolution notes
- package.json "type" field values and effects:
  - "type": "module" makes .js files ESM by default.
  - .mjs is always ESM; .cjs is always CommonJS.
- Import resolution rules:
  - Relative/absolute specifiers (./, ../, /) resolve to files using extension rules.
  - Bare specifiers require package resolution via node_modules, package.json "exports"/"main" or bundler/import maps.

1.5 Number.isInteger and Number.isFinite exact semantics
- Number.isInteger(value) -> boolean: returns true only when Type(value) is Number, value is finite, and value has no fractional component.
- Number.isFinite(value) -> boolean: returns true only when Type(value) is Number and value is finite (not NaN, +Infinity, -Infinity).
- Use these to implement the exact validation order in 1.2.

1.6 Vitest and npm actionable commands
- Run unit tests: npm test  (mapped to vitest --run tests/unit/*.test.js)
- Run unit tests with coverage: npm run test:unit  (vitest --run --coverage ...)
- Reproducible CI install: npm ci  (requires package-lock.json)
- Install package fizzbuzz: npm install --save fizzbuzz or npm install --save-dev fizzbuzz for dev-only.
- Pin exact version: npm install --save fizzbuzz@1.2.3

2. Supplementary details
- Suggested MAX_N constant: 10000000 (used in validation error message patterns across docs).
- Implementation complexity: O(n) time, O(n) space to produce array of length n; avoid heavy memory allocations for extremely large n beyond MAX_N.
- Export/consumption: provide both ESM named export and a CJS-compatible entry point if library consumers may use require; prefer ESM as project package.json often sets "type": "module".

3. Reference details (exact API signatures, parameters, return types, config values)
- Function signature (TypeScript style): export function fizzBuzz(n: number): Array<string | number>
- Validation pseudocode (apply in order):
  - if (!Number.isFinite(n)) throw new RangeError('n must be finite')
  - if (!Number.isInteger(n)) throw new RangeError('n must be an integer')
  - if (n < 1) throw new RangeError('n must be >= 1')
  - const MAX_N = 10000000; if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)
- RangeError constructor: new RangeError(message?: string) -> RangeError (name property = 'RangeError')
- package.json keys: "type" values: "module" | "commonjs"; file extensions override ('.mjs', '.cjs').
- Vitest CLI flags used by repo scripts: --run, --coverage

4. Detailed digest
- Sources referenced (retrieved 2026-03-08):
  - https://en.wikipedia.org/wiki/Fizz_buzz
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - https://www.npmjs.com/package/fizzbuzz
  - https://vitest.dev/guide/
- Retrieval date: 2026-03-08
- Extracted content: algorithm mapping rules, validation order and exact RangeError messages, API signature, module type semantics, Number.isInteger/Number.isFinite semantics, npm and vitest commands.

5. Attribution and crawl data size
- Attribution: content extracted and normalized from the project's SOURCES.md and corroborating library documents (FIZZBUZZ.md, FIZZBUZZ_SPEC.md, JS_MODULES.md, NUMBER_ISINTEGER.md, RANGE_ERROR.md, NPM_FIZZBUZZ.md, VITEST.md) in the repository.
- Crawled data size (SOURCES.md text): approximately 312 bytes.
