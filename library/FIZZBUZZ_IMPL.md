FIZZBUZZ IMPLEMENTATION

Table of contents
1. Normalised extract
2. Supplementary details
3. Reference details
4. Detailed digest (SOURCES.md extract)
5. Attribution and data size

1. Normalised extract

Rule set and deterministic contract
- For each integer i in the inclusive sequence 1..n produce an output at array index (i-1).
- Output mapping (priority order):
  - If i % 15 === 0 -> exact string: FizzBuzz
  - Else if i % 3 === 0 -> exact string: Fizz
  - Else if i % 5 === 0 -> exact string: Buzz
  - Else -> the integer i as a number
- Deterministic contract: returned array length MUST equal n; element at index (i-1) corresponds to integer i.

Input validation and canonical error semantics
- Validate using Number.isInteger(n) and Number.isFinite(n).
- Canonical checks and exact throw messages (implement exactly):
  - if (!Number.isInteger(n)) throw new RangeError('n must be an integer');
  - if (n < 1) throw new RangeError('n must be >= 1');
  - const MAX_N = 10000000; if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N);
  - if (!Number.isFinite(n)) throw new RangeError('n must be finite');
- Use RangeError for numeric range/type violations. Do not use TypeError for numeric range messages.

API surface and module consumption
- ESM named export signature (primary): export function fizzBuzz(n: number): Array<string | number>
  - Parameter: n (required) — finite integer, 1 <= n <= MAX_N.
  - Return: Array of length n where each element is either the exact strings Fizz, Buzz, FizzBuzz or the numeric value i.
- CommonJS consumption: require('package').fizzBuzz when package provides a CommonJS entry or CJS interop.
- package.json "type" effects: when "type": "module" present, .js files are ESM; .mjs always ESM; .cjs always CommonJS.

Implementation pattern (concise)
- Algorithm:
  - Allocate result array of length n.
  - For i from 1 to n:
    - if (i % 15 === 0) result[i-1] = 'FizzBuzz'
    - else if (i % 3 === 0) result[i-1] = 'Fizz'
    - else if (i % 5 === 0) result[i-1] = 'Buzz'
    - else result[i-1] = i
- Complexity: Time O(n), Space O(n).
- Safety: enforce MAX_N to avoid excessive memory use; MAX_N recommended 10_000_000.

2. Supplementary details

Performance and bounds
- Memory usage: approx 8 bytes per numeric element plus array overhead; large n can quickly exceed memory. For n close to MAX_N, expect significant heap allocation and potential GC pressure.
- Streaming variant: for very large ranges, emit outputs incrementally (generator or callback) instead of returning a full array to reduce peak memory use.

Testing and tooling
- Unit test runner: Vitest. Typical commands:
  - install dev dependency: npm install --save-dev vitest
  - run unit tests: npx vitest --run tests/unit/*.test.js
  - package.json script: "test": "vitest --run tests/unit/*.test.js"
- Test assertions to include:
  - Correct length of returned array for sample n values.
  - Exact string equality for Fizz, Buzz, FizzBuzz cases.
  - RangeError instance type and exact message string for invalid inputs.

NPM and CI considerations
- Install package: npm install --save fizzbuzz
- Inspect package metadata before use: npm view fizzbuzz --json
- CI reproducible install: use npm ci with lockfile or yarn install --frozen-lockfile.
- Pin exact versions in CI to avoid unexpected runtime behaviour.

3. Reference details

Exact API signatures and types
- ESM export
  - Signature: export function fizzBuzz(n: number): Array<string | number>
  - Parameters: n: number — finite integer satisfying 1 <= n <= MAX_N
  - Returns: Array<string | number> length === n
- CommonJS export pattern (implementation surface)
  - module.exports = { fizzBuzz: function fizzBuzz(n) { /* ... */ } }

Platform primitives and constructors
- Number.isInteger(value): boolean
  - Behavior: returns true only if typeof value === 'number', value is finite, and value has zero fractional component.
- RangeError(message?: string): RangeError
  - Usage: throw new RangeError('message')
  - Instance checks: thrown instanceof RangeError === true

Exact validation checks and messages (copyable)
- if (!Number.isInteger(n)) throw new RangeError('n must be an integer');
- if (!Number.isFinite(n)) throw new RangeError('n must be finite');
- if (n < 1) throw new RangeError('n must be >= 1');
- const MAX_N = 10000000; if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N);

Module resolution specifics (package.json)
- package.json type field values and effects:
  - "type": "module" -> treat .js as ESM
  - absent or "commonjs" -> treat .js as CommonJS
- File extensions override type: .mjs always ESM, .cjs always CJS

Best practices and troubleshooting
- When tests fail asserting error messages, verify exact thrown message and error type (RangeError). Avoid loosened checks like matching substrings.
- For cross-environment compatibility, provide both ESM and CommonJS exports or document expected import style and ensure package.json exports field maps entry points accordingly.
- For very large n values, prefer generator-based API: function* fizzBuzzGenerator(n) { validate; for (i=1..n) yield ... }

4. Detailed digest (SOURCES.md extract)

Sources extracted (literal list from project SOURCES.md):
- https://en.wikipedia.org/wiki/Fizz_buzz
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
- https://www.npmjs.com/package/fizzbuzz
- https://vitest.dev/guide/

Content retrieval date: 2026-03-08

Key technical content pulled from sources and normalised above: FizzBuzz rule set and deterministic contract; Number.isInteger behaviour; RangeError constructor and recommended messages; ESM vs CommonJS module rules and package.json type field; Vitest usage notes; NPM package inspection and install commands.

5. Attribution and data size

Attribution: content derived from the URLs listed in the SOURCES.md file in the repository root and canonical JavaScript/Node.js references.
Data size obtained during crawling: 591 bytes (SOURCES.md content as read from repository on 2026-03-08).

End of document
