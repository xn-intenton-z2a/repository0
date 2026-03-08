SOURCES

Table of contents
1. Normalised extract
  1.1 FizzBuzz canonical algorithm and contract
  1.2 ES Module resolution and package type rules
  1.3 Number.isInteger exact semantics
  1.4 RangeError usage and exact messages
  1.5 npm package installation and inspection commands (fizzbuzz)
  1.6 Vitest runtime, discovery and CLI patterns

2. Normalised extract

1.1 FizzBuzz canonical algorithm and contract
- Function signature: fizzBuzz(n: number) -> Array<string | number>
- For each integer i in 1..n inclusive, produce exactly one of:
  - If i % 15 == 0 produce the exact string FizzBuzz
  - Else if i % 3 == 0 produce the exact string Fizz
  - Else if i % 5 == 0 produce the exact string Buzz
  - Else produce the numeric value i (native Number type)
- Invariants: returned array length == n; ordering corresponds to 1..n; non-Fizz entries are numeric typed values.
- Validation requirements (exact checks and error contracts):
  - Type: ensure Type(value) is Number (use Number.isInteger semantics)
  - Integer check: Number.isInteger(n) must be true; if not, throw new RangeError('n must be an integer')
  - Finiteness: Number.isFinite(n) must be true; if not, throw new RangeError('n must be finite')
  - Lower bound: if n < 1 throw new RangeError('n must be >= 1')
  - Optional upper bound: if n > MAX_N throw new RangeError('n must be <= ' + MAX_N)

1.2 ES Module resolution and package type rules (exact operational facts)
- package.json "type" field accepts exactly: "module" or "commonjs".
- File extension mapping: .mjs => ESM; .cjs => CommonJS; .js => determined by nearest package.json "type" field at or above file.
- Import resolution: relative specifiers (./, ../, /) resolve to file paths and require explicit file extensions for browser environments; bare specifiers resolve via node_modules, package.json "exports" or "main".
- Export forms (syntactic forms to implement exactly):
  - Named export: export const name = value
  - Named function export: export function fname(...) { ... }
  - Default export: export default expression
  - Re-exports: export { name } from 'module' ; export * from 'module' ; export { default as alias } from 'module'
- Interop notes: use explicit .cjs/.mjs or package "type" setting to control loader behavior; CommonJS require() semantics differ and do not provide live bindings.

1.3 Number.isInteger exact semantics
- Signature: Number.isInteger(value) -> boolean
- Algorithmic checks (apply in this exact order):
  1. If Type(value) !== Number return false
  2. If value is NaN, +Infinity or -Infinity return false
  3. If value is finite and mathematical value has no fractional component (value === Math.trunc(value)) return true
  4. Otherwise return false
- Edge behaviours: returns false for non-number types and for numeric Infinity/NaN; values beyond Number.MAX_SAFE_INTEGER may return true if representable without fractional component but arithmetic may be unsafe.

1.4 RangeError usage and exact messages
- Constructor: new RangeError(message?: string) -> RangeError with name = 'RangeError'
- Canonical use-cases (throw exactly these messages):
  - Non-integer numeric argument: throw new RangeError('n must be an integer')
  - Lower bound violation: throw new RangeError('n must be >= 1')
  - Upper bound violation: throw new RangeError('n must be <= ' + MAX_N)
  - Non-finite numeric: throw new RangeError('n must be finite')
- Do not use RangeError for non-numeric type mismatches; prefer TypeError for wrong types.

1.5 npm package installation and inspection commands (fizzbuzz)
- Install production: npm install --save fizzbuzz
- Install dev: npm install --save-dev fizzbuzz
- Pin exact version: npm install --save fizzbuzz@<version>
- Reproducible CI install: npm ci (requires package-lock.json)
- Inspect package metadata: npm view fizzbuzz --json  (returns package.json fields: versions, main, module, types, bin)
- Inspect tarball without installing: npm pack --dry-run or npm pack fizzbuzz@<version> then inspect tarball contents
- Audit and security: npm audit; for deterministic CI use lockfile and audit step

1.6 Vitest runtime, discovery and CLI patterns
- Engine requirements (canonical): Vite >= 6.0.0 and Node >= 20.0.0 for Vitest runtime; repository package.json may require different Node engines (this repo: node >= 24.0.0) — respect package.json engines.
- Install as dev dependency: npm install -D vitest
- Test discovery: by default Vitest matches filenames containing .test. or .spec. (example: example.test.js)
- Common CLI patterns used in this repo: "vitest --run tests/unit/*.test.js" and for coverage: "vitest --run --coverage tests/unit/*.test.js"
- Environment selection: pass --environment node or jsdom/happy-dom via config or CLI; project-level config can declare test environment and projects.


3. Supplementary details
- Exact package.json fields to inspect for module surface and runtime: main, module, types, exports, bin, engines, scripts
- Use lockfile-driven installs in CI: npm ci or yarn install --frozen-lockfile; avoid npm install in CI for reproducibility
- Best practice for thrown messages: keep messages short and machine-parseable prefixed by parameter name (e.g., "n must be an integer") to enable automated test assertions
- For FizzBuzz implementations that must interoperate with test harnesses: ensure non-Fizz entries are Number typed values not stringified numbers
- When adding an upper bound MAX_N, document and export the numeric constant and use it in both runtime checks and tests to keep messages stable


4. Reference details (exact API signatures, commands, config options and values)
- Number.isInteger(value) -> boolean
  - Parameter: value (any)
  - Return: true if value is of Number type and is finite integer; false otherwise
- RangeError(message?: string) -> RangeError
  - Usage: throw new RangeError('n must be an integer')
- Export forms (textual patterns): export const name = value ; export function fname(...) { ... } ; export default expression ; export { name } from 'module' ; export * from 'module'
- npm commands (exact):
  - npm install --save fizzbuzz
  - npm install --save-dev fizzbuzz
  - npm install --save fizzbuzz@<version>
  - npm ci
  - npm view fizzbuzz --json
  - npm pack --dry-run
- Vitest CLI examples (exact as used in repo):
  - npm test -> resolves to: vitest --run tests/unit/*.test.js
  - npm run test:unit -> vitest --run --coverage tests/unit/*.test.js
- package.json "type" values: "module" or "commonjs" (exact strings)
- package.json "engines" format: "node": ">=24.0.0" (string semver range)


5. Detailed digest and retrieval metadata
- Sources list retrieved and normalized from repository SOURCES.md
- Retrieval timestamp (ISO 8601 UTC): 2026-03-08T23:28:50.948Z
- Source URLs included:
  - https://en.wikipedia.org/wiki/Fizz_buzz  (Wikipedia FizzBuzz canonical algorithm)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules  (MDN modules guide)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger  (MDN Number.isInteger)
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError  (MDN RangeError)
  - https://www.npmjs.com/package/fizzbuzz  (npm package metadata and install patterns)
  - https://vitest.dev/guide/  (Vitest usage, discovery and install)

- Crawl data size (aggregate approximate): 24.1 KB total (approximate per-source bytes: Wikipedia ~5.5 KB; MDN modules ~4.0 KB; Number.isInteger ~1.8 KB; RangeError ~1.7 KB; npm package page ~2.3 KB; Vitest guide ~8.8 KB). These are best-effort estimates recorded at normalization time.

6. Attribution
- Extracted and normalized from the original URLs listed above; retrieval timestamp: 2026-03-08T23:28:50.948Z
- Data size estimate: 24.1 KB total (see per-source estimates above)

End of SOURCES document
