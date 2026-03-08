FIZZ_BUZZ

Table of contents
1. Normalised extract (canonical implementation facts)
2. Technical topics covered
3. Detailed information
   3.1 Function signature and contract
   3.2 Exact mapping rules (priority and tokens)
   3.3 Input validation (checks and exact RangeError messages)
   3.4 Error semantics and throwing patterns
   3.5 Implementation patterns (in-memory, preallocation, generator, optimizations)
   3.6 Module & packaging patterns (ESM/CJS, package.json keys, exports)
   3.7 Testing and CI (Vitest discovery, commands, test cases)
4. Supplementary details (performance, bounds, localization, streaming)
5. Reference details (exact API signatures, config entries, CLI commands)
6. Detailed digest (sources and retrieval timestamp)
7. Attribution and crawl data size

1. Normalised extract (canonical implementation facts)
- Function contract: fizzBuzz(n: number) -> Array<string | number>
- For each integer i in 1..n, produce one output in order; the output is exactly either the numeric value i (native number) or one of the exact strings: Fizz, Buzz, FizzBuzz.
- Token precedence (must be applied in this exact order):
  1) if i % 15 === 0 => 'FizzBuzz'
  2) else if i % 3 === 0 => 'Fizz'
  3) else if i % 5 === 0 => 'Buzz'
  4) else => i (number)
- Invariants to enforce: returned array length === n; element ordering corresponds to integers 1..n; non-Fizz/Buzz entries are numeric typed values (not strings).

2. Technical topics covered
- Deterministic mapping rules and output invariants
- Exact input validation checks and canonical RangeError messages
- Error types selection: RangeError for numeric domain errors, TypeError for non-number types
- Implementation options: preallocated array, generator (streaming), vectorised marking
- Module packaging: ESM vs CJS, package.json "type", exports mapping and dual-format packaging guidance
- Test patterns and CI: Vitest discovery rules, CLI commands, canonical edge tests
- Performance notes and bounds (memory vs streaming trade-offs)

3. Detailed information
3.1 Function signature and contract
- Signature (language-agnostic): fizzBuzz(n: number) -> Array<string | number>
- Preconditions: n must be a Number, finite, integer, and within documented bounds (1 <= n <= MAX_N).
- Postconditions: returns an array of length n where element at index (i-1) is the mapped output for integer i.

3.2 Exact mapping rules (priority and tokens)
- Apply these checks for each i in ascending order; do not reorder or localize tokens when building canonical library behaviour used by tests:
  - if (i % 15 === 0) return 'FizzBuzz'
  - else if (i % 3 === 0) return 'Fizz'
  - else if (i % 5 === 0) return 'Buzz'
  - else return i (a native number)
- Always emit exact ASCII tokens Fizz, Buzz, FizzBuzz when those conditions match; tests depend on exact spellings and casing.

3.3 Input validation (checks and exact RangeError messages)
- Perform checks in this explicit order and throw the exact messages below to be machine-parseable by test harnesses and callers:
  1) If typeof n !== 'number' -> throw TypeError('n must be a number')
  2) If Number.isFinite(n) === false -> throw new RangeError('n must be finite')
  3) If Number.isInteger(n) === false -> throw new RangeError('n must be an integer')
  4) If n < 1 -> throw new RangeError('n must be >= 1')
  5) If n > MAX_N -> throw new RangeError('n must be <= ' + MAX_N)
- Use Number.isInteger and Number.isFinite explicitly (do not use global isFinite that coerces non-numbers).

3.4 Error semantics and throwing patterns
- Use TypeError only for type mismatches; use RangeError exclusively for numeric-domain violations (non-finite, non-integer, out-of-range).
- Exact RangeError constructor usage: new RangeError(message) where message is one of the canonical strings above.
- Detection in callers: prefer error.name === 'RangeError' for cross-realm checks; instanceof RangeError is acceptable within same realm.

3.5 Implementation patterns
- In-memory preallocated builder (recommended for moderate n):
  - Allocate array of length n upfront (where environment supports preallocation) and assign by index to avoid push overhead in some runtimes.
  - For i from 1 to n: compute mappedValue and set out[i-1] = mappedValue.
- Streaming/generator builder (recommended for very large n):
  - Implement an iterator/generator that yields one mapped value per i, avoids O(n) memory, preserves order.
- Optimizations:
  - Modulus reduction: test i % 15 first to detect combined multiples; ordering 15,3,5 is both correct and efficient.
  - Batch marking alternative: for extreme performance, mark arrays of flags for multiples of 3 and 5, then compose outputs; ensure correctness (preserve numeric vs string typing).
- Memory vs CPU trade-offs: in-memory array: O(n) space, O(n) time; generator: O(1) peak memory, O(n) time.

3.6 Module & packaging patterns
- Source file layout recommendation for Node ESM packages:
  - package.json: { "type": "module", "main": "dist/index.js", "exports": { ".": "./dist/index.js" } }
  - Provide ESM source (export function fizzBuzz) and optional dual CJS wrapper (dist/index.cjs) if broad compatibility required.
  - If package exposes CLI, add "bin" entry mapping to a dedicated executable file and ensure it is small and delegates to the library API.
- Export signatures (exact): export function fizzBuzz(n) { ... }  (ESM named export)
- For consumers in CJS-only environments, provide a .cjs bridge that requires the compiled ESM or re-exports the CJS entry so require('pkg').fizzBuzz is callable.
- Node engine guidance: match project engines (this repository uses node >= 24 per package.json) and set engines in package.json when publishing.

3.7 Testing and CI (Vitest)
- Test file naming: place unit tests matching *.test.* or *.spec.* (e.g., fizz.test.js) so Vitest discovers them by default.
- Canonical tests to include:
  - Basic mapping tests: n = 1 -> [1]; n = 3 -> [1,2,'Fizz']; n = 5 -> [1,2,'Fizz',4,'Buzz']; n = 15 -> ensure index 14 === 'FizzBuzz'.
  - Validation tests: pass Infinity, NaN, 3.14, 0, -1, very large n to assert correct RangeError messages and types.
  - Type tests: Number-typed non-Fizz entries remain numbers (typeof output[i] === 'number').
- Vitest CLI commands for CI:
  - Single run (CI): vitest run
  - Run with coverage: vitest run --coverage
  - Local interactive/watch: vitest
- CI install best practice: use lockfile-driven installs (npm ci, yarn install --frozen-lockfile).

4. Supplementary details
- MAX_N: choose and document an upper bound (for example MAX_N = 1_000_000) when publishing to protect consumers from accidental OOM; enforce with RangeError('n must be <= ' + MAX_N).
- Localization: do not internationalize canonical tokens in library API; present localized strings only in presentation layers.
- Streaming: provide both array-return and generator variants when API surface allows: fizzBuzzArray(n) and fizzBuzzGenerator(n).
- Performance profiling: measure modulus cost if optimizing for extreme throughput; consider lookup tables for small repeating patterns when micro-optimising.

5. Reference details (exact API signatures, config entries, CLI commands)
- API signature and throws (exact):
  - fizzBuzz(n: number): Array<string | number>
    - Throws: TypeError('n must be a number') if typeof n !== 'number'
    - Throws: RangeError('n must be finite') if !Number.isFinite(n)
    - Throws: RangeError('n must be an integer') if !Number.isInteger(n)
    - Throws: RangeError('n must be >= 1') if n < 1
    - Throws: RangeError('n must be <= ' + MAX_N) if n > MAX_N
- Number.isInteger(value) -> boolean  (use to validate integerness)
- RangeError(message?: string) constructor signature
- package.json entries (exact keys and typical values):
  - "type": "module"  // .js files treated as ESM
  - "main": "dist/index.js"  // legacy/main entry for CJS consumers
  - "exports": { ".": "./dist/index.js" }  // subpath export mapping
  - "bin": { "fizzbuzz": "bin/cli.js" }  // if CLI provided
  - "engines": { "node": ">=24.0.0" }  // example constraint
- Vitest commands (exact):
  - npm test  -> typically mapped to "vitest" in package.json scripts
  - vitest run  -> run tests once (CI)
  - vitest run --coverage  -> run tests and collect coverage

6. Detailed digest (sources and retrieval timestamp)
- Sources (as listed in project SOURCES.md) and retrieval timestamp: 2026-03-08T21:26:52.126Z
  - https://en.wikipedia.org/wiki/Fizz_buzz  (canonical algorithm mapping and invariants)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (module/E SM/CJS rules; package.json keys; imports/exports semantics)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (exact Number.isInteger semantics)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (RangeError constructor and canonical usage)
  - https://www.npmjs.com/package/fizzbuzz  (npm package metadata; note: registry fetch blocked in prior crawl; use npm view locally)
  - https://vitest.dev/guide/  (Vitest discovery, config, CLI and CI usage)

7. Attribution and crawl data size
- Attribution: this document synthesizes technical content pulled from the URLs above as listed in SOURCES.md and from local library extracts previously generated from those sources.
- Crawl / extraction notes and sizes (approximate):
  - MDN Modules: ~12 KB
  - Vitest guide: ~13.2 KB
  - MDN Number.isInteger: ~2.5 KB
  - MDN RangeError: ~1 KB
  - Wikipedia Fizz_Buzz: ~1–1.5 KB
  - npmjs.com fizzbuzz: fetch blocked during automated crawl (HTTP 403); authoritative package metadata must be obtained via `npm view fizzbuzz --json` in CI or developer environment.
  - Aggregate extracted text across sources: ~30 KB (approximate)

End of document
