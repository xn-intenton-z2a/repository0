SOURCES_EXTRACT

Table of contents
1. Normalised extract
2. Focused table of contents (topics covered)
3. Detailed technical items
   3.1 FizzBuzz algorithm and deterministic contract
   3.2 Input validation and canonical error semantics
   3.3 JavaScript module loading and package.json "type" effects
   3.4 Number.isInteger specification
   3.5 RangeError constructor and canonical messages
   3.6 NPM package integration (fizzbuzz)
   3.7 Vitest installation and CLI usage
4. Supplementary details (implementation knobs and values)
5. Reference details (API signatures, method parameters, return types, exact messages)
6. Detailed digest (SOURCES.md extract and retrieval metadata)
7. Attribution and data size

1. Normalised extract

This extract consolidates actionable technical content from the listed sources for direct implementation.

Core actionable rules (FizzBuzz algorithm and contract)
- For integers i in the inclusive range 1..n produce a value at result index (i-1).
- Mapping (priority order, exact strings):
  - If i % 15 === 0 -> set result[i-1] = "FizzBuzz"
  - Else if i % 3 === 0 -> set result[i-1] = "Fizz"
  - Else if i % 5 === 0 -> set result[i-1] = "Buzz"
  - Else -> set result[i-1] = the numeric value i (JavaScript Number)
- Deterministic contract: returned array length MUST equal n and elements MUST correspond in order to integers 1..n.

Input validation and canonical error semantics (exact checks and messages)
- Validation sequence (implement in this order):
  1. if (!Number.isFinite(n)) throw new RangeError('n must be finite');
  2. if (!Number.isInteger(n)) throw new RangeError('n must be an integer');
  3. if (n < 1) throw new RangeError('n must be >= 1');
  4. const MAX_N = 10000000; if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N);
- Use RangeError for all numeric-domain violations.

Module loading and package semantics (package.json "type")
- package.json "type":"module" causes .js files to be interpreted as ESM by Node; .mjs is always ESM; .cjs is always CommonJS.
- ESM export signature recommended for library: export function fizzBuzz(n: number): Array<string | number>
- Consumption patterns: ESM import { fizzBuzz } from 'package'; CommonJS: require('package').fizzBuzz when CJS entry or interop is provided.

Number.isInteger (exact behavior and edge cases)
- API: Number.isInteger(value) -> boolean
- Returns true if Type(value) is Number, value is finite, and value has no fractional component.
- Returns false for NaN, +Infinity, -Infinity, non-number types.

RangeError (constructor and usage)
- Constructor: new RangeError(message?: string) -> RangeError instance; instance.name === 'RangeError'.
- Use for numeric range/type violations. Exact messages recommended above.

NPM package integration (fizzbuzz)
- Install: npm install --save fizzbuzz
- For CI reproducible installs: use npm ci with lockfile.
- Inspect package metadata before use: npm view fizzbuzz --json
- Pin exact versions when required: npm install --save fizzbuzz@<version>

Vitest (installation and CLI patterns)
- Install dev dependency: npm install --save-dev vitest
- Typical CLI: npx vitest --run [--coverage] [--config <file>]
- Typical package.json script: "test": "vitest --run tests/unit/*.test.js"

2. Focused table of contents (topics covered)
- FizzBuzz algorithm and deterministic contract
- Exact input validation sequence and messages
- Module type effects and ESM/CJS consumption
- Number.isInteger exact semantics
- RangeError constructor and canonical messages
- NPM package usage and verification
- Vitest installation and CLI usage

3. Detailed technical items
3.1 FizzBuzz algorithm and deterministic contract
- Allocate an array of length n prior to loop.
- Loop i = 1..n inclusive.
- Evaluate divisibility using combined test first: if (i % 15 === 0) then assign 'FizzBuzz'; else if (i % 3 === 0) assign 'Fizz'; else if (i % 5 === 0) assign 'Buzz'; else assign numeric i.
- Return the allocated array (length n) with values at index (i-1).

3.2 Input validation exact code contract
- Implement the validations exactly and throw RangeError with these exact messages:
  - 'n must be finite'
  - 'n must be an integer'
  - 'n must be >= 1'
  - 'n must be <= ' + MAX_N
- Use Number.isFinite and Number.isInteger for checks.
- Define MAX_N as a constant (recommended value: 10000000) and enforce it for safety against excessive memory/CPU.

3.3 JavaScript module loading and package.json "type" effects
- When package.json contains "type":"module" treat .js files as ESM. Provide named exports for functions.
- If needing CommonJS consumers, provide a CJS entry or use export interop in build output (e.g., produce .cjs or provide exports mapping).

3.4 Number.isInteger specification (exact)
- Signature: Number.isInteger(value) -> boolean
- Semantics: returns true iff Type(value) is Number, value is finite, and Math.floor(value) === value.

3.5 RangeError constructor and canonical messages
- Signature: new RangeError(message?: string) -> RangeError
- message must be concise and machine-parseable, prefixed by parameter name when possible.

3.6 NPM package integration (exact commands and checks)
- Install: npm install --save fizzbuzz
- CI reproducible: npm ci
- Inspect metadata: npm view fizzbuzz --json
- Pin exact version: npm install --save fizzbuzz@1.2.3

3.7 Vitest installation and CLI usage (exact commands)
- Install: npm install --save-dev vitest
- Run tests: npx vitest --run
- Run coverage: npx vitest --run --coverage
- Example script: "test": "vitest --run tests/unit/*.test.js"

4. Supplementary details (implementation knobs and values)
- MAX_N: 10000000 (recommended) to limit memory and CPU usage; use as const MAX_N = 10000000.
- Error type choices: use RangeError for numeric violations; use TypeError for non-numeric type mismatches where appropriate.
- Output type: prefer Number for non-Fizz/Buzz outputs in strongly typed APIs; if string-only output is required, convert numeric values to String(i).
- Performance: allocate result array with new Array(n) and assign by index to avoid repeated push overhead in large n scenarios.

5. Reference details (API signatures, method parameters, return types, exact messages)
- export function fizzBuzz(n: number): Array<string | number>
  - Parameters: n (required) — finite integer, 1 <= n <= MAX_N
  - Returns: Array of length n containing exact strings 'Fizz', 'Buzz', 'FizzBuzz' or numeric values for other indices.
  - Throws: RangeError with exact messages as listed for validation failures.
- Number.isInteger(value): boolean
- Number.isFinite(value): boolean
- new RangeError(message?: string): RangeError
- NPM commands: npm install --save fizzbuzz; npm install --save-dev vitest; npm ci; npm view <pkg> --json
- Vitest CLI: npx vitest --run [--coverage] [--config <file>]

6. Detailed digest (SOURCES.md extract and retrieval metadata)
- SOURCES.md content (listed URLs exactly as in repository SOURCES.md):
  - https://en.wikipedia.org/wiki/Fizz_buzz
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - https://www.npmjs.com/package/fizzbuzz
  - https://vitest.dev/guide/
- Retrieval date: 2026-03-08T15:44:39.590Z

7. Attribution and data size
- Attribution: content derived from the URLs above; canonical sources: Wikipedia (Fizz_buzz), MDN Web Docs (Modules, Number.isInteger, RangeError), npm registry (fizzbuzz), Vitest docs (vitest.dev).
- Data obtained during crawling: SOURCES.md file length 591 bytes (repository SOURCES.md listing only). External page body sizes were not fetched; this document normalises and codifies the repository's Sources list into an actionable extract.

End of SOURCES_EXTRACT
