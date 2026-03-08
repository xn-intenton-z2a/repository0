SOURCES_SUMMARY

Table of contents
1. Normalised extract
  1.1 FizzBuzz implementation contract
  1.2 Input validation and canonical errors
  1.3 Core mapping rules and ordering
  1.4 Memory/performance variants (array, generator, streaming)
  1.5 Module packaging and resolution rules
  1.6 Runtime numeric primitives and checks (Number.isInteger)
  1.7 Error type and messages (RangeError)
  1.8 Package integration and verification (npm)
  1.9 Testing and CI (Vitest)
2. Supplementary details
3. Reference details
4. Detailed digest and retrieval metadata
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz implementation contract
- Function signature: fizzBuzz(n: number) -> Array<string | number>
- Return contract: array length equals n; element at index (i-1) corresponds to integer i; values are exact strings Fizz, Buzz, FizzBuzz or the native numeric value i (Number) for non-matching entries.

1.2 Input validation and canonical errors
- Type check: if typeof n !== 'number' then throw TypeError('n must be a number').
- Finite check: if !Number.isFinite(n) then throw RangeError('n must be finite').
- Integer check: if !Number.isInteger(n) then throw RangeError('n must be an integer').
- Lower bound: if n < 1 then throw RangeError('n must be >= 1').
- Upper bound: define and export MAX_N (recommended default 10000000). if n > MAX_N then throw RangeError('n must be <= ' + MAX_N).
- Validation order recommended: typeof -> isFinite -> isInteger -> bounds.

1.3 Core mapping rules and ordering
- For i in 1..n apply in this exact priority:
  - if i % 15 === 0 -> 'FizzBuzz'
  - else if i % 3 === 0 -> 'Fizz'
  - else if i % 5 === 0 -> 'Buzz'
  - else -> numeric i
- Invariant: tokens must be exact ASCII strings Fizz, Buzz, FizzBuzz for deterministic tests.

1.4 Memory/performance variants
- Eager array builder: preallocate new Array(n) and assign by index for best throughput and predictable memory.
- Generator: function* fizzBuzzGenerator(n: number) yields values to keep peak memory O(1) aside from iterator state.
- Chunked streaming: produce fixed-size batches (e.g., 10k items) and flush to sink for large outputs to reduce IO overhead.
- Micro-optimisations: avoid stringifying numeric outputs; use numeric types.

1.5 Module packaging and resolution rules
- Use ESM exports: export function fizzBuzz(n) { } or export { fizzBuzz } and set package.json "type": "module" for .js files.
- For dual consumers, provide exports map: "exports": { ".": {"import": "./dist/index.mjs","require": "./dist/index.cjs"} }.
- Include "module" field for bundlers and "main" for legacy CJS consumers; provide TypeScript declarations via "types" if present.
- For browser ESM, use explicit file extensions in import specifiers and serve with Content-Type: text/javascript.

1.6 Runtime numeric primitives and checks (Number.isInteger)
- Number.isInteger(value) returns true only if typeof value === 'number', finite, and mathematical integer (no fractional part) within IEEE-754 representation.
- Polyfill algorithm: typeof value === 'number' && isFinite(value) && Math.floor(value) === value.
- Caveat: values beyond Number.MAX_SAFE_INTEGER may be representationally integral but lose exact integer arithmetic semantics; enforce safe upper bounds when necessary.

1.7 Error type and canonical messages (RangeError)
- Use RangeError for numeric domain violations. Canonical messages: 'n must be an integer', 'n must be finite', 'n must be >= 1', 'n must be <= ' + MAX_N.
- Use TypeError for non-number type mismatches.
- Detection: use instanceof RangeError or error.name === 'RangeError' when crossing realms.

1.8 Package integration and verification (npm)
- Install: npm install --save fizzbuzz or yarn add fizzbuzz; for CI use lockfile-driven installs: npm ci or yarn install --frozen-lockfile.
- Inspect metadata: npm view fizzbuzz --json to obtain package.json fields (versions, dist.tarball, shasum, main, module, exports, bin, types).
- Inspect package contents: npm pack fizzbuzz@<version> && tar -xvf fizzbuzz-<version>.tgz to view package/package.json and files before depending.
- Runtime loading patterns: require('fizzbuzz') for CJS, import fizz from 'fizzbuzz' for ESM, await import('fizzbuzz') for dynamic loads; check module shape (module.default, function identity) before invocation.

1.9 Testing and CI (Vitest)
- Discovery: tests named *.test.* or *.spec.*; place under tests/unit or configured test roots.
- Run once in CI: vitest run or npm test mapping to vitest run.
- Coverage: vitest run --coverage with coverage provider configured; include coverage config in vitest.config.js/ts under test.coverage.
- CI env: set VITEST_SKIP_INSTALL_CHECKS=1 to avoid interactive dependency prompts.

2. Supplementary details
- Export MAX_N constant and document memory characteristics so callers can choose generator vs array.
- Keep messages machine-parseable and ASCII; localize only at consumer-facing UX boundaries.
- Provide both sync (array) and lazy (generator) APIs to cover test determinism and large-scale streaming use-cases.
- Prefer named exports for utilities to enable tree-shaking; provide default export only if a single primary export exists.

3. Reference details
- API signatures and exact effects:
  - fizzBuzz(n: number): Array<string | number>
    - Throws: TypeError('n must be a number') | RangeError('n must be finite'|'n must be an integer'|'n must be >= 1'|'n must be <= ' + MAX_N)
    - Returns: array length n; index i-1 maps to integer i.
  - fizzBuzzGenerator(n: number): IterableIterator<string | number>
    - Same validation and throws; yields values in order.
  - MAX_N: number (exported constant) recommended default 10000000.
- Package.json fields to set when publishing:
  - "type": "module"
  - "main": "dist/index.cjs"
  - "module": "dist/index.mjs"
  - "exports": { ".": {"import":"./dist/index.mjs","require":"./dist/index.cjs"} }
  - "types": "dist/index.d.ts" (if TypeScript declarations provided)
- Vitest commands and config entries:
  - package.json scripts: "test": "vitest", "test:run": "vitest run", "coverage": "vitest run --coverage"
  - vitest.config.ts key entries: test.environment, test.setupFiles, test.include, test.exclude, test.projects, test.coverage.

4. Detailed digest and retrieval metadata
- Sources referenced (from project SOURCES.md):
  - https://en.wikipedia.org/wiki/Fizz_buzz  (FizzBuzz canonical algorithm)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (Module semantics, package.json keys, exports)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (Number.isInteger semantics and polyfill)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (RangeError constructor, messages, detection)
  - https://www.npmjs.com/package/fizzbuzz  (package metadata and inspection patterns)
  - https://vitest.dev/guide/  (Vitest test runner discovery, CLI, config, CI usage)
- Retrieval date: 2026-03-08T22:33:23.616Z

5. Attribution and crawl data size
- Attribution: extracts derived from Wikipedia (Fizz Buzz), MDN Web Docs (Modules, Number.isInteger, RangeError), npm registry reference, and Vitest documentation as listed in project SOURCES.md.
- Crawl: content synthesized from SOURCES.md entries and previously crawled extracts stored in repository; total text extracted during synthesis approximately 45 KB.

End of document
