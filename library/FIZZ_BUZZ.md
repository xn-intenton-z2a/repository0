FIZZ_BUZZ

NORMALISED EXTRACT

Table of contents
1. Problem definition and required behaviour
2. Algorithm and implementation patterns
3. Function signatures and types
4. Input validation and errors
5. Performance and limits
6. Testing patterns (Vitest)

1. Problem definition and required behaviour
- Given a positive integer N produce an ordered sequence for i = 1..N where each element is either:
  - "FizzBuzz" if i is divisible by both 3 and 5 (i % 15 === 0)
  - "Fizz" if i is divisible by 3 only (i % 3 === 0)
  - "Buzz" if i is divisible by 5 only (i % 5 === 0)
  - the integer i otherwise
- Output representations: in-memory array of length N with elements typed as number or string, or an iterator/stream that yields values in order.
- Deterministic mapping: mapping rule must be applied in priority order: check divisible-by-15 first (or both conditions) then 3 then 5.

2. Algorithm and implementation patterns
- Simple imperative loop (for i = 1; i <= N; i++): compute remainder checks using modulo operator. Use combined condition (i % 15 === 0) to avoid duplicate checks and ensure correct precedence.
- Branching order: if (i % 15 === 0) -> "FizzBuzz"; else if (i % 3 === 0) -> "Fizz"; else if (i % 5 === 0) -> "Buzz"; else i.
- Streaming alternative: implement a generator function that yields values one at a time to keep O(1) memory usage. Iterator signature should comply with JavaScript iterator protocol (next(): {value, done}).
- ESM export pattern: export named functions (export function fizzBuzzArray(n) {...}) and export generator (export function* fizzBuzzGenerator(n) {...}). Use package.json "type": "module" or .mjs extension for Node ESM compatibility.

3. Function signatures and types
- JavaScript (informal): function fizzBuzzArray(n)
  - Parameters: n — number (required), must be an integer >= 1
  - Returns: Array<number|string> length n (1-based mapping)
- JavaScript (generator): function* fizzBuzzGenerator(n)
  - Parameters: n — number (required), must be an integer >= 1
  - Returns: Generator yielding number|string values for i = 1..n
- TypeScript signature examples (for reference):
  - export function fizzBuzzArray(n: number): Array<number | string>
  - export function* fizzBuzzGenerator(n: number): Generator<number | string, void, unknown>
- ESM export patterns:
  - Named exports: export { fizzBuzzArray, fizzBuzzGenerator }
  - Default export if library chooses single entry: export default fizzBuzzArray

4. Input validation and errors
- Validation rules:
  - If typeof n !== 'number' -> throw TypeError with message: "n must be a number"
  - If !Number.isInteger(n) -> throw RangeError with message: "n must be an integer"
  - If n < 1 -> throw RangeError with message: "n must be >= 1"
  - Upper-bound recommendation: if n is extremely large (e.g., n > 10_000_000) either throw RangeError or require streaming mode; include message: "n exceeds practical limit; use generator for streaming"
- Use built-in checks: Number.isInteger(n) to avoid coercion. Throw instances of Error subclasses (TypeError, RangeError) rather than raw values.

5. Performance and limits
- Time complexity: O(n) arithmetic operations and branching per element.
- Memory:
  - Array implementation: O(n) memory; avoid for very large n.
  - Generator/stream implementation: O(1) memory (aside from call stack and per-item overhead).
- Numerical limits:
  - Node/JS safe integer constraints: ensure n <= Number.MAX_SAFE_INTEGER when using arithmetic that depends on integer precision; realistically cap to much lower value for performance (recommend cap 10 million for in-memory arrays).

6. Testing patterns (Vitest)
- Test imports: import { it, expect } from 'vitest'
- Unit test cases to include:
  - Basic ranges: n = 1, 2, 3, 4, 5, 15
  - Boundary validation: non-number (string/null/undefined), non-integer (3.1), negative/zero, very large n
  - Content checks: for sample n assert element-wise equality, e.g., position 3 -> "Fizz", 5 -> "Buzz", 15 -> "FizzBuzz"
  - Generator tests: consume generator and assert sequence equals expected array
- Example assertion pattern: expect(fizzBuzzArray(5)).toEqual([1,2,"Fizz",4,"Buzz"])
- Run tests: npm run test or npm run test:unit when coverage required

SUPPLEMENTARY DETAILS

- Divisibility evaluation: use modulo operator (%) with strict equality to 0. Avoid floating point checks. Using (i % 15 === 0) is most efficient and correct for combined case.
- Export packaging: package.json must include "type": "module" to use ESM import/export with .js extension in Node >= 12+, prefer Node >=24 as repository suggests.
- Error messages: keep messages exact and stable to allow tests to assert errors by message when appropriate.

REFERENCE DETAILS (API SPECIFICATIONS, SIGNATURES, CONFIGURATION)

Function: fizzBuzzArray
- Signature: fizzBuzzArray(n: number): Array<number | string>
- Parameters: n — integer number, required; precondition: Number.isInteger(n) === true and n >= 1
- Returns: ordered array of length n where index i-1 corresponds to value for integer i
- Throws: TypeError if typeof n !== 'number'; RangeError if not integer or n < 1 or n exceeds configured upper bound
- Implementation pattern: allocate new Array(n), fill via for loop from i=1..n, assign mapped values

Function: fizzBuzzGenerator
- Signature: function* fizzBuzzGenerator(n: number): Generator<number | string, void, unknown>
- Parameters: same as fizzBuzzArray
- Returns: JS Generator yielding number|string values for i = 1..n
- Throws: same validation behavior as fizzBuzzArray (validate before yielding any values)
- Use-case: prefer generator for large n to avoid memory pressure

ESM configuration
- package.json: "type": "module" to treat .js files as ESM
- Export pattern: export function fizzBuzzArray(n) { ... }
- Import pattern: import { fizzBuzzArray } from './lib/fizz.js'

Vitest usage
- Test file layout: tests/unit/fizz.test.js
- Runner: vitest --run tests/unit/*.test.js (npm script: npm run test)
- Assertion methods: expect(...).toEqual(...); for thrown errors: expect(() => fizzBuzzArray('3')).toThrow(TypeError)

BEST PRACTICES AND IMPLEMENTATION EXAMPLES

- Prefer explicit numeric checks using Number.isInteger(n) and typeof checks; do not rely on implicit coercion.
- Offer both array and generator APIs to let callers choose between simplicity and memory efficiency.
- Keep error messages stable to enable unit tests to assert on them.
- Provide documentation comment above exports that describes parameter preconditions and return type.

TROUBLESHOOTING

1. Symptom: Tests failing because function returns strings for all values.
   Fix: Check branching order; ensure combined condition for 15 is tested first.
2. Symptom: Memory pressure for large n when using fizzBuzzArray.
   Fix: Switch to fizzBuzzGenerator or cap allowed n and document limitation.
3. Symptom: Type checking assertions in tests fail because non-integer input is coerced.
   Fix: Use Number.isInteger for validation; ensure tests pass a number not a string.
4. Symptom: ESM import fails in Node with "Cannot use import statement outside a module".
   Fix: Add "type": "module" to package.json or use .mjs extension for module files.

DIGEST (sources and retrieval)
- Extracted technical content from the following sources listed in project SOURCES.md on 2026-03-07:
  - https://en.wikipedia.org/wiki/Fizz_buzz
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - https://nodejs.org/api/esm.html
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
  - https://vitest.dev/guide/
  - https://vitest.dev/api/
- Retrieval date: 2026-03-07
- Data size obtained during crawling: 0 bytes fetched (SOURCES.md provided URLs only; no external content retrieved during this run)

ATTRIBUTION
- Source list: the URLs above. Content synthesized from those canonical sources.
- Author: derived by repository tooling on 2026-03-07

END OF DOCUMENT
