CRAWL_SUMMARY

Table of contents
1. Normalised extract
2. Supplementary details
3. Reference details
4. Troubleshooting and best practices
5. Detailed digest and retrieval metadata
6. Attribution and data size

1. Normalised extract

FizzBuzz rule set and deterministic contract
- For each integer i in the inclusive sequence 1..n produce an output at array index (i-1).
- Output mapping (priority order):
  - If i % 15 === 0 -> output exact string: FizzBuzz
  - Else if i % 3 === 0 -> output exact string: Fizz
  - Else if i % 5 === 0 -> output exact string: Buzz
  - Else -> output the integer i as a number
- Deterministic contract: returned array length MUST equal n; element order MUST correspond to integers 1..n.

Input validation and error semantics
- Validate parameter n using Number.isInteger(n) -> boolean.
- Reject NaN, +Infinity, -Infinity and non-number types.
- Enforce lower bound: n >= 1. If violated, throw new RangeError('n must be >= 1').
- Enforce recommended upper bound: MAX_N = 10000000. If violated, throw new RangeError('n must be <= ' + MAX_N).
- If not integer: throw new RangeError('n must be an integer').
- Use RangeError for numeric range/type violations: new RangeError(message) -> RangeError instance with name 'RangeError' and message.

API surface and module loading
- ESM named export signature: export function fizzBuzz(n: number): Array<string | number>
- Consumption patterns:
  - ESM: import { fizzBuzz } from 'package'
  - CommonJS interop: require('package').fizzBuzz when package provides CJS entry or uses module interop.
- package.json type field effects:
  - "type": "module" -> .js files treated as ESM; .mjs always ESM; .cjs always CommonJS.

Testing and tooling
- Install vitest as dev dependency: npm install --save-dev vitest
- Typical CLI use: npx vitest --run [--coverage] [--config <file>]
- Common test script: "test": "vitest --run tests/unit/*.test.js"

NPM package considerations
- Install: npm install --save fizzbuzz
- Inspect metadata before use: npm view fizzbuzz --json
- Use lockfile installs in CI: npm ci or yarn install --frozen-lockfile

2. Supplementary details

Memory and performance considerations
- Output array length grows linearly with n; allocating an array of length n with mixed strings and numbers requires O(n) memory.
- Safe upper bound recommendation: MAX_N = 10000000 to limit memory footprint; at n = 10 million, memory allocation may exceed typical CI limits.
- Time complexity: O(n) with a small constant factor per iteration (few arithmetic ops and conditional checks).

Implementation notes
- Combined-case detection: check i % 15 === 0 first for minimal branching or evaluate (i % 3 === 0 && i % 5 === 0).
- Prefer numeric outputs for typed APIs; convert to string only if API explicitly requires string outputs.
- Validation order: first validate Number.isInteger(n), then check finite, then bounds to provide deterministic error messages.

3. Reference details

Exact API signature
- Signature: export function fizzBuzz(n: number): Array<string | number>
- Parameters: n (required) - integer, inclusive upper bound of sequence starting at 1.
- Returns: array of length n where element at index (i-1) is either number i or exact strings 'Fizz','Buzz','FizzBuzz'.

Errors and messages
- If Number.isInteger(n) === false -> throw new RangeError('n must be an integer')
- If n < 1 -> throw new RangeError('n must be >= 1')
- If n > MAX_N -> throw new RangeError('n must be <= ' + MAX_N)

Module export patterns
- ESM named export: export function fizzBuzz(n) { /*...*/ }
- CJS export (if providing compatibility): module.exports = { fizzBuzz }

Vitest configuration keys (explicit)
- include: string[] | string
- exclude: string[] | string
- environment: 'node' | 'jsdom' | string
- globals: boolean
- setupFiles: string[]
- setupFilesAsync: string[]
- reporters: Array<string|[string,any]>
- threads: boolean

4. Troubleshooting and best practices

Common failure modes and fixes
- Symptom: tests fail with RangeError when n is a float. Fix: ensure the public call site passes an integer or add input coercion layer documented in API.
- Symptom: memory OOM on CI for large n. Fix: lower MAX_N, stream outputs instead of building full array, or implement generator-based API.
- Symptom: import fails with SyntaxError under Node when package uses ESM and consumer expects CJS. Fix: provide a CJS entry, publish both module and main fields, or instruct consumers to use ESM import style and set package.json "type" accordingly.

Best practices
- Provide both typed numeric and string-returning variants if consumers require different behaviours: fizzBuzzNumbers(n) -> Array<number|string> and fizzBuzzStrings(n) -> Array<string>.
- Make MAX_N configurable via exported constant or options object and document trade-offs.
- Use precise RangeError messages to enable programmatic checks in consumers.

5. Detailed digest and retrieval metadata

Source URLs processed (retrieved 2026-03-08):
- https://en.wikipedia.org/wiki/Fizz_buzz
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
- https://www.npmjs.com/package/fizzbuzz
- https://vitest.dev/guide/

Retrieval date: 2026-03-08T14:18:23.472Z

6. Attribution and data size

Attribution: Content assembled from the above sources; canonical owners: Wikipedia, MDN Web Docs (Mozilla), npm registry, Vitest project.

SOURCES.md file size: 591 bytes

End of document
