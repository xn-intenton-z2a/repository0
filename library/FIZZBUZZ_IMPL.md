FIZZBUZZ_IMPL

Table of contents
1. Function signature and return contract
2. Input validation and exact error conditions
3. Core algorithm: exact mapping and ordering
4. Memory and performance options (array vs generator)
5. Module export and packaging patterns
6. Testing patterns and Vitest integration
7. Packaging and npm integration checklist
8. Supplementary implementation details
9. Reference details (API signatures, parameter checks, return types)
10. Detailed digest and retrieval metadata
11. Attribution and crawl data size

1. Function signature and return contract
- Declaration: fizzBuzz(n: number) -> Array<string | number>
- Contract: For positive integer n produce an array of length n where index (i-1) corresponds to integer i for i in [1, n]. Elements are either the exact strings Fizz, Buzz, FizzBuzz or the native numeric value i (not string) for non-matching entries.
- Deterministic ordering: element 0 corresponds to 1, element n-1 corresponds to n.

2. Input validation and exact error conditions
- Type enforcement: If typeof n !== 'number' then throw new TypeError('n must be a number').
- Integer enforcement: If Number.isInteger(n) === false then throw new RangeError('n must be an integer').
- Finiteness: If Number.isFinite(n) === false then throw new RangeError('n must be finite').
- Lower bound: If n < 1 then throw new RangeError('n must be >= 1').
- Upper bound: Define MAX_N constant for memory safety. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N).
- Message conventions: Messages are short and machine-parseable, prefixed by parameter name and constraint (examples above).

3. Core algorithm: exact mapping and ordering
- For each integer i from 1 to n inclusive, apply these rules in this exact priority order:
  a. If (i % 15) === 0 then output the exact string FizzBuzz
  b. Else if (i % 3) === 0 then output the exact string Fizz
  c. Else if (i % 5) === 0 then output the exact string Buzz
  d. Else output the numeric value i (native Number)
- Complexity: time O(n), space O(n) for array-producing form. Generator/streaming form reduces space to O(1) plus iterator overhead.

4. Memory and performance options (array vs generator)
- Array form (eager): allocate output = new Array(n); fill entries per index; suitable for n up to a few million depending on memory and MAX_N.
- Generator form (lazy): function* fizzBuzzGenerator(n) yields values one at a time; useful for streaming or very large n. Signature: fizzBuzzGenerator(n: number) -> IterableIterator<string | number>.
- Chunked streaming: for network or file output, produce fixed-size buffers (e.g., 1e4 items) and flush to sink to avoid per-item IO costs.

5. Module export and packaging patterns
- ESM recommended: use export function fizzBuzz(n) { ... } or export default function fizzBuzz(n) { ... } depending on consumer expectations.
- package.json: if publishing as a module package set "type": "module" and include "main" pointing to the entry file. Provide "exports" map for clarity when supporting both CJS and ESM.
- CLI entry (optional): provide a bin entry and a small wrapper that parses CLI arguments, validates using the same checks, and writes newline-separated outputs.

6. Testing patterns and Vitest integration
- Test discovery: place tests in tests/unit with filenames containing .test. or .spec. and run via vitest --run or npm test script.
- Assertions to include:
  a. Sequence length equality: expect(output.length).toBe(n)
  b. Exact sequence equality for known inputs: expect(output).toEqual([1,2,'Fizz',4,'Buzz',...]) for small n
  c. Type checks: for non-Fizz/Buzz entries assert typeof element === 'number'
  d. Error cases: assert that non-number, non-integer, out-of-range values throw the exact TypeError/RangeError messages above
- Vitest config: keep default discovery or specify test.files and environment in vitest.config.ts. Use run mode in CI: vitest run --coverage.

7. Packaging and npm integration checklist
- Inspect package via npm view fizzbuzz --json before depending in CI.
- Pin versions in package.json and use lockfile-driven installs in CI: npm ci or yarn install --frozen-lockfile.
- Audit: run npm audit or use static scanning; avoid installing packages directly from unverified URLs in CI.
- Provide clear package.json fields: name, version, description, main/module, types (if TypeScript), exports, bin (if CLI).

8. Supplementary implementation details
- Use integer modulus checks on small integers; prefer combining checks using precomputed divisibility flags only if benchmarking requires micro-optimizations.
- Avoid building strings for numeric outputs; return native numbers to satisfy test invariants.
- For very large n, avoid constructing a full array and prefer generator or streaming output.
- Recommended MAX_N: 10_000_000 (10 million) as a practical safe default; choose lower if memory is constrained. Document and export MAX_N so callers can adapt.

9. Reference details (API signatures, parameter checks, return types)
- API: fizzBuzz(n: number): Array<string | number>
  - Parameters: n - required - number - positive integer within [1, MAX_N]
  - Returns: array of length n; element types string or number as specified
  - Errors: TypeError('n must be a number') if typeof n !== 'number'
            RangeError('n must be an integer') if Number.isInteger(n) === false
            RangeError('n must be finite') if Number.isFinite(n) === false
            RangeError('n must be >= 1') if n < 1
            RangeError('n must be <= ' + MAX_N) if n > MAX_N

- API: fizzBuzzGenerator(n: number): IterableIterator<string | number>
  - Same parameter validation and errors as above
  - Yields values in order for i from 1..n according to mapping rules

10. Detailed digest and retrieval metadata
- Sources used (from repository SOURCES.md):
  - https://en.wikipedia.org/wiki/Fizz_buzz  (algorithm mapping and canonical rules) - retrieved 2026-03-08; full content obtained
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (module export/import, import maps, .mjs vs .js guidance) - retrieved 2026-03-08; content truncated at 20000 characters by crawl
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (Number.isInteger semantics and edge cases) - retrieved 2026-03-08; full content obtained
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (RangeError usage, constructor and messages) - retrieved 2026-03-08; full content obtained
  - https://www.npmjs.com/package/fizzbuzz  (package metadata) - retrieval failed: HTTP 403; consult npm view locally in CI
  - https://vitest.dev/guide/  (Vitest test runner usage, discovery, config) - retrieved 2026-03-08; full content obtained

11. Attribution and crawl data size
- Attribution: content extracted from the sources listed above; see source URLs for original authors and licensing.
- Crawl notes and data size: Wikipedia, MDN Number.isInteger, MDN RangeError, and Vitest pages were returned in full from the crawler; MDN Modules response was truncated by the crawler at 20000 characters; npmjs package fetch returned HTTP 403 and no content. Exact byte counts are not provided by the fetch tool; use local npm view or direct fetch to obtain tarball sizes.

End of document
