SOURCES_DIGEST

Table of contents
1. FizzBuzz function contract
2. Input validation and exact error conditions
3. Core mapping rules and ordering
4. Implementation variants and performance
5. Module resolution and packaging
6. Number.isInteger semantics
7. RangeError usage conventions
8. NPM package handling (fizzbuzz)
9. Vitest requirements and commands
10. Supplementary technical specifications
11. Reference details (exact commands, signatures, messages)
12. Detailed digest and retrieval metadata
13. Attribution and crawl data size

1. FizzBuzz function contract
Function signature and return contract:
- Signature: fizzBuzz(n: number) -> Array<string | number>
- Contract: Return an array of length n where element at index (i-1) corresponds to integer i for i in 1..n. Values must be exactly the ASCII strings Fizz, Buzz, FizzBuzz or the numeric value i (Number type) for non-matching entries.
- Determinism: Order must match 1..n and token strings must be exactly Fizz, Buzz, FizzBuzz.

2. Input validation and exact error conditions
Validation order and exact checks (apply in this exact sequence):
- Type check: if typeof n !== 'number' then throw new TypeError('n must be a number').
- Finiteness check: if Number.isFinite(n) === false then throw new RangeError('n must be finite').
- Integer check: if Number.isInteger(n) === false then throw new RangeError('n must be an integer').
- Lower bound: if n < 1 then throw new RangeError('n must be >= 1').
- Upper bound: define constant MAX_N (recommended default 10000000). if n > MAX_N then throw new RangeError('n must be <= ' + MAX_N).
- Messages: use short, machine-parseable messages that start with the parameter name and the constraint.

3. Core mapping rules and ordering
Exact mapping rules (apply in this exact priority for each i in 1..n):
- If (i % 15) === 0 then value = 'FizzBuzz'
- Else if (i % 3) === 0 then value = 'Fizz'
- Else if (i % 5) === 0 then value = 'Buzz'
- Else value = i (native Number)
Priority and modulus values are exact and must be checked in the order above.

4. Implementation variants and performance
Eager array builder:
- Preallocate output array with new Array(n) and assign by index for best throughput and predictable memory behavior.
Generator/lazy streaming:
- Provide generator form signature: function* fizzBuzzGenerator(n: number) yields string|number for each i in 1..n. Validation same as above.
Memory safety:
- Use MAX_N to limit allocations; for very large n prefer streaming/generator to avoid high memory.

5. Module resolution and packaging
Node resolution and file types:
- package.json "type" accepts exactly 'module' or 'commonjs'. If 'module' then .js files are ESM; if absent or 'commonjs' then .js are CommonJS. .mjs is always ESM; .cjs is always CommonJS.
- Resolution: Relative specifiers (./, ../) resolve to files applying extension rules; bare specifiers require package resolution via node_modules and may require package.json "exports" mapping.
Export/import forms and interop:
- Use named exports for small utilities; export MAX_N and the primary function(s). Provide both named and default only if intentional and required by consumers.

6. Number.isInteger semantics
API signature: Number.isInteger(value) -> boolean
Semantic checks (exact steps):
- If Type(value) !== 'number' return false.
- If value is NaN or +Infinity or -Infinity return false.
- If value is finite and mathematical value has zero fractional component return true.
Edge cases:
- Returns false for non-number types and for numeric Infinity/NaN. Values beyond Number.MAX_SAFE_INTEGER may be reported as integer by isInteger but lose safe integer semantics for arithmetic.

7. RangeError usage conventions
Constructor signature: new RangeError(message?: string) -> RangeError
When to throw RangeError (exact conditions):
- Use RangeError for numeric domain violations: non-finite numbers, non-integer where integer required, value outside min/max bounds.
- Example messages: 'n must be an integer', 'n must be >= 1', 'n must be <= 10000000', 'n must be finite'.
Type mismatches that are not numeric should use TypeError instead.

8. NPM package handling (fizzbuzz)
Installation commands:
- npm install --save fizzbuzz
- yarn add fizzbuzz
- For CI reproducible installs use npm ci or yarn install --frozen-lockfile
Pinning exact version:
- npm install --save fizzbuzz@<version>
Inspect package metadata:
- npm view fizzbuzz --json to retrieve package.json fields including versions, main, module, types, bin, exports
Verification:
- Inspect tarball: npm pack fizzbuzz@<version> then unpack, or use npm view and check integrity. Run npm audit for known vulnerabilities.

9. Vitest requirements and commands
Requirements:
- Vitest depends on Vite pipeline. Recommended minimums: Node >= 20.0.0 and Vite >= 6.0.0 for the versions referenced.
Common commands:
- Install: npm install -D vitest  OR yarn add -D vitest
- Run tests: npx vitest --run  OR npm test (script: vitest --run tests/unit/*.test.js)
- Unit test naming: files with .test. or .spec. in the filename are discovered by default.
CI usage:
- Pin devDependency versions and use lockfile-driven install (npm ci) for reproducible CI runs.

10. Supplementary technical specifications
Constants and exports:
- Export MAX_N constant (recommend default 10000000) for consumers and tests.
Validation order and short messages are part of the public contract and tests rely on exact strings.
Error objects:
- Errors thrown should be native Error subclasses (TypeError, RangeError) with exact message string to allow deterministic unit tests.

11. Reference details (exact commands, signatures, messages)
Function signatures:
- fizzBuzz(n: number) -> Array<string | number>
- fizzBuzzGenerator(n: number) -> Generator<string | number, void, unknown>
Exact throws and messages (use these exact strings):
- TypeError: 'n must be a number'
- RangeError: 'n must be finite'
- RangeError: 'n must be an integer'
- RangeError: 'n must be >= 1'
- RangeError: 'n must be <= ' + MAX_N
NPM commands:
- npm install --save fizzbuzz
- npm install --save-dev fizzbuzz
- npm ci
Vitest commands:
- npm install -D vitest
- npx vitest --run

12. Detailed digest and retrieval metadata
Sources referenced (as listed in SOURCES.md):
- https://en.wikipedia.org/wiki/Fizz_buzz
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
- https://www.npmjs.com/package/fizzbuzz
- https://vitest.dev/guide/
Date retrieved: 2026-03-08
Notes: content condensed from the repository's library extractions and the SOURCES.md list; exact site HTML was not crawled in this step, repository library files contain full extracted technical text.

13. Attribution and crawl data size
Attribution: content derived from the six sources listed above; canonical references are Wikipedia (FizzBuzz), MDN (Modules, Number.isInteger, RangeError), npm registry (fizzbuzz package), and Vitest documentation.
Crawl items: 6 source URLs as listed in SOURCES.md.
Local SOURCES.md length: 256 bytes (file of source references); extracted library documents in library/ correspond to these sources.

End of SOURCES_DIGEST
