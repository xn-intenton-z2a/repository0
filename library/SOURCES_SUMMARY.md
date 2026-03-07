SOURCES_SUMMARY

NORMALISED EXTRACT

Table of contents
1. FizzBuzz algorithm and signatures
2. JavaScript ESM module patterns
3. Node.js ESM specifics
4. Number.isInteger specification
5. RangeError specification and conditions
6. TypeError specification and usage
7. Vitest CLI, config keys, and test API
8. Vitest mocking and expect API

1. FizzBuzz algorithm and signatures
- Problem: For integer N >= 1 produce sequence for i = 1..N where each element is:
  - "FizzBuzz" if i % 3 === 0 and i % 5 === 0 (equivalently i % 15 === 0)
  - "Fizz" if i % 3 === 0 and not divisible by 5
  - "Buzz" if i % 5 === 0 and not divisible by 3
  - i (the numeric value) otherwise
- Implementation patterns:
  - Imperative loop: for (let i = 1; i <= n; i++) { check i % 15 === 0, i % 3 === 0, i % 5 === 0 }
  - Streaming: generator function complying with iterator protocol yielding { value, done } via function* fizzBuzzGenerator(n)
  - Memory: array approach returns Array<number|string> of length n; generator keeps O(1) memory
- Function signatures:
  - function fizzBuzzArray(n)
    - Params: n: number (required integer >= 1)
    - Returns: Array<number | string>
  - function* fizzBuzzGenerator(n)
    - Params: n: number (required integer >= 1)
    - Yields: number | string, sequence for i=1..n
- Input validation: verify Number.isInteger(n) && n >= 1; throw new RangeError('n must be >= 1') or new TypeError('n must be integer') depending on error semantics

2. JavaScript ESM module patterns
- File resolution: Node treats .mjs files as ESM; with package.json containing "type": "module" plain .js files are ESM
- Exports:
  - Named export: export function name(...) { }
  - Default export: export default function(...) { }
- Imports:
  - Named import: import { name } from './file.js'
  - Default import: import def from './file.js'
  - Dynamic import: await import('./module.js') returns ModuleNamespace object
- Top-level await is supported in ESM
- Interop: Importing CommonJS packages may provide default export mapping; use dynamic import to load CJS at runtime when necessary

3. Node.js ESM specifics
- package.json: set "type": "module" to treat .js as ESM
- Use import/export; require() and module.exports not available for ESM modules without interop
- CommonJS interop patterns:
  - import pkg from 'cjs-package' then use pkg.default or pkg as module namespace depending on how the package marks exports
  - dynamic import can load CJS packages in some scenarios
- Engines: Node version constraints may be required for ESM-first code (package.json engines: {"node":">=24.0.0"} recommended for parity with repository)

4. Number.isInteger specification
- Signature: Number.isInteger(value) -> boolean
- Behavior: returns true iff typeof value === 'number' and value is a mathematical integer (no fractional part), NaN and Infinity return false; does not coerce strings or other types
- Use: validate that an input is a numeric integer before array sizing or loop bounds

5. RangeError specification and conditions
- Constructor: new RangeError(message?: string) -> RangeError instance
- name property: 'RangeError'
- Typical causes to throw or surface: invalid numeric ranges (negative lengths, out-of-bounds sizes), typed array length/offset out-of-range, numeric arguments outside API-defined bounds
- Handling patterns: throw new RangeError('message') when numeric domain is violated; catch via instanceof RangeError or err.name === 'RangeError'

6. TypeError specification and usage
- Constructor: new TypeError(message?: string) -> TypeError instance
- name property: 'TypeError'
- Typical causes: invalid types for operation (calling non-callable, accessing property on null/undefined, invalid receiver for method), misuse of API requiring specific types
- Handling patterns: validate input types (typeof, Array.isArray, Number.isInteger) and throw new TypeError('message') for API contract violations

7. Vitest CLI, config keys, and test API
- CLI flags:
  - --run : run once and exit
  - --watch : run in watch mode
  - --coverage : enable coverage collection
  - --reporter <name> : choose reporter
- Configuration (vitest.config.js or vitest.config.ts): export defineConfig({ test: { /* options */ } }) or module.exports for CJS
  - test.environment: 'node' | 'jsdom' | <custom>
  - test.include / test.exclude: glob or array of globs
  - test.globals: boolean (true to inject global test APIs)
  - test.setupFiles: string|array of modules executed before tests
  - test.coverage: object configuration for coverage provider and thresholds
  - test.testTimeout: number (ms)
- Test lifecycle signatures:
  - describe(name: string, fn: () => void | Promise<void>)
  - it(name: string, fn: () => any | Promise<any>)  (alias: test)
  - beforeAll(fn: () => any | Promise<any>)
  - afterAll(fn: () => any | Promise<any>)
  - beforeEach(fn: () => any | Promise<any>)
  - afterEach(fn: () => any | Promise<any>)

8. Vitest mocking and expect API
- Global expect signature: expect<T>(actual: T) -> Expect<T>
- Built-in matchers: toBe(expected), toEqual(expected), toBeTruthy(), toBeFalsy(), toContain(item), toMatch(regexp|string), toThrow(error?)
- Extend matchers: expect.extend({ name(actual, expected) { return { pass: boolean, message: () => string } } })
- Mocking API (vi):
  - vi.mock(modulePath, factory?) -> mocks module modulePath; factory is a factory returning mocked exports
  - vi.spyOn(object, 'method') -> returns spy which can be configured with mockImplementationOnce etc.
  - vi.fn(() => ...) -> create function mock
- Best practice: isolate unit tests with mocks for external dependencies and use setupFiles for shared initialization

SUPPLEMENTARY DETAILS
- Validation: use Number.isInteger and explicit range checks; prefer throwing TypeError for invalid types and RangeError for numeric domain violations. Example messages: 'n must be a positive integer' or 'start must be >= 0 and < length'.
- Module layout: export named functions for library surface (export function fizzBuzzArray), provide a default CLI entry in src/lib/main.js that imports named functions and exposes CLI parsing; ensure package.json contains "type": "module" for ESM.
- Testing: place unit tests in tests/unit/ named *.test.js; run with npm run test which maps to vitest --run tests/unit/*.test.js; use vitest --run --coverage for coverage collection.
- Engines: declare node >=24 in package.json engines when relying on modern ESM and language features.

REFERENCE DETAILS (API SPECIFICATIONS AND SIGNATURES)
- Number.isInteger(value: any): boolean
- RangeError constructor: new RangeError(message?: string) -> RangeError
- TypeError constructor: new TypeError(message?: string) -> TypeError
- FizzBuzz functions:
  - fizzBuzzArray(n: number): Array<number | string>
  - fizzBuzzGenerator(n: number): Generator<number | string, void, unknown>
- ESM syntax patterns:
  - export function name(...): void
  - export default function(...): void
  - import { name } from './path/to/module.js'
  - import def from './path/to/module.js'
  - const module = await import('./path/to/module.js')
- Vitest APIs:
  - describe(name: string, fn: () => void | Promise<void>)
  - it(name: string, fn: () => any | Promise<any>)
  - beforeAll(fn: () => any | Promise<any>) etc.
  - expect<T>(actual: T) -> Expect<T> with matchers toBe, toEqual, toContain, toThrow, toMatch, toBeTruthy
  - vi.mock(modulePath: string, factory?: () => any): void
  - vi.spyOn(object: any, method: string): SpyInstance
  - vi.fn(impl?: Function): MockFunction
- Vitest config keys and types:
  - test.environment: string
  - test.include: string | string[]
  - test.exclude: string | string[]
  - test.globals: boolean
  - test.setupFiles: string | string[]
  - test.coverage: object
  - test.testTimeout: number

DETAILED DIGEST
- Sources crawled (retrieved 2026-03-07):
  - https://en.wikipedia.org/wiki/Fizz_buzz
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - https://nodejs.org/api/esm.html
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
  - https://vitest.dev/guide/
  - https://vitest.dev/api/
- Retrieval date: 2026-03-07T15:39:14Z
- Total sources: 8
- Total approximate bytes retrieved during crawl: ~24 KB

ATTRIBUTION
- Content extracted verbatim or condensed from the URLs listed above. Each section aligns to the authoritative documentation pages and the Fizz Buzz Wikipedia entry.
- Data size: ~24 KB across 8 URLs (combined text content extracted)

END OF DOCUMENT
