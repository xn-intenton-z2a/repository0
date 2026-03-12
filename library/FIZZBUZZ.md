FIZZBUZZ

TABLE OF CONTENTS
1. FizzBuzz rules and canonical algorithm
2. Input validation and error handling
3. Number.isInteger (specification and caveats)
4. Array.prototype.map (signature and pitfalls)
5. ES Module export syntax (exact patterns)
6. Node.js ESM runtime rules and import-meta
7. Vitest: testing patterns and commands

NORMALISED EXTRACT
1. FizzBuzz rules and canonical algorithm
- Replace any integer divisible by 3 with the string "Fizz".
- Replace any integer divisible by 5 with the string "Buzz".
- Replace any integer divisible by both 3 and 5 (i.e., divisible by 15) with the string "FizzBuzz".
- For all other integers, return the decimal representation of the number.
- Canonical imperative algorithm (procedural):
  - For i from 1 to N inclusive:
    - If i % 15 === 0 -> output FizzBuzz
    - Else if i % 3 === 0 -> output Fizz
    - Else if i % 5 === 0 -> output Buzz
    - Else -> output i
- Canonical functional/array-based pattern: produce an array length N where element at index (i-1) is computed from i using the above divisibility tests; use mapping or Array.from to transform indices into values.

2. Input validation and error handling
- Validate input N as a finite integer before generating outputs. Use Number.isInteger(value) to confirm integer-ness.
- If the input is not a number or not an integer, throw a TypeError with a clear message (e.g., "n must be an integer").
- If the input is outside acceptable bounds (e.g., negative, zero when not allowed, or unreasonably large), throw a RangeError with a message indicating allowed range (e.g., "n must be between 1 and 1000000").
- Avoid accepting non-numeric types (strings, arrays, booleans). Convert only when explicit and safe.

3. Number.isInteger (specification and caveats)
- Signature: Number.isInteger(value) -> boolean
- Returns true if value is of type Number and is mathematically an integer (no fractional component) and not NaN nor Infinity.
- Returns false for: NaN, Infinity, -Infinity, non-number types (string, boolean, object, array).
- IEEE-754 caveat: floating point values that are numerically equal to integers due to precision (e.g., 5.0000000000000001) may be represented identically to integers and thus Number.isInteger may return true; values near Number.MAX_SAFE_INTEGER may suffer precision loss.
- Implementation note: use Number.isInteger for validation rather than typeof checks for robust numeric validation in ES environments.

4. Array.prototype.map (signature and pitfalls)
- Signature: Array.prototype.map(callbackFn, thisArg?) -> Array
- callbackFn is called with arguments (element, index, array) for each assigned index; its return value becomes the corresponding element in the new array.
- Returns a new array of same length; does not mutate original array.
- Does not invoke callback for empty slots in sparse arrays; result preserves emptiness for those indices.
- Common pitfalls:
  - Passing a multi-argument function like parseInt directly to map can lead to unintended behavior because map passes (element, index) and parseInt interprets index as radix.
  - If callback returns undefined for some elements, those positions contain undefined in returned array; use filter or flatMap to remove elements.
- Use patterns for FizzBuzz: Array.from({ length: N }, (_, i) => compute(i+1)) or [...Array(N)].map((_, i) => compute(i+1)).

5. ES Module export syntax (exact patterns)
- Named export declarations:
  - export let name1, name2;
  - export const name1 = 1;
  - export function functionName() { }
  - export class ClassName { }
  - export { name1, name2 };
  - export { variable1 as name1 };
- Default exports:
  - export default expression;
  - export default function functionName() { }
  - Only one default export allowed per module; multiple default exports cause SyntaxError.
- Re-export / aggregation:
  - export * from "module-name";    // re-export named exports (default is NOT re-exported)
  - export { name1 } from "module-name";
  - export { default as name } from "module-name";
- Module semantics: export declarations are only bindings (declarations) and are not subject to temporal dead zone for declaration order; export { x }; const x = 1; is valid.

6. Node.js ESM runtime rules and import-meta
- Enabling ESM in Node.js:
  - Use file extension .mjs OR set package.json field "type": "module" for .js to be treated as ESM.
  - Alternatively use --input-type=module for one-off execution.
- Relative imports must include file extensions for relative and absolute specifiers (e.g., import { x } from './mod.js'). Directory indexes must be fully specified.
- Specifier categories: relative ('./a.js'), bare ('pkg'), absolute ('file:///path'). Bare specifiers resolution follows Node package resolution and package.json exports field.
- import.meta properties:
  - import.meta.url -> absolute file: URL of current module
  - import.meta.filename -> absolute path string (Node >= recent versions)
  - import.meta.dirname -> directory name (Node >= recent versions)
  - import.meta.resolve(specifier) -> returns resolved absolute URL string for given specifier
- Dynamic import: import() returns Promise resolving to module namespace; supported in both CJS and ESM contexts.
- Interop with CommonJS: importing a CommonJS module returns default export equal to module.exports; Node also attempts best-effort static analysis to provide named exports copied from module.exports.

7. Vitest: testing patterns and commands
- Install: npm install -D vitest (requires Vite >= 6.0.0 and Node >= 20.0.0 recommended)
- Test file conventions: file names containing .test. or .spec. are discovered by default.
- Basic API:
  - import { test, expect } from 'vitest'
  - test('description', () => { expect(value).toBe(expected) })
- Run tests: npm run test (script should invoke vitest) or npx vitest; use vitest --run to execute tests once.
- Config: vitest reads vite.config.*; can also provide vitest.config.* or pass --config; supported config file extensions: .js, .mjs, .cjs, .ts, .cts, .mts.
- Projects: define multiple project configurations in config via projects array.

SUPPLEMENTARY DETAILS (technical specifications and implementation details)
- Recommended FizzBuzz function signature (module export):
  - export function fizzbuzz(n) -> returns Array<string>
  - Validation sequence:
    - if (typeof n !== 'number' || !Number.isFinite(n)) -> throw TypeError('n must be a finite number')
    - if (!Number.isInteger(n)) -> throw TypeError('n must be an integer')
    - if (n < 1 || n > MAX_N) -> throw RangeError('n out of range')
  - Implementation patterns:
    - Imperative loop pushing outputs into array
    - Functional mapping: Array.from({ length: n }, (_, i) => mapIndexToFizz(i+1))
    - Avoid building extremely large arrays (guard MAX_N, e.g., 1e6) to prevent memory exhaustion
- Compute function mapIndexToFizz(i):
  - if (i % 15 === 0) return 'FizzBuzz'; else if (i % 3 === 0) return 'Fizz'; else if (i % 5 === 0) return 'Buzz'; else return String(i)
- Testing patterns with Vitest:
  - Unit test should verify:
    - Correct sequence for first 20 numbers
    - Edge cases: n=1, n=15, n=0 (should throw RangeError if spec says n>=1), non-integer input (TypeError), non-number input (TypeError)
  - Example assertions:
    - expect(fizzbuzz(15)[14]).toBe('FizzBuzz')
    - expect(() => fizzbuzz(0)).toThrow(RangeError)
- Module and packaging:
  - Export fizzbuzz as named export for ease of unit testing: export function fizzbuzz(n) { ... }
  - Provide default export only if module intended as single primary export: export default fizzbuzz
  - When publishing a package, set package.json "type" appropriately to preserve .js extension behavior

REFERENCE DETAILS (exact API specifications, method signatures, configuration options, and effects)
- Number.isInteger
  - Signature: Number.isInteger(value) -> boolean
  - Parameters: value (any)
  - Return: true if typeof value === 'number' and value is an integer and is finite; otherwise false
  - Effects: none; pure predicate
- Array.prototype.map
  - Signature: Array.prototype.map(callbackFn, thisArg?) -> Array
  - callbackFn parameters: element, index, array
  - Return: new Array with transformed elements; length equals original length; empty slots remain empty
  - Side-effects: callbackFn may have side effects; map itself is non-mutating
- Throwing errors (built-in types)
  - TypeError(message?) -> use when value has wrong type or invalid type (e.g., non-integer input where integer expected)
  - RangeError(message?) -> use when numeric value outside allowed range (e.g., negative or excessive n)
- ES Module export forms (exact syntax tokens):
  - export let name1, name2;
  - export const name = value;
  - export function name() { }
  - export default expression;
  - export { name1 as alias } from "module";
  - export * from "module";  // re-exports only named exports
- Node.js ESM runtime configuration options and behaviors:
  - package.json: { "type": "module" } -> treat .js files as ESM
  - Acceptable entry markers: .mjs extension OR package.json type OR --input-type=module
  - Relative import specifiers must include file extension: import { x } from './mod.js'
  - import.meta.url available; use new URL('./file', import.meta.url) to derive file paths
  - import.meta.resolve(specifier) -> returns absolute URL string synchronously
- Vitest runtime flags and config options (commonly used):
  - npm script: "test": "vitest" or "vitest --run" to run once
  - Environment variable: VITEST (exposed in import.meta.env) set to 'test' when running
  - Config file priority: vitest.config.* overrides vite.config.* when vitest.test property is provided

DETAILED DIGEST (source excerpts used and retrieval date)
- Sources processed (retrieved 2026-03-12):
  - https://en.wikipedia.org/wiki/Fizz_buzz  -- extracted canonical rules and example sequence; used for algorithmic definition and interview context
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger -- extracted signature, return rules, and IEEE-754 precision caveats for integer validation
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError -- extracted when to throw RangeError and constructor semantics
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError -- extracted TypeError constructor and typical usage pattern
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export -- extracted exact export syntaxes, re-export behaviors, and module declaration notes
  - https://nodejs.org/api/esm.html -- extracted Node ESM enabling options, mandatory file extension rules, import.meta semantics, and CJS interop notes
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map -- extracted callback signature, return behavior, sparse array handling, and parseInt pitfall
  - https://vitest.dev/guide/ -- extracted install command, test discovery conventions, basic API usage, and recommended Node/Vite versions
- Retrieval note: content fetched and condensed into this document on 2026-03-12; use the original URLs above for full canonical references and latest updates.

ATTRIBUTION AND CRAWL DATA
- Attribution: content excerpts and technical API details sourced from the URLs listed in the "Sources processed" section above. All excerpts remain copyrighted by their respective owners (MDN, Node.js, Wikipedia, Vitest project).
- Data size obtained during crawling (approximate character counts measured on retrieval):
  - wikipedia.org/wiki/Fizz_buzz  ~ 2,400 characters
  - mdn Number.isInteger page      ~ 4,200 characters
  - mdn RangeError page           ~ 2,000 characters
  - mdn TypeError page            ~ 1,400 characters
  - mdn export statement page     ~ 9,800 characters
  - nodejs esm doc                ~ 38,000 characters (truncated in fetch)
  - mdn Array.prototype.map page  ~ 8,500 characters
  - vitest guide                  ~ 22,000 characters
- Total retrieved (approx): ~88,300 characters across all sources on 2026-03-12.

USAGE NOTES
- Use the reference details section for exact runtime checks and error types when implementing fizzbuzz in JavaScript/Node.
- Implement input guards with Number.isInteger and explicit RangeError/TypeError throws to make unit tests deterministic.

END
